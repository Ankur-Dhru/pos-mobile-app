import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Card, Paragraph} from "react-native-paper";
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
    nextFocus, toCurrency,
    voucherData
} from "../../libs/function";
import {
    ACTIONS,
    composeValidators,
    localredux, maxValue,
    METHOD,
    minValue,
    required,
    STATUS,
    urls,
    VOUCHER
} from "../../libs/static";
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


const AddEditPaymentMade = (props: any) => {

    const navigation = useNavigation()

    const {route,vouchertotaldisplay} = props;

    const receiptCreated = route?.params?.receiptCreated;
    const clientid = route?.params?.clientid;


    let initdata: any = {
        amount: '',
        clientid: clientid || '',
        gateway: 'c02fc4ca-8d89-4c91-bd66-2dd29bc34e43',
        currency:getDefaultCurrency(),
        localdatetime:moment().format("YYYY-MM-DD HH:mm:ss"),
        locationid: localredux.licenseData?.data?.location_id,
        vouchertypeid:VOUCHER.PAYMENTMADE
    }



    const {paymentgateway,location}: any = localredux.initData;
    const minadvancepercentage = location[initdata?.locationid]?.minadvancepercentage;


    let minamount = 0
    if(minadvancepercentage) {
        minamount = Math.round((vouchertotaldisplay * minadvancepercentage) / 100)
    }


    const [loader, setLoader] = useState(true);


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
        getClientsByWhere({clienttype: 1, start: 0}).then((clients) => {
            setClients(clients);
            setLoader(false)
        });
    }, [])


    const handleSubmit = async (values: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.PAYMENT,
            body: values,
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                store.dispatch(setAlert({visible: true, message: result.message}))
                navigation.goBack()
            }
            else{
                errorAlert(result.message)
            }
        });
    }

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
                                                                    label={'Vendor'}
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
                                                        <View>
                                                            <Field name="amount" validate={composeValidators(required, minValue(+minamount))}>
                                                                {props => (
                                                                    <InputField
                                                                        {...props}
                                                                        value={props.input.value}

                                                                        onSubmitEditing={() => nextFocus(inputRef[1])}
                                                                        returnKeyType={'next'}
                                                                        keyboardType='numeric'
                                                                        label={'Pay Amount'}
                                                                        inputtype={'textbox'}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                            {Boolean(minamount) &&  <Paragraph style={[styles.mb_5]}>Min Amount to pay : {toCurrency(minamount)}</Paragraph>}
                                                        </View>
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





                                                    <View>
                                                        <View style={[styles.w_auto]}>

                                                            <Field name="notes">
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
                                        }}> Save </Button>
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

const mapStateToProps = (state: any) => ({
    vouchertotaldisplay:state.cartData?.vouchertotaldisplay
})

export default connect(mapStateToProps)(AddEditPaymentMade);


