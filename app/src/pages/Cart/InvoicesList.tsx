import React, {useEffect, useState} from "react";
import {FlatList, Text, View} from "react-native";
import {Caption, List, Paragraph, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {ACTIONS, current, ItemDivider, localredux, METHOD, STATUS, urls, VOUCHER} from "../../libs/static";
import {styles} from "../../theme";
import {setCartData, setCartItems} from "../../redux-store/reducer/cart-data";
import {dateFormat, isEmpty, printInvoice, selectItem, toCurrency, totalOrderQnt} from "../../libs/function";
import moment from "moment";
import apiService from "../../libs/api-service";

import {v4 as uuidv4} from "uuid";
import {SearchBox} from "../../components";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";


const Index = (props: any) => {

    const [tableorders, setTableOrders]: any = useState({})
    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;
    let {licenseData,}: any = localredux;
    let [search, setSearch] = useState('');

    useEffect(() => {
        getInvoices(search)
    }, [search])


    const getInvoices = (search?:any) => {
        apiService({
            method: METHOD.GET,
            action: ACTIONS.REPORT_SALES,
            workspace: workspace,
            token: token,
            queryString: {
                terminalid: licenseData?.data?.terminal_id, vouchertypeid: VOUCHER.INVOICE, take: 10, skip: 0,invoiceid:search,
            },
            hideLoader: true,
            hidealert: true,
            other: {url: urls.posUrl},
        }).then((response: any) => {
            setTableOrders(response.data || {})
        })
    }


    const dispatch = useDispatch()


    const getOrderDetail = async (invoice: any) => {
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.INVOICE,
            queryString: {voucherdisplayid: invoice.voucherdisplayid, vouchertypeid: VOUCHER.INVOICE},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS) {
                let invoiceData: any = result.data?.result;


                const {voucheritems, receipt,voucherdata}: any = invoiceData;
                const payment = Boolean(receipt) ? Object.values(receipt)?.map((payment: any) => {
                    return {paymentAmount: payment.amount, paymentby: payment.payment}
                }) : [];


                invoiceData = {
                    ...invoiceData, clientname: invoiceData.client, invoiceitems: Object.values(voucheritems)?.map((item: any) => {
                        return {
                            ...item,
                            productqnt: +item.productqnt,
                            added: true,
                            key:  uuidv4(),
                            change: true,
                            itemid:item.itemdetail.itemid,
                            uniqueproductcode:item.itemdetail.uniqueproductcode,
                            itemname:item.itemdetail.itemname,
                            pricing:item.itemdetail.pricing,
                            ...item?.voucheritemdata,
                            itemdetail:''
                        }
                    }),
                    payment: payment,
                    paidamount:0,
                    invoice_display_number:voucherdata.invoice_display_number,

                }

                dispatch(setCartData({...invoiceData,currentpax:'all', totalqnt: totalOrderQnt(invoiceData.invoiceitems)}))
            }
        });
    }


    const renderitem = ({item}: any) => {
        return <List.Item
            style={[styles.listitem]}
            title={`${item.voucherprefix}${item.voucherdisplayid}`}
            description={moment(item.date).format(dateFormat(true))}

            right={() => <List.Icon icon="chevron-right"/>}

            onPress={async () => {
                current.table = item;
                await dispatch(setBottomSheet({visible: false}))
                await getOrderDetail(item)
            }}
        />
    }


    const handleSearch = async (search?: any) => {
        setSearch(search)
    }

    return <View style={[styles.p_6, styles.w_100, styles.h_100]}>
       {/* <SearchBox handleSearch={handleSearch} disableKeypress={true} autoFocus={false}
                    placeholder="Search Invoice..."/>*/}
        <Caption style={[styles.caption]}>Last 10 Invoices</Caption>
        <FlatList
            data={Object.values(tableorders)}
            renderItem={renderitem}
            ItemSeparatorComponent={ItemDivider}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            initialNumToRender={5}
            ListEmptyComponent={() => {
                return (<View style={[]}><Paragraph
                    style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>No any Invoices
                    Found</Paragraph></View>)
            }}
        />
    </View>
}


export default Index;

