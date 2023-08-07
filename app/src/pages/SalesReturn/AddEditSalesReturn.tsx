import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Card} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Field, Form} from "react-final-form";
import KeyboardScroll from "../../components/KeyboardScroll";
import InputField from "../../components/InputField";
import {
    appLog,
    clone,
    errorAlert,
    getDefaultCurrency,
    getRoleAccess,
    isEmpty,
    nextFocus,
    voucherData
} from "../../libs/function";
import {ACTIONS, localredux, METHOD, required, STATUS, urls, VOUCHER} from "../../libs/static";
import {Button, Container} from "../../components";
import KAccessoryView from "../../components/KAccessoryView";
import apiService from "../../libs/api-service";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {expenseCalculation} from "../../libs/item-calculation";
import {getClientsByWhere} from "../../libs/Sqlite/selectData";
import store from "../../redux-store/store";

import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import moment from "moment";


const AddEditSalesReturn = (props: any) => {

    const navigation = useNavigation()


    let initdata: any = {
        reason: '',
        clientid: '',
        gateway: '',
        currency:getDefaultCurrency(),
        localdatetime:moment().format("YYYY-MM-DD HH:mm:ss"),
        locationid: localredux.licenseData?.data?.location_id,
        vouchertypeid:VOUCHER.SALESRETURN
    }

    const {paymentgateway}: any = localredux.initData;
    const [loader, setLoader] = useState(true);
    const [invoices, setInvoices] = useState([]);


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

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.SALESRETURN,
            body: values,
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {

            }
            else{
                errorAlert(result.message)
            }
        });
    }

    const getInvoicesbyClient = async (clientid: any) => {
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.CLIENT,
            queryString:{clientid:clientid},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                setInvoices(Object.values({...result.pendinginvoice,...result.invoicecredit}))
            }
            else{
                errorAlert(result.message)
            }
        });
    }


    console.log('invoices',invoices)

    const inputRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

    if (loader) {
        return <PageLoader/>
    }


    return <Container>
        <SafeAreaView>
            <Form
                onSubmit={handleSubmit}
                initialValues={{...initdata}}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <>

                        <View style={[styles.middle,]}>
                            <View style={[styles.middleForm, {maxWidth: 400}]}>

                                <KeyboardScroll>

                                    <View>
                                        <View>
                                            <Card style={[styles.card]}>
                                                <Card.Content style={[styles.cardContent]}>


                                                    <View>

                                                        <Field name="clientid" validate={required}>
                                                            {props => (
                                                                <InputField
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
                                                                    onChange={(value: any) => {
                                                                        getInvoicesbyClient(value).then()
                                                                        props.input.onChange(value);
                                                                    }}
                                                                >
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>

                                                        <Field name="invoiceid"  >
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Invoice'}
                                                                    mode={'flat'}
                                                                    list={invoices?.map((invoice: any) => {
                                                                        return {
                                                                            label: invoice.voucherprefix+'-'+invoice.voucherdisplayid,
                                                                            value: invoice.voucherid
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
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>



                                                    <View>

                                                        <Field name="reason"  >
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Reason'}
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
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                >
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <Field name="gateway" validate={required}>
                                                            {props => (
                                                                <InputField
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
                                                                </InputField>
                                                            )}
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
                                        }}> Get Invoice Items </Button>
                                    </View>
                                </KAccessoryView>

                            </View>
                        </View>

                    </>
                )}
            />
        </SafeAreaView>
    </Container>
}

const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(AddEditSalesReturn);


