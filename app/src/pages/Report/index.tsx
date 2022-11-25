import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph} from "react-native-paper"
import {
    appLog,
    getDateWithFormat, getItem, getLeftRight, getPrintTemplate, getTemplate, getTrimChar,
    isEmpty, numberFormat, objToArray,

    retrieveData,
    storeData,
    toCurrency
} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {
    ACTIONS,
    adminUrl,
    defaultInvoiceTemplate,
    localredux,
    METHOD,
    posUrl,
    PRINTER,
    STATUS,
    VOUCHER
} from "../../libs/static";
import apiService from "../../libs/api-service";
import ProIcon from "../../components/ProIcon";

import {itemTotalCalculation} from "../../libs/item-calculation";
import store from "../../redux-store/store";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {sendDataToPrinter} from "../../libs/Network";
import {printInvoice} from "../Cart/CartActions";

const Index = ({ordersData}: any) => {

    let {
        initData,
        licenseData,


    }: any = localredux;


    const [data, setData] = useState<any>([]);


    useEffect(() => {
        Boolean(ordersData) && setData((prev: any) => ({...prev, ...ordersData}))
    }, [ordersData])

    useEffect(() => {
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

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                setData((prev: any) => {
                    return {...prev, ...response.data}
                })
            }
        }).catch(() => {
        })
    }, [])


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

        return <TouchableOpacity
            style={[styles.noshadow]}>

            <View
                style={[styles.grid, styles.p_4, styles.noWrap, styles.top, styles.justifyContentSpaceBetween]}>
                <View style={[styles.w_auto]}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>

                        <View style={[styles.ml_2]}>
                            <Paragraph
                                style={[styles.bold, styles.paragraph]}>{getDateWithFormat(item?.date, "DD/MM/YYYY")}</Paragraph>
                            <Paragraph style={[styles.bold, styles.paragraph]}>{name}</Paragraph>
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
                {<View style={{width: 100}}>
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotaldisplay)}</Paragraph>
                    {
                        Boolean(item?.synced) && <Paragraph
                            style={[styles.paragraph, styles.text_xs, {
                                textAlign: 'right',
                                color: styles.green.color
                            }]}>Synced</Paragraph>
                    }
                </View>}
            </View>

            <Divider/>

        </TouchableOpacity>
    }

    return <Container config={{
        title: "Sales Report",
    }}>
        <FlatList
            data={Object.values(data).reverse()}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            renderItem={renderItem}
        />
    </Container>

}

const mapStateToProps = (state: any) => ({
    ordersData: state.ordersData,
})

export default connect(mapStateToProps)(Index);



