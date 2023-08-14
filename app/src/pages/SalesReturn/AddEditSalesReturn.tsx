import React, {useEffect, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Card} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Field, Form} from "react-final-form";
import KeyboardScroll from "../../components/KeyboardScroll";
import InputField from "../../components/InputField";
import {clone, errorAlert, getDefaultCurrency, isEmpty, prelog, toCurrency} from "../../libs/function";
import {ACTIONS, localredux, METHOD, required, STATUS, urls, VOUCHER} from "../../libs/static";
import {Button, Container} from "../../components";
import KAccessoryView from "../../components/KAccessoryView";
import apiService from "../../libs/api-service";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import {getClientsByWhere} from "../../libs/Sqlite/selectData";

import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import moment from "moment";


const AddEditSalesReturn = (props: any) => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    let initdata: any = {
        "referencetype": "b65254c6-d78b-4693-b062-4e4a91410983",
        "clientid": "1",
        "paymentmethod": "c02fc4ca-8d89-4c91-bd66-2dd29bc34e43",
        "referenceid": "",
        currency: getDefaultCurrency(),
        localdatetime: moment().format("YYYY-MM-DD HH:mm:ss"),
        locationid: localredux.licenseData?.data?.location_id,
        vouchertypeid: VOUCHER.SALESRETURN
    }


    const {paymentgateway, reason: {creditnote}}: any = localredux.initData;
    const [loader, setLoader] = useState(true);
    const [invoices, setInvoices] = useState([]);

    const reasons = Object.keys(creditnote).map((key: any) => {
        return {label: creditnote[key], value: key}
    })

    const getGatewayDetailByKey = (key: any, value: any) => {
        const gatewayname: any = Object.keys(paymentgateway[key]).filter((key) => key !== "settings");
        let returnData = paymentgateway[key][gatewayname].find((a: any) => a.input === value)
        return {...returnData, type: gatewayname[0]}
    }

    const [paymentMethods, setPaymentMethods] = useState<any>(clone(isEmpty(paymentgateway) ? [] : Object.keys(paymentgateway).map((key: any) => {
        const b: any = getGatewayDetailByKey(key, 'displayname');
        let item: any = {label: b.value, value: key, type: b.type, paymentby: b.value, paymentmethod: key};
        return item
    })));

    const [clients, setClients]: any = useState();

    useEffect(() => {
        getClientsByWhere({clienttype: 0, start: 0}).then((clients) => {
            setClients(clients);
            setLoader(false)
        });

    }, [])

    const handleSubmit = async (values: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        let invoicedetail: any = {
            invoiceitems: [],
            voucherid: '',
            voucherdisplayid: '',
            payments: [],
            vouchertypeid: VOUCHER.SALESRETURN, ...values,
        };

        if (values?.referenceid) {
            await apiService({
                method: METHOD.GET,
                action: ACTIONS.INVOICE,
                queryString: {voucherdisplayid: values?.referenceid, vouchertypeid: VOUCHER.INVOICE},
                workspace: workspace,
                token: token,
                other: {url: urls.posUrl},
            }).then(async (result) => {

                if (result.status === STATUS.SUCCESS) {


                    invoicedetail = result.data?.result;

                    const voucheritems: any = invoicedetail?.voucheritems;

                    invoicedetail = {
                        ...invoicedetail,
                        clientname: invoicedetail.client,
                        invoiceitems: Boolean(voucheritems) ? Object.values(voucheritems)?.map((item: any) => {
                            return {
                                ...item,
                                productqnt: +item.productqnt, ...item.itemdetail,
                                change: true,
                                added: true
                            }
                        }) : [],
                        voucherid: '',
                        voucherdisplayid: '',
                        payments: [],
                        vouchertypeid: VOUCHER.SALESRETURN, ...values
                    }

                }

                navigation.push('CartStackNavigator', invoicedetail);

            });
        } else {
            navigation.push('CartStackNavigator', invoicedetail);
        }


    }

    const getInvoicesbyClient = async (clientid: any) => {
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;
        dispatch(showLoader())
        await apiService({
            method: METHOD.GET,
            action: ACTIONS.CLIENT,
            queryString: {clientid: clientid},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            dispatch(hideLoader())
            if (result.status === STATUS.SUCCESS) {
                setInvoices(Object.values({...result.data.pendinginvoice, ...result.data.invoices}))
            } else {
                errorAlert(result.message)
            }
        });
    }


    if (loader) {
        return <PageLoader/>
    }


    return <Container>
        <SafeAreaView>
            <Form
                onSubmit={handleSubmit}
                initialValues={{...initdata}}
                render={({handleSubmit, submitting, values, ...more}: any) => (<>

                        <View style={[styles.middle,]}>
                            <View style={[styles.middleForm, {maxWidth: 400}]}>

                                <KeyboardScroll>

                                    <View>
                                        <View>
                                            <Card style={[styles.card]}>
                                                <Card.Content style={[styles.cardContent]}>


                                                    <View>

                                                        <Field name="clientid">
                                                            {props => (<InputField
                                                                    {...props}
                                                                    label={'Client'}
                                                                    mode={'flat'}
                                                                    list={clients?.map((client: any) => {
                                                                        return {
                                                                            label: client.displayname,
                                                                            value: client.clientid
                                                                        }
                                                                    })}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={async (value: any) => {
                                                                        await getInvoicesbyClient(value).then(() => {
                                                                            props.input.onChange(value);
                                                                        })
                                                                    }}
                                                                >
                                                                </InputField>)}
                                                        </Field>
                                                    </View>


                                                    <View>

                                                        <Field name="referenceid">
                                                            {props => (<InputField
                                                                    {...props}
                                                                    label={'Invoice'}
                                                                    mode={'flat'}
                                                                    list={invoices?.map((invoice: any) => {
                                                                        return {
                                                                            label: `${invoice.voucherprefix}${invoice.voucherdisplayid} (${invoice.vouchertotaldisplay})`,
                                                                            value: invoice.voucherdisplayid
                                                                        }
                                                                    })}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                >
                                                                </InputField>)}
                                                        </Field>
                                                    </View>


                                                    <View>

                                                        <Field name="referencetype">
                                                            {props => (<InputField
                                                                    {...props}
                                                                    label={'Reason'}
                                                                    mode={'flat'}
                                                                    list={reasons}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                >
                                                                </InputField>)}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <Field name="paymentmethod">
                                                            {props => (<InputField
                                                                    {...props}
                                                                    label={'Payment By'}
                                                                    mode={'flat'}
                                                                    list={paymentMethods}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                >
                                                                </InputField>)}
                                                        </Field>
                                                    </View>


                                                </Card.Content>
                                            </Card>

                                        </View>
                                    </View>

                                </KeyboardScroll>


                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Next </Button>
                                    </View>
                                </KAccessoryView>

                            </View>
                        </View>

                    </>)}
            />
        </SafeAreaView>
    </Container>
}

const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(AddEditSalesReturn);


