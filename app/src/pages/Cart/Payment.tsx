import React, {useEffect, useState} from "react";
import {appLog, clone, errorAlert, getDefaultCurrency, getFloatValue, saveLocalOrder, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme,Title,Text} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {Button, Container, InputBox} from "../../components";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";
import {useNavigation} from "@react-navigation/native";
import {localredux} from "../../libs/static";
import PageLoader from "../../components/PageLoader";


const Index = ({cartData}: any) => {



    let {vouchertotaldisplay, paidamount, voucherid, vouchercurrencyrate}: any = cartData;
    const {paymentgateway}: any = localredux.initData;
    const {currentLocation: {defaultpaymentgateway}}:any = localredux.localSettingsData;




    if (!Boolean(paidamount)) {
        paidamount = 0
    }

    const navigation: any = useNavigation()

    const [initdata, setInitdata] = useState({
        paymentamount: vouchertotaldisplay - paidamount,
        paymentgateway: defaultpaymentgateway
    });
    const [payments, setPayments] = useState([]);


    const handleSubmit = () => {

    }

    const validatePayment = async () => {


        if (!Boolean(payments.length)) {
            errorAlert(`Please add payment`);
        } else {

            cartData = {
                ...cartData,
                payment: payments
            }

            let paymentgateways: any = [];
            const systemc = getDefaultCurrency();

            payments.map((payment: any) => {

                const gatewayname: any = Object.keys(paymentgateway[payment.paymentgateway]).filter((key) => key !== "settings");

                const name = paymentgateway[payment.paymentgateway][gatewayname].find((a: any) => a.input === "displayname")

                paymentgateways = [
                    ...paymentgateways,
                    {
                        "gid": payment.paymentgateway,
                        "gatewayname": name.value,
                        "pay": payment.paymentamount,
                        "paysystem": getFloatValue(payment.paymentamount * (1 / vouchercurrencyrate), systemc.decimalplace),
                        "receipt": "",
                        "phone": "",
                        "otp": "",
                        referencetxnno: payment.referencetxnno,
                        bankcharges: payment.bankcharges,
                        "gatewaytype": gatewayname[0]
                    }
                ]
            })

            cartData.payments = [
                {
                    "remainingamount": 0,
                    "totalamount": vouchertotaldisplay,
                    paymentgateways
                }
            ];
            cartData.paidamount = paidamount;

            cartData = {
                ...cartData,
                paidamount: paidamount,

            }

            // await dispatch(setCartData(cartData));

            ////////// SAVE FINAL DATA //////////
            saveLocalOrder(cartData).then(() => {
                navigation.replace('DrawerStackNavigator');
            })
            ////////// SAVE FINAL DATA //////////

        }

    }

    const addPayment = (initdata: any) => {


        const gatewayname: any = Object.keys(paymentgateway[initdata.paymentgateway])
            .filter((key) => key !== "settings");
        const name = paymentgateway[initdata.paymentgateway][gatewayname].find((a: any) => a.input === "displayname");

        payments.push({...initdata, name: name.value});

        let total = 0;
        payments.map((payment: any) => {
            total += +payment.paymentamount
        });
        total = vouchertotaldisplay - paidamount - total;

        if (total >= 0) {
            initdata.paymentamount = total;
        } else {
            payments.pop();
            errorAlert('Total amount mismatch');
        }

        setInitdata(clone(initdata))
        setPayments(clone(payments))

    }

    const reset = () => {
        setInitdata({paymentamount: vouchertotaldisplay - paidamount, paymentgateway: defaultpaymentgateway})
        setPayments([]);
    }


    const getGatewayDetailByKey = (key: any, value: any) => {
        const gatewayname: any = Object.keys(paymentgateway[key]).filter((key) => key !== "settings");
        return paymentgateway[key][gatewayname].find((a: any) => a.input === value)
    }

    const paymentmethod: any = Boolean(paymentgateway) && Object.keys(paymentgateway).map((key: any) => {
        const b: any = getGatewayDetailByKey(key, 'displayname');
        return {label: b.value, value: key}
    });

/*    const [loaded,setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(()=>{
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if(!loaded){
        return <PageLoader />
    }*/

    appLog('payment')


    return <Container config={{}}>

        <View>

            <View style={[styles.p_5,{marginTop:10,padding:20}]}>

                    <Form
                        onSubmit={handleSubmit}
                        initialValues={{...initdata}}>
                        {propsValues => (
                            <>

                                <View style={[styles.grid,styles.justifyContent]}>
                                    <View style={[styles.w_auto]}>



                                    <View style={[styles.grid, styles.middle, styles.center]}>
                                        {Boolean(vouchertotaldisplay - paidamount) && <View>
                                            <Paragraph
                                                style={[styles.paragraph, styles.head, {textAlign: 'center'}]}>Due
                                                Amount</Paragraph>
                                            <Paragraph style={[styles.paragraph, styles.mb_10, styles.red, {
                                                textAlign: 'center',
                                                fontSize: 25,
                                                height: 40,
                                                paddingTop: 20,
                                                fontWeight: 'bold'
                                            }]}>{"Total"} : {toCurrency(vouchertotaldisplay - paidamount)}</Paragraph>
                                        </View>}


                                        {Boolean(paidamount) && <View style={[{marginLeft: 30}]}>
                                            <Paragraph
                                                style={[styles.paragraph, styles.head, {textAlign: 'center'}]}>Advance
                                                Pay</Paragraph>
                                            <Paragraph style={[styles.paragraph, styles.mb_10, styles.green, {
                                                textAlign: 'center',
                                                fontSize: 25,
                                                height: 40,
                                                paddingTop: 20,
                                                fontWeight: 'bold'
                                            }]}>{toCurrency(paidamount)}</Paragraph>
                                        </View>}
                                    </View>


                                    {<>
                                        <View>
                                            <Field name="paymentgateway">
                                                {props => {
                                                    return (
                                                        <InputField
                                                            {...props}
                                                            label={'Payment Method'}
                                                            divider={true}
                                                            displaytype={'bottomlist'}
                                                            inputtype={'dropdown'}
                                                            list={paymentmethod}
                                                            selectedValue={initdata.paymentgateway}
                                                            search={false}
                                                            listtype={'other'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )
                                                }}
                                            </Field>
                                        </View>


                                        <View>
                                            <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                <View style={[styles.w_auto]}>

                                                    <Field name="paymentamount">
                                                        {props => {
                                                            return (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value + ''}
                                                                    label={'Amount'}
                                                                    inputtype={'textbox'}
                                                                    keyboardType='numeric'
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>

                                                </View>
                                                <View style={[styles.w_auto, styles.ml_2]}>
                                                    <Field name="bankcharges">
                                                        {props => {
                                                            return (
                                                                <InputField
                                                                    value={'' + props.input.value}
                                                                    label={'Bank Charges'}
                                                                    autoFocus={false}
                                                                    inputtype={'textbox'}
                                                                    keyboardType='numeric'
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);

                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[styles.mb_5]}>
                                            <Field name="referencetxnno">
                                                {props => {
                                                    return (
                                                        <InputBox
                                                            value={props.input.value}
                                                            label={'Reference'}
                                                            dense={false}
                                                            autoFocus={false}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )
                                                }}
                                            </Field>
                                        </View>

                                    </>}


                                    <View style={[styles.grid,styles.justifyContent]}>

                                        <View style={[styles.w_auto]}>
                                            <Button disabled={!Boolean(initdata.paymentamount)} onPress={() => {
                                                addPayment(propsValues.values)
                                            }} secondbutton={true}>Add</Button>
                                        </View>


                        <View style={[styles.w_auto,styles.ml_2]}>
                            <Button   onPress={() => { }}   more={{backgroundColor: styles.yellow.color,  }}>Skip Payment</Button>
                        </View>


                                    </View>


                                    </View>
                                    <View style={[styles.w_auto,{marginLeft:20}]}>




                                    {Boolean(payments.length) && <>

                                    <View style={[styles.mt_5]}>

                                        <View>
                                            {payments.map((payment: any, key: any) => {
                                                return (
                                                    <View style={[styles.grid, styles.justifyContent]} key={key}>
                                                        <View>
                                                            <Paragraph> {payment.name} </Paragraph>
                                                            <Paragraph
                                                                style={[styles.paragraph, styles.muted, styles.text_xs]}>{payment.referencetxnno ? payment.referencetxnno : ''} </Paragraph>
                                                        </View>
                                                        <View>
                                                            <Paragraph
                                                                style={[styles.paragraph,]}>{toCurrency(payment.paymentamount)}</Paragraph>
                                                            {<Paragraph
                                                                style={[styles.paragraph, styles.muted, styles.text_xs, {textAlign: 'right'}]}> {Boolean(payment.bankcharges) && toCurrency(payment.bankcharges)}</Paragraph>}
                                                        </View>
                                                    </View>)
                                            })}
                                        </View>




                                    </View>


                                        <View style={[styles.grid,styles.justifyContent]}>

                                            <View style={[styles.w_auto]}>
                                                <Button   secondbutton={true} onPress={() => {
                                                    reset();
                                                }}>
                                                    Reset
                                                </Button>
                                            </View>

                                            <View style={[styles.w_auto,styles.ml_2]}>
                                                <View>

                                                    <Button onPress={() => {
                                                        validatePayment()
                                                    }}> {voucherid ? 'Save' : `Generate Invoice`} </Button>

                                                </View>
                                            </View>

                                        </View>


                                </>}



                                    </View>

                                </View>


                            </>
                        )}

                    </Form>





            </View>
        </View>

    </Container>
}

const mapStateToProps = (state: any) => ({
     cartData: state.cartData,
})

export default connect(mapStateToProps)(withTheme(Index));
