import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph} from "react-native-paper"
import {appLog, getDateWithFormat, isEmpty, retrieveData, storeData, toCurrency} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, localredux, METHOD, posUrl, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import {setOrder} from "../../redux-store/reducer/orders-data";
import Button from "../../components/Button";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";

const Index = ({ordersData}: any) => {

    const dispatch = useDispatch()

    appLog("ordersData", ordersData)

    let {
        initData,
        licenseData,
        localSettingsData: {lastSynctime},
        addonsData,
        clientsData,
        authData,
        staffData,
        loginuserData
    }: any = localredux;


    const [data, setData] = useState<any>([]);
    const [liveData, setLiveData] = useState<any>([]);

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
            other: {url: posUrl},
        }).then((response: any) => {
            appLog("RESPONSE", response);
            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                setData((prev: any) => {
                    return {...prev, ...response.data}
                })
            }
        }).catch(() => {
        })
    }, [])


    const syncInvoice = (invoiceData: any) => {
        return new Promise((resolve) => {
            apiService({
                method: METHOD.POST,
                action: ACTIONS.INVOICE,
                body: invoiceData,
                workspace: initData.workspace,
                token: licenseData?.token,
                hideLoader: true,
                other: {url: posUrl},
            }).then((response: any) => {

                appLog("response", response);

                dispatch(hideLoader())
                if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                    retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
                        let localOrder: any = data?.orders
                        delete localOrder[invoiceData?.orderid];
                        storeData('fusion-pro-pos-mobile', data).then(async () => {
                            dispatch(setOrder({...invoiceData, synced: true}))
                        });
                    })
                } else {
                    resolve({status: "ERROR"})
                }
            }).catch(() => {
                resolve({status: "TRY CATCH ERROR"})
            })
        })
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
                <View style={{width: '60%'}}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>

                        <View style={[styles.ml_2]}>
                            <Paragraph
                                style={[styles.bold, styles.paragraph]}>{getDateWithFormat(item?.date, "DD/MM/YYYY")}</Paragraph>
                            <Paragraph style={[styles.bold, styles.paragraph]}>{name}</Paragraph>
                        </View>
                    </View>
                </View>
                {<View>

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

    appLog("DARA", Object.keys(data))

    return <Container config={{
        title: "Sales Report",
    }}>
        <FlatList
            data={Object.values(data).reverse()}
            renderItem={renderItem}
        />
        <View style={[styles.submitbutton]}>
            <Button
                onPress={() => {
                    appLog("invoiceData", licenseData?.token)
                    retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
                        if (!isEmpty(data.orders)) {
                            let invoice: any = Object.values(data.orders)[0]
                            dispatch(showLoader())
                            let response = await syncInvoice(invoice)
                            appLog("invoice data call", response);
                        }
                    })
                }}> Sync
            </Button>
        </View>
    </Container>

}

const mapStateToProps = (state: any) => ({
    ordersData: state.ordersData,
})

export default connect(mapStateToProps)(Index);

