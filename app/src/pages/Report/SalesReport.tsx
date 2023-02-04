import React, {useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Caption, Card, Paragraph} from "react-native-paper"
import {
    appLog,
    base64Encode,
    dateFormat,
    getDateWithFormat,
    getOrders,
    printInvoice,
    toCurrency
} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, ItemDivider, localredux, METHOD, STATUS, urls, VOUCHER} from "../../libs/static";
import apiService from "../../libs/api-service";

import moment from "moment";
import ProIcon from "../../components/ProIcon";
import PageLoader from "../../components/PageLoader";



const SalesReport = ({ordersData,navigation}: any) => {

    let {
        licenseData,
    }: any = localredux;

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;
    const dispatch = useDispatch()

    const [data, setData] = useState<any>([]);
    const [loader,setLoader] = useState(false);
    const [unsynced,setUnsynced] = useState(false);
    const [localorder,setLocalorder] = useState(ordersData);


    useEffect(() => {

        getOrders().then((orders:any)=>{
            if(Boolean(orders)) {
                setLocalorder(Object.values(orders).reverse())
            }
        })


        apiService({
            method: METHOD.GET,
            action: ACTIONS.REPORT_SALES,
            workspace: workspace,
            token: token,
            queryString: {terminalid: licenseData?.data?.terminal_id,vouchertypeid: VOUCHER.INVOICE},
            hideLoader: true,
            hidealert: true,
            other: {url: urls.posUrl},
        }).then((response: any) => {

            setData(Object.values(response?.data).reverse())
            setLoader(true)
        }).catch(()=>{
            setLoader(true)
        })
    }, [ordersData])


    const printPreview = async (invoice:any) => {
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.PRINTING,
            queryString: {voucherid: invoice.voucherid, printingtemplate: 1},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS) {
                navigation.push('Preview',{data:base64Encode(result.data)})
            }

        });
    }

    const getOrderDetail = async (invoice: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.INVOICE,
            queryString: {voucherdisplayid: invoice.voucherdisplayid, vouchertypeid: VOUCHER.INVOICE},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS) {
                let data:any = result.data?.result;
                const {voucheritems, receipt}: any = data;
                const payment = Boolean(receipt) ? Object.values(receipt)?.map((payment: any) => {
                    return {paymentAmount: payment.amount, paymentby: payment.payment}
                }) : []
                data = {
                    ...data,
                    clientname:data.client,
                    invoiceitems: Object.values(voucheritems)?.map((item: any) => {
                        return {...item, change: true}
                    }),
                    payment: payment,
                }

                printInvoice(data).then((xmlData:any)=>{
                    //navigation.push('Preview',{data:base64Encode(xmlData)})
                })
            }
        });
    }

    if (!loader) {
        return <PageLoader/>
    }

    navigation.setOptions({
        headerRight:()=>{
            return <TouchableOpacity onPress={()=>setUnsynced(!unsynced)}><Paragraph>{unsynced?'Synced':'Unsynced'}</Paragraph></TouchableOpacity>
        }
    })


    const renderItem = ({item, index}: any) => {

        const {terminal_name}: any = localredux.licenseData.data;



        let name = `(${terminal_name}-${item?.posinvoice || item.invoice_display_number}) - ${item?.clientname}`

        if (item?.voucherprefix && item?.voucherdisplayid) {
            name = `${item?.voucherprefix}${item?.voucherdisplayid}  ${item?.clientname} (${terminal_name}-${item?.posinvoice})`
        }

        if(!Boolean(item.localdatetime)){
            item.localdatetime = item.date
        }

        return <TouchableOpacity style={[styles.py_5]} key={index}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                <View style={[styles.w_auto]}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>
                        <View>
                            <Paragraph style={[styles.paragraph, styles.bold]}>{name}</Paragraph>
                            <Paragraph style={[styles.paragraph, styles.text_xs]}>{moment(item.localdatetime).format(dateFormat(true))}</Paragraph>
                        </View>
                    </View>
                </View>
                <View style={{width: 50}}>
                    {Boolean(item?.voucherdisplayid) && <TouchableOpacity onPress={() => {
                        Boolean(item?.voucherdisplayid) &&  getOrderDetail(item).then()
                    }}>
                        <ProIcon name={'print'} type={'solid'} size={15}/>
                    </TouchableOpacity>}
                </View>
                {<View style={{width: 100}}>
                    <Paragraph
                        style={[styles.paragraph,styles.bold, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotaldisplay)}</Paragraph>
                    {Boolean(item?.voucherdisplayid) ?
                        <Paragraph
                            style={[styles.paragraph, styles.text_xs, {
                                textAlign: 'right',
                                color: styles.green.color
                            }]}>Synced</Paragraph> :
                        <Paragraph
                            style={[styles.paragraph, styles.text_xs, {
                                textAlign: 'right',
                                color: styles.red.color
                            }]}>Sync in progress</Paragraph>
                    }
                </View>}
            </View>


        </TouchableOpacity>
    }



    return <Container>
        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>

                {<FlatList
                    style={[styles.listitem]}
                    data={(unsynced ? localorder : data)}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    renderItem={renderItem}
                    ListEmptyComponent={<View>
                        <View style={[styles.p_6]}>
                            <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>No any {unsynced?'unsynced':'synced'} items found</Text>

                        </View>
                    </View>}

                    ItemSeparatorComponent={ItemDivider}
                />}

            </Card.Content>
        </Card>
    </Container>

}


const mapStateToProps = (state: any) => ({
    ordersData: Object.values(state?.ordersData).reverse() || [],
})

export default connect(mapStateToProps)(SalesReport);



