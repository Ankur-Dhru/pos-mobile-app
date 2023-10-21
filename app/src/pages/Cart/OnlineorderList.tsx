import React, {useEffect, useState} from "react";
import {Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import {Caption, List, Paragraph, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";
import {setAlert, setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import {ACTIONS, current, device, ItemDivider, localredux, METHOD, STATUS, urls, VOUCHER} from "../../libs/static";
import {styles} from "../../theme";
import {setCartData, setCartItems} from "../../redux-store/reducer/cart-data";
import {
    appLog,
    dateFormat,
    isEmpty,
    prelog,
    printInvoice,
    selectItem,
    toCurrency,
    totalOrderQnt, voucherData
} from "../../libs/function";
import moment from "moment";
import apiService from "../../libs/api-service";

import {v4 as uuidv4} from "uuid";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import Button from "../../components/Button";


const Index = (props: any) => {

    const [tableorders, setTableOrders]: any = useState([])
    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;
    let {licenseData,}: any = localredux;
    let [search, setSearch] = useState('');

    useEffect(() => {
        getOnlineOrders()
    }, [search])


    const getOnlineOrders = () => {
        apiService({
            method: METHOD.GET,
            action: ACTIONS.ONLINEORDER,
            workspace: workspace,
            token: token,
            hideLoader: true,
            hidealert: true,
            other: {url: urls.posUrl},
        }).then((response: any) => {
            let table:any = [];
            Object.keys(response.data).map((key:any)=>{
                table.push({...response.data[key],orderid:key})
            })
            setTableOrders(table)
        })
    }



    const reply = async (order:any,status:any) =>{


        apiService({
            method: METHOD.POST,
            action: ACTIONS.ONLINEORDER,
            body:{status:status,orderid:order?.orderid},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (response: any) => {

            if(status === 'accept'){
                current.table = order;

                let invoiceitems:any = [];

                for (const data of order.invoiceitems) {
                  await  getItemsByWhere({itemid:data.productid}).then((item:any)=>{
                        invoiceitems = [
                            ...invoiceitems,
                            {
                                ...item[0],
                                productqnt: +item.product_qnt,
                                added: true,
                                key:  uuidv4(),
                                change: true,
                                ...data
                            }
                        ]
                    })
                }

                const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);


                let cartdata = {...voucherDataJson,...order,currency:voucherDataJson.currency,invoiceitems:invoiceitems,currentpax:'all', totalqnt: totalOrderQnt(invoiceitems)}
                dispatch(setCartData(cartdata))
                device.navigation.navigate('DetailViewNavigator');
            }
            dispatch(setBottomSheet({visible:false}))
            dispatch(setAlert({visible: true, message: response.message}))

        })
    }



    const dispatch = useDispatch()


    const renderitem = ({item}: any) => {

        return <View style={{paddingVertical:10}}>
            <View style={[styles.px_5,styles.grid,styles.justifyContent]}>
                <View>
                    <Paragraph style={[styles.bold]}>{item.data.clientname}  (#{item.orderid})</Paragraph>
                    <Paragraph >{toCurrency(item.data.vouchertotaldisplay)} </Paragraph>
                    <Paragraph style={[{textTransform:'capitalize'}]}>{item.data.ordertype} </Paragraph>
                    <Paragraph style={[styles.paragraph,styles.muted,styles.text_xs]}>{moment(item.date).format(dateFormat(true))} </Paragraph>
                </View>
                <View style={[styles.mr_2,{width:100}]}>

                    <View style={[styles.w_auto]}>
                        <Button  more={{color: 'white',backgroundColor:styles.green.color}} onPress={() => {
                            reply({...item.data,orderid:item.orderid}, 'accept').then(r => {})
                        }}>Accept</Button>
                    </View>

                    <View style={[styles.w_auto]}>
                        <Button more={{color: 'white',backgroundColor:styles.red.color}} onPress={() => {
                            reply({...item.data,orderid:item.orderid}, 'reject').then(r => {})
                        }}>Reject</Button>
                    </View>

                </View>
            </View>
        </View>
    }



    return <View style={[styles.w_100, styles.h_100]}>

        <Caption style={[styles.caption,styles.px_5]}>Online Orders</Caption>
        <FlatList
            data={tableorders}
            renderItem={renderitem}
            ItemSeparatorComponent={ItemDivider}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            initialNumToRender={5}
            ListEmptyComponent={() => {
                return (<View style={[]}><Paragraph
                    style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>No any Orders
                    Found</Paragraph></View>)
            }}
        />
    </View>
}


export default Index;

