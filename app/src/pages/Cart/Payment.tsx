import React, {memo, useEffect, useState} from "react";
import {
    appLog,
    clone,
    errorAlert,
    getDefaultCurrency,
    getFloatValue, isEmpty,
    printInvoice,
    saveLocalOrder, toCurrency
} from "../../libs/function";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Button, Container} from "../../components";
import {Field, Form} from "react-final-form";
import {useNavigation} from "@react-navigation/native";
import {localredux} from "../../libs/static";
import store from "../../redux-store/store";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import InputField from "../../components/InputField";
import ProIcon from "../../components/ProIcon";
import {setCartData} from "../../redux-store/reducer/cart-data";
import InputBox from "../../components/InputBox";


const Index = ({vouchertotaldisplay, paidamount,payment, vouchercurrencyrate}: any) => {

    const dispatch = useDispatch();
    const navigation: any = useNavigation()

    if (!Boolean(paidamount)) {
        paidamount = 0
    }

    const {paymentgateway}: any = localredux.initData;
    const {currentLocation: {defaultpaymentgateway},taxInvoice}: any = localredux.localSettingsData;

    const getGatewayDetailByKey = (key: any, value: any) => {
        const gatewayname: any = Object.keys(paymentgateway[key]).filter((key) => key !== "settings");
        let returnData = paymentgateway[key][gatewayname].find((a: any) => a.input === value)
        return {...returnData, type: gatewayname[0]}
    }

    useEffect(()=>{
        dispatch(setCartData({payment: payment}));
    },[])

    useEffect(() => {
        if (taxInvoice) {
            dispatch(setCartData({payment: [{paymentby: "Pay Later"}]}));
        }
    }, [taxInvoice]);



    const [remainingAmount, setRemainingAmount] = useState<any>(0);
    const [activePayLater, setActivePayLater] = useState<boolean>(false);

    const [paymentMethods, setPaymentMethods] = useState<any>(clone(isEmpty(paymentgateway) ? [] : Object.keys(paymentgateway).map((key: any) => {
        const b: any = getGatewayDetailByKey(key, 'displayname');
        const find = payment.find((pay: any) => pay.paymentmethod === key);
        let item: any = {label: b.value, value: key, type: b.type, paymentby: b.value, paymentmethod: key};
        if (!isEmpty(find)) {
            item.paymentAmount = find?.paymentAmount || 0
        }
        if(defaultpaymentgateway === key){
            item.paymentAmount = vouchertotaldisplay || 0
        }
        return item
    })));

    useEffect(() => {
        const sum = paymentMethods.reduce((accumulator: any, object: any) => {
            return accumulator + +(object?.paymentAmount || 0);
        }, 0);

        setRemainingAmount(vouchertotaldisplay - sum);

        let paidSelected = Boolean(payment[0]?.paymentby === "Pay Later");
        if (paidSelected) {
            paidSelected = !paymentMethods.some((pm: any) => Boolean(pm.paymentAmount))
        }

        setActivePayLater(paidSelected)
    }, [paymentMethods])


    const validatePayment = async (config?:any) => {

        try {
            let cartData: any = store.getState().cartData;
            cartData = {
                ...cartData,
                payment: paymentMethods,
            }

            let paymentgateways: any = [];
            const systemc: any = getDefaultCurrency();

            paymentMethods.map((payment: any) => {

                const gatewayname: any = Object.keys(paymentgateway[payment.paymentmethod]).filter((key) => key !== "settings");

                const name = paymentgateway[payment.paymentmethod][gatewayname].find((a: any) => a.input === "displayname")

                if(Boolean(payment.paymentAmount)) {
                    paymentgateways = [
                        ...paymentgateways,
                        {
                            "gid": payment.paymentmethod,
                            "gatewayname": name.value,
                            "pay": payment.paymentAmount,
                            "paysystem": getFloatValue(payment.paymentAmount * (1 / vouchercurrencyrate), systemc.decimalplace),
                            "receipt": "",
                            "phone": "",
                            "otp": "",
                            referencetxnno: payment?.referencetxnno,
                            bankcharges: payment?.bankCharges,
                            "gatewaytype": gatewayname[0]
                        }
                    ]
                }
            })

            if(remainingAmount === vouchertotaldisplay){
                paymentgateways =[{gatewayname: 'Pay later',gatewaytype: 'paylater', pay: vouchertotaldisplay}]
            }

            cartData.payments = [
                {
                    "remainingamount": remainingAmount,
                    "totalamount": vouchertotaldisplay,
                    paymentgateways
                }
            ];

            cartData.paidamount = paidamount;


            ////////// SAVE FINAL DATA //////////
            dispatch(showLoader())

            saveLocalOrder(clone(cartData)).then(() => {
                appLog('7', cartData)
                if (config?.print) {
                    printInvoice(cartData).then(() => {
                        navigation.replace('DrawerStackNavigator');
                    });
                } else {
                    navigation.replace('DrawerStackNavigator');
                }
                dispatch(setAlert({visible: true, message: 'Order Save Successfully'}))
                dispatch(hideLoader())
            })
            ////////// SAVE FINAL DATA //////////

        }
        catch (e) {
            appLog('e',e)
        }

    }

    /*const skipPayment = async () => {
        let cartData:any = store.getState().cartData;
        cartData.payments = [
            {
                remainingamount: vouchertotaldisplay,
                totalamount: vouchertotaldisplay,
                paymentgateways :[{gatewayname: 'Pay later',gatewaytype: 'paylater', pay: vouchertotaldisplay}]
            }
        ]
        dispatch(showLoader())
        await saveLocalOrder(cartData).then(async () => {
            await printInvoice(cartData).then();
            dispatch(setAlert({visible:true,message:'Order Save Successfully'}))
            navigation.replace('DrawerStackNavigator');
            dispatch(hideLoader())
        })
    }*/


    return <Container config={{title: 'Payment'}}>

        <ScrollView>

            <View style={[styles.grid, styles.middle, styles.justifyContent, styles.px_6]}>
                {Boolean(vouchertotaldisplay) && <View>

                    <Paragraph style={[styles.paragraph, styles.mb_10, styles.green, {
                        textAlign: 'center',
                        fontSize: 15,
                        height: 40,
                        paddingTop: 20,
                        fontWeight: 'bold'
                    }]}>{"Voucher Total"} : {toCurrency(vouchertotaldisplay)}</Paragraph>
                </View>}


                {Boolean(paidamount) && <View>

                    <Paragraph style={[styles.paragraph, styles.mb_10, styles.green, {
                        textAlign: 'center',
                        fontSize: 15,
                        height: 40,
                        paddingTop: 20,
                        fontWeight: 'bold'
                    }]}>{"Advance Pay"} : {toCurrency(paidamount)}</Paragraph>
                </View>}


                <View>

                    <Paragraph style={[styles.paragraph, styles.mb_10, styles.red, {
                        textAlign: 'center',
                        fontSize: 15,
                        height: 40,
                        paddingTop: 20,
                        fontWeight: 'bold'
                    }]}>{"Remaining Amount"} : {toCurrency(remainingAmount || '0')}</Paragraph>
                </View>


            </View>


            <View style={[styles.p_5]}>

                <Card style={[styles.mb_5,{backgroundColor:activePayLater ? styles.secondary.color :'white'}]}
                      onPress={() => {
                        let newDA = paymentMethods.map((pm: any) => ({...pm, paymentAmount: 0}))
                        setPaymentMethods(newDA);
                        dispatch(setCartData({payment: [{paymentby: "Pay Later", paymentAmount: vouchertotaldisplay}]}));
                    }}>
                    <Card.Content>
                        <View style={[styles.grid, styles.justifyContent, styles.px_6]}>
                            <View><Paragraph  style={[styles.paragraph,styles.bold]}>Pay later</Paragraph></View>
                        </View>
                    </Card.Content>
                </Card>
                {
                    paymentMethods?.map((pm: any, key: any) => {
                        return (<Card style={[styles.mb_5,{backgroundColor:Boolean(paymentMethods[key]?.paymentAmount) ? styles.secondary.color :'white'}]}
                                      onPress={() => {
                                        if (remainingAmount > 0) {
                                            paymentMethods[key] = {
                                                ...pm,
                                                paymentAmount: remainingAmount
                                            }
                                            setPaymentMethods(clone(paymentMethods));
                                        } else {
                                            let newData = [...paymentMethods.map((data: any) => ({...data, paymentAmount: 0}))];
                                            newData[key] = {
                                                ...pm,
                                                paymentAmount: vouchertotaldisplay
                                            }
                                            setPaymentMethods(newData);
                                        }
                                    }}>
                            <Card.Content>

                                <View style={[styles.grid, styles.justifyContent,]}>
                                    <View style={[ styles.px_6]}><Paragraph style={[styles.paragraph,styles.bold]}>{pm.label}</Paragraph></View>
                                    {Boolean(paymentMethods[key]?.paymentAmount) &&  <>
                                        <View style={{width:200}}>
                                            <InputBox
                                                value={pm?.paymentAmount+''}
                                                label={'Amount'}
                                                keyboardType='numeric'
                                                onChange={(value: any) => {
                                                    paymentMethods[key].paymentAmount = value;
                                                    setPaymentMethods(paymentMethods);
                                                }}
                                            />
                                        </View>
                                        <View style={{width:200}}>
                                            <InputBox
                                                value={pm?.bankCharges ? pm?.bankCharges+'' : '0'}
                                                label={'Bank Charges'}
                                                keyboardType='numeric'
                                                onChange={(value: any) => {
                                                    paymentMethods[key].bankCharges = value;
                                                    setPaymentMethods(paymentMethods);
                                                }}
                                            />
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                paymentMethods[key].paymentAmount = 0;
                                                paymentMethods[key].bankCharges = 0;
                                                setPaymentMethods(paymentMethods);
                                            }}>
                                                <Paragraph style={[styles.paragraph,styles.red]}>X</Paragraph>
                                            </TouchableOpacity>
                                        </View>
                                    </>}
                                </View>

                            </Card.Content>

                        </Card>)
                    })
                }


            </View>

        </ScrollView>


        <View  >


            {<View style={[styles.grid,styles.justifyContent,styles.p_6]}>
                <View style={[styles.w_auto]}>
                    <Button onPress={() => {
                        validatePayment()
                    }}> {`Generate Invoice`} </Button>
                </View>

                <View style={[styles.w_auto,styles.ml_2]}>
                    <Button
                        more={{backgroundColor: styles.yellow.color,color:'black' }}
                        onPress={() => {
                            validatePayment({print:true})
                        }}> {`Generate Invoice & Print`} </Button>
                </View>

            </View>}


        </View>

    </Container>

}

const mapStateToProps = (state: any) => ({
    payment: state?.cartData?.payment,
    payments: state?.cartData?.payments,
    vouchertotaldisplay: state.cartData.vouchertotaldisplay,
    paidamount: state.cartData.paidamount,
    voucherid: state.cartData.voucherid,
    vouchercurrencyrate: state.cartData.vouchercurrencyrate
})

export default connect(mapStateToProps)(withTheme(memo(Index)));


