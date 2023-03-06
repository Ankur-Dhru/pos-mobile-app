import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Card} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Field, Form} from "react-final-form";
import KeyboardScroll from "../../components/KeyboardScroll";
import InputField from "../../components/InputField";
import {appLog, clone, errorAlert, getRoleAccess, isEmpty, nextFocus, voucherData} from "../../libs/function";
import {ACTIONS, localredux, METHOD, required, STATUS, urls, VOUCHER} from "../../libs/static";
import {Button, Container} from "../../components";
import KAccessoryView from "../../components/KAccessoryView";
import apiService from "../../libs/api-service";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {expenseCalculation} from "../../libs/item-calculation";
import {getClientsByWhere} from "../../libs/Sqlite/selectData";
import store from "../../redux-store/store";
import ChartofAccountList from "./ChartofAccountList";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";


const AddEditExpense = (props: any) => {

    const editdata = props?.route?.params?.data;
    const getList = props?.route?.params?.getList;

    let init: any = {
        productqnt: 1,
        clientid: '',
        companyid: 1,
        departmentid: 2,
        ...voucherData(VOUCHER.EXPENSE, false),
    }

    const navigation = useNavigation()


    const {paymentgateway, tax}: any = localredux.initData;
    const [loader, setLoader] = useState(true);

    let [initdata, setInitdata]: any = useState(init);


    const getOrderDetail = async (invoice: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.GET,
            action: ACTIONS.INVOICE,
            queryString: {voucherdisplayid: invoice.voucherdisplayid, vouchertypeid: VOUCHER.EXPENSE},
            workspace: workspace,
            token: token,
            hideLoader:true,
            hidealert:true,
            other: {url: urls.posUrl},
        }).then(async (result) => {


            if (result.status === STATUS.SUCCESS) {

                let data: any = result.data?.result;

                const voucheritems = Object.values(data?.voucheritems);

                const {productratedisplay,referenceid,accountid,clientid,producttaxgroupid}:any = voucheritems[0]

                initdata = clone({
                    ...initdata,
                    price: productratedisplay+'',
                    producttaxgroupid: producttaxgroupid+'',
                    referenceid:referenceid+'',
                    clientid:clientid+'',
                    ...data,
                    accountid: accountid,
                })
                setInitdata(initdata)
                setLoader(false)
            }
        });
    }

    useEffect(() => {
        if (editdata?.edit) {
            getOrderDetail(editdata).then();
        } else {
            setLoader(false)
        }
    }, [])


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
        });
    }, [])

    const dispatch = useDispatch();

    const handleSubmit = async (values: any) => {
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;


        dispatch(showLoader())

        const ExpenseJSON = expenseCalculation({
                ...values,
                roundoffselected: false,
                date: values.localdatetime,
                "referencetype": values.referencetype,
                "payment": paymentgateway[values.referencetype].settings.paymentmethod,
                "accountid": paymentgateway[values.referencetype].settings.paymentaccount,
                invoiceitems: [{
                    productrate: values.price,
                    productratedisplay: values.price,
                    productqnt: 1,
                    accountid: values.accountid,
                    producttaxgroupid: values.producttaxgroupid
                }]
            },
            null,
            null,
            '',
            '',
            2,
            2,
            false,
            false);


        await apiService({
            method: editdata?.edit ? METHOD.PUT : METHOD.POST,
            action: ACTIONS.EXPENSE,
            body: ExpenseJSON,
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                store.dispatch(setAlert({visible: true, message: result.message}))
                Boolean(getList) && getList()
                dispatch(hideLoader());
                navigation.goBack()
            }
        });
    }

    const inputRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

    if (editdata?.edit) {
        navigation.setOptions({headerTitle: `Edit Expense`})
    }

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
                                                        <View style={[styles.w_auto]}>
                                                            <Field name="date" validate={required}>
                                                                {props => (

                                                                    <InputField
                                                                        {...props}
                                                                        label={"Date"}
                                                                        displaytype={'bottomlist'}
                                                                        inputtype={'datepicker'}
                                                                        mode={'date'}
                                                                        selectedValue={props.input.value}
                                                                        onChange={props.input.onChange}
                                                                    />

                                                                )}
                                                            </Field>
                                                        </View>
                                                    </View>


                                                    <View>
                                                        <View style={[styles.w_auto]}>

                                                            <Field name="price" validate={required}>
                                                                {props => (
                                                                    <InputField
                                                                        {...props}
                                                                        value={props.input.value}

                                                                        onSubmitEditing={() => nextFocus(inputRef[1])}
                                                                        returnKeyType={'next'}
                                                                        keyboardType='numeric'
                                                                        label={'Amount'}
                                                                        inputtype={'textbox'}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </View>
                                                    </View>


                                                    <View>
                                                        <Field name="referencetype" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Paid Through'}
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


                                                    <View>
                                                        <View style={[styles.w_auto]}>
                                                            <Field name="referenceid">
                                                                {props => (
                                                                    <InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        ref={inputRef[1]}
                                                                        onSubmitEditing={() => nextFocus(inputRef[2])}
                                                                        returnKeyType={'next'}
                                                                        label={'Reference Number'}
                                                                        inputtype={'textbox'}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </View>
                                                    </View>


                                                    <View>

                                                        <Field name="accountid" validate={required}>
                                                            {props => (
                                                                <><ChartofAccountList key={values.accountid} values={values} navigation={navigation}
                                                                                      fieldprops={props}/></>
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <View style={[styles.w_auto]}>

                                                            <Field name="voucherremarks">
                                                                {props => (
                                                                    <InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        ref={inputRef[2]}
                                                                        onSubmitEditing={() => nextFocus(inputRef[3])}
                                                                        returnKeyType={'go'}
                                                                        label={'Notes'}
                                                                        inputtype={'textbox'}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </View>
                                                    </View>


                                                    <View>

                                                        <Field name="producttaxgroupid">
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Tax'}
                                                                    mode={'flat'}
                                                                    list={Object.values(tax).map((tax: any) => {
                                                                        return {
                                                                            label: tax.taxgroupname,
                                                                            value: tax.taxgroupid
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


                                                    {Boolean(values.producttaxgroupid) && <View>

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
                                                                        props.input.onChange(value);
                                                                    }}
                                                                >
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>}

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
                                        }}> {Boolean(editdata?.edit) ? 'Update' : 'Save'} </Button>
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

export default connect(mapStateToProps)(AddEditExpense);


