import React, {useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card, Paragraph} from "react-native-paper"
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
import {connect} from "react-redux";
import {ACTIONS, ItemDivider, localredux, METHOD, STATUS, urls, VOUCHER} from "../../libs/static";
import apiService from "../../libs/api-service";
import ProIcon from "../../components/ProIcon";

import moment from "moment";
import {useNavigation} from "@react-navigation/native";


const Index = ({ordersData,navigation}: any) => {

    let {
        licenseData,
    }: any = localredux;

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const [data, setData] = useState<any>({});


    useEffect(() => {
        getOrders().then((orders: any) => {
            apiService({
                method: METHOD.GET,
                action: ACTIONS.REPORT_SALES,
                workspace: workspace,
                token: token,
                queryString: {terminalid: licenseData?.data?.terminal_id},
                hideLoader: true,
                hidealert: true,
                other: {url: urls.posUrl},
            }).then((response: any) => {
                setData({...orders, ...response?.data})
            })
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
                const {voucheritems, receipt}: any = result.data?.result

                data = {
                    ...data,
                    invoiceitems: Object.values(voucheritems).map((item: any) => {
                        return {...item, change: true}
                    }),
                    payment: Object.values(receipt).map((payment: any) => {
                        return {paymentAmount: payment.amount, paymentby: payment.payment}
                    })
                }

                printInvoice(data,true).then((xmlData:any)=>{
                    navigation.push('Preview',{data:base64Encode(xmlData)})
                })

            }



        });


    }


    const renderItem = ({item, index}: any) => {
        let name = item?.clientname;

        if (item?.voucherprefix && item?.voucherdisplayid) {
            name = `${item?.voucherprefix}${item?.voucherdisplayid} ${name}`
        }

        return <TouchableOpacity style={[styles.p_5]} onPress={() => {
            Boolean(item?.voucherdisplayid) &&  printPreview(item).then()
        }}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                <View style={[styles.w_auto]}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>

                        <View>
                            {!Boolean(item?.voucherdisplayid) && <Paragraph
                                style={[styles.paragraph, styles.bold]}>{getDateWithFormat(item.date, dateFormat())} {item.vouchercreatetime} </Paragraph>}
                            {Boolean(item?.voucherdisplayid) && <Paragraph
                                style={[styles.paragraph, styles.bold]}>{moment.unix(item.vouchercreatetime).format(dateFormat(true))} </Paragraph>}
                            <Paragraph style={[styles.paragraph]}>{name}</Paragraph>
                        </View>
                    </View>
                </View>
                <View style={{width: 50}}>
                    {/*{Boolean(item?.voucherdisplayid) && <TouchableOpacity >
                        <ProIcon name={'print'} type={'solid'} size={15}/>
                    </TouchableOpacity>}*/}
                </View>
                {<View style={{width: 100}}>
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotaldisplay)}</Paragraph>
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
                            }]}>Sync in progress...</Paragraph>
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
                            <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>No any
                                items found</Text>

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



