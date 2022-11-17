import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph} from "react-native-paper"
import {
    appLog,
    getDateWithFormat,
    isEmpty,
    objToArray,
    printInvoice,
    selectItem,
    toCurrency
} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, adminUrl, device, localredux, METHOD, posUrl, STATUS, VOUCHER} from "../../libs/static";
import apiService from "../../libs/api-service";
import ProIcon from "../../components/ProIcon";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import {insertItems} from "../../libs/Sqlite/insertData";
import {setSelected} from "../../redux-store/reducer/selected-data";

const Index = ({ordersData}: any) => {

    let {
        initData,
        licenseData,


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


    const printData = async (invoice:any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method:  METHOD.GET ,
            action: ACTIONS.VOUCHER,
            queryString: {voucherdisplayid: invoice.voucherdisplayid, vouchertype: VOUCHER.INVOICE},
            workspace: workspace,
            token: token,
            other: {url: adminUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS) {

                result.data = {
                    ...result.data,
                    invoiceitems:objToArray(result.data.voucheritems),
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
                <View style={{width:50}}>
                    <TouchableOpacity onPress={()=>{
                        printData(item)
                    }}>
                        <ProIcon name={'print'} type={'solid'} size={15}/>
                    </TouchableOpacity>
                </View>
                {<View style={{width:100}}>
                    <Paragraph  style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotaldisplay)}</Paragraph>
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

