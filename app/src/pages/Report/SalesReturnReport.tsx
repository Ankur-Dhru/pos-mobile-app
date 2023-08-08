import React, {useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Caption, Card, Paragraph} from "react-native-paper"
import {
    appLog, base64Decode,
    base64Encode,
    dateFormat,
    getDateWithFormat,
    getOrders, prelog,
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



const SalesReturnReport = ({navigation}: any) => {

    let {
        licenseData,
    }: any = localredux;

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;
    const dispatch = useDispatch()

    const [data, setData] = useState<any>([]);
    const [loader,setLoader] = useState(false);

    useEffect(() => {

        apiService({
            method: METHOD.GET,
            action: ACTIONS.REPORT_SALES_RETURN,
            workspace: workspace,
            token: token,
            queryString: {terminalid: licenseData?.data?.terminal_id,vouchertypeid: VOUCHER.SALESRETURN},
            hideLoader: true,
            hidealert: true,
            other: {url: urls.posUrl},
        }).then((response: any) => {

            setData(Object.values(response?.data).reverse())
            setLoader(true)
        }).catch(()=>{
            setLoader(true)
        })
    }, []) //ordersData




    if (!loader) {
        return <PageLoader/>
    }


    const renderItem = ({item, index}: any) => {

        const {terminal_name}: any = localredux.licenseData.data;

        let name = `${item?.clientname}`

        if (item?.voucherprefix && item?.voucherdisplayid) {
            name = `${item?.voucherprefix}${item?.voucherdisplayid}  ${item?.clientname}`
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


                {<View style={{width: 90}}>
                    <Paragraph
                        style={[styles.paragraph,styles.bold, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotaldisplay)}</Paragraph>

                </View>}
            </View>


        </TouchableOpacity>
    }



    return <Container>
        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>

                {<FlatList
                    style={[styles.listitem]}
                    data={data}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    renderItem={renderItem}
                    ListEmptyComponent={<View>
                        <View style={[styles.p_6]}>
                            <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>No any items found</Text>

                        </View>
                    </View>}

                    ItemSeparatorComponent={ItemDivider}
                />}

            </Card.Content>
        </Card>
    </Container>

}


const mapStateToProps = (state: any) => ({

})

export default connect(mapStateToProps)(SalesReturnReport);



