import React, {useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper"
import {
    appLog, CheckConnectivity, dateFormat,
    getDateWithFormat, getItem, getLeftRight, getOrders, getPrintTemplate, getTemplate, getTempOrders, getTrimChar,
    isEmpty, numberFormat, objToArray, printInvoice,

    retrieveData,
    storeData, syncInvoice,
    toCurrency
} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {
    ACTIONS,
    adminUrl,
    defaultInvoiceTemplate, ItemDivider,
    localredux,
    METHOD,
    posUrl,
    PRINTER,
    STATUS,
    VOUCHER
} from "../../libs/static";
import apiService from "../../libs/api-service";
import ProIcon from "../../components/ProIcon";
import {AddItem} from "../Items/ItemListTablet";


const Index = ({ordersData}:any) => {

    let {
        initData,
        licenseData,
    }: any = localredux;


    const [data, setData] = useState<any>({});


    useEffect(() => {
        getOrders().then((orders:any)=>{
            apiService({
                method: METHOD.GET,
                action: ACTIONS.REPORT_SALES,
                workspace: initData.workspace,
                token: licenseData?.token,
                queryString: {terminalid: licenseData?.data?.terminal_id},
                hideLoader: true,
                hidealert: true,
                other: {url: posUrl},
            }).then((response: any) => {
                setData({...orders, ...response?.data})
            })
        })
    }, [ordersData])


    const printData = async (invoice: any) => {


        const {workspace, tax}: any = localredux.initData;

        const {token}: any = localredux.authData;


        await apiService({
            method: METHOD.GET,
            action: ACTIONS.VOUCHER,
            queryString: {voucherdisplayid: invoice.voucherdisplayid, vouchertype: VOUCHER.INVOICE},
            workspace: workspace,
            token: token,
            other: {url: adminUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS) {

                const {voucheritems, receipt}: any = result.data

                result.data = {
                    ...result.data,
                    invoiceitems: Object.values(voucheritems).map((item:any)=>{
                        return {...item,change:true}
                    }),
                    payment: Object.values(receipt).map((payment: any) => {
                        return {paymentAmount: payment.amount, paymentby: payment.payment}
                    })
                }

                printInvoice(result.data).then()
            }
        });


    }


    const renderItem = ({item, index}: any) => {
        let name = item?.clientname;

        if (item?.voucherprefix && item?.voucherdisplayid) {
            name = `${item?.voucherprefix}${item?.voucherdisplayid} ${name}`
        }

        return <TouchableOpacity style={[styles.p_5]}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>
                <View style={[styles.w_auto]}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>

                        <View>
                            <Paragraph
                                style={[styles.paragraph,styles.bold]}>{getDateWithFormat(item?.date, dateFormat(true))}</Paragraph>
                            <Paragraph style={[styles.paragraph]}>{name}</Paragraph>
                        </View>
                    </View>
                </View>
                <View style={{width: 50}}>
                    {Boolean(item?.voucherdisplayid) && <TouchableOpacity onPress={() => {
                        printData(item).then()
                    }}>
                        <ProIcon name={'print'} type={'solid'} size={15}/>
                    </TouchableOpacity>}
                </View>
                {<View style={{width: 80}}>
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotaldisplay)}</Paragraph>
                    {Boolean(item?.voucherdisplayid) &&
                        <Paragraph
                            style={[styles.paragraph, styles.text_xs, {
                                textAlign: 'right',
                                color: styles.green.color
                            }]}>Synced</Paragraph>
                    }
                </View>}
            </View>


        </TouchableOpacity>
    }

    return <Container>
        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>


                <FlatList
                    data={Object.values(data).reverse()}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    renderItem={renderItem}

                    ListEmptyComponent={<View>
                        <View style={[styles.p_6]}>
                            <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>No any items found</Text>

                        </View>

                    </View>}

                    ItemSeparatorComponent={ItemDivider}
                />

            </Card.Content>
        </Card>
    </Container>

}


const mapStateToProps = (state: any) => ({
    ordersData: state.ordersData,
})

export default connect(mapStateToProps)(Index);



