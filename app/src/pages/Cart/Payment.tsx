import React, {memo, useEffect, useState} from "react";
import {
    appLog,
    clone,
    getDefaultCurrency,
    getFloatValue,
    isEmpty, printInvoice,

    saveLocalOrder,
    toCurrency
} from "../../libs/function";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph, TextInput, withTheme,} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Button, Container} from "../../components";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {device, ItemDivider, localredux} from "../../libs/static";
import store from "../../redux-store/store";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {setCartData} from "../../redux-store/reducer/cart-data";
import ProIcon from "../../components/ProIcon";


const Index = ({vouchertotaldisplay, paidamount, payment, vouchercurrencyrate}: any) => {

    const dispatch = useDispatch();
    const navigation: any = useNavigation()

    if (!Boolean(paidamount)) {
        paidamount = 0
    }

    const {paymentgateway}: any = localredux.initData;
    const {currentLocation: {defaultpaymentgateway}, taxInvoice}: any = localredux.localSettingsData;

    const getGatewayDetailByKey = (key: any, value: any) => {
        const gatewayname: any = Object.keys(paymentgateway[key]).filter((key) => key !== "settings");
        let returnData = paymentgateway[key][gatewayname].find((a: any) => a.input === value)
        return {...returnData, type: gatewayname[0]}
    }

    useEffect(() => {
        dispatch(setCartData({payment: payment}));
    }, [])

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
        if (defaultpaymentgateway === key) {
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


    const validatePayment = async (config?: any) => {

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

                if (Boolean(payment.paymentAmount)) {
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

            if (remainingAmount === vouchertotaldisplay) {
                paymentgateways = [{gatewayname: 'Pay later', gatewaytype: 'paylater', pay: vouchertotaldisplay}]
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

            saveLocalOrder(clone(cartData)).then(async (order:any) => {
                if (config?.print) {
                    printInvoice({...order}).then(() => {});
                }
                redirectTo()
                dispatch(setAlert({visible: true, message: 'Order Save Successfully'}))
                dispatch(hideLoader())
            })
            ////////// SAVE FINAL DATA //////////

            const redirectTo = () => {

                if(cartData.ordertype === 'qsr'){
                    if(!device.tablet) {
                        navigation.goBack()
                    }
                    navigation.goBack()
                }
                else {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {name: 'ClientAreaStackNavigator'},
                            ],
                        })
                    );
                }
            }


        } catch (e) {
            appLog('e', e)
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
            navigation.replace('ClientAreaStackNavigator');
            dispatch(hideLoader())
        })
    }*/


    return <Container>


        <ScrollView>

            <Card>
                <Card.Content>


                    {<View style={[styles.grid,styles.justifyContent,styles.p_5]}>
                        <Paragraph style={[styles.paragraph, styles.bold,{color:styles.green.color}]}>{"Voucher Total"} </Paragraph>
                        <Paragraph style={[styles.paragraph,styles.bold,{color:styles.green.color}]}> {toCurrency(vouchertotaldisplay)}</Paragraph>
                    </View>}


                    {Boolean(paidamount) && <View>
                        <View style={[styles.grid,styles.justifyContent,styles.p_5]}>
                            <Paragraph style={[styles.paragraph, styles.bold,{color:styles.green.color}]}>{"Advance Pay"}</Paragraph>
                            <Paragraph style={[styles.paragraph,styles.bold,{color:styles.green.color}]}> {toCurrency(paidamount)}</Paragraph>
                        </View>
                    </View>}

                    <ItemDivider/>

            <View style={[styles.py_5]}>


                {
                    paymentMethods?.map((pm: any, key: any) => {
                        return (<View key={key}>


                            <View style={[styles.grid, styles.justifyContent]}>



                                <View style={{width:30}}>
                                    <TouchableOpacity>
                                        {
                                            Boolean(paymentMethods[key]?.paymentAmount) ?
                                            <ProIcon name={'circle-check'}   color={styles.green.color}></ProIcon> :
                                            <ProIcon name={'circle'} ></ProIcon>
                                        }
                                    </TouchableOpacity>
                                </View>



                                <View style={[styles.w_auto]}>
                                    <View style={[styles.grid,styles.px_5, styles.justifyContent]}>



                                        <TouchableOpacity onPress={() => {
                                            if (remainingAmount > 0) {
                                                paymentMethods[key] = {
                                                    ...pm,
                                                    paymentAmount: remainingAmount
                                                }
                                                setPaymentMethods(clone(paymentMethods));
                                            } else {
                                                let newData = [...paymentMethods.map((data: any) => ({
                                                    ...data,
                                                    paymentAmount: 0
                                                }))];
                                                newData[key] = {
                                                    ...pm,
                                                    paymentAmount: vouchertotaldisplay
                                                }
                                                setPaymentMethods(clone(newData));
                                            }
                                        }} style={[styles.w_auto]}>
                                            <View style={{paddingVertical:20}}><Paragraph  style={[styles.paragraph, styles.bold,{color:Boolean(paymentMethods[key]?.paymentAmount)?styles.green.color:'black'}]}>{pm.label}</Paragraph></View>
                                        </TouchableOpacity>

                                        {<>
                                            {Boolean(paymentMethods[key]?.paymentAmount) && <View style={{width: 100,paddingBottom:5}}>

                                                <TextInput
                                                    label=""
                                                    placeholder={'Amount'}
                                                    mode={'outlined'}
                                                    numberOfLines={1}
                                                    blurOnSubmit={true}

                                                    selectionColor={styles.secondary.color}
                                                    selectTextOnFocus={true}
                                                    keyboardType='numeric'
                                                    defaultValue={pm?.paymentAmount + ''}
                                                    onChangeText={(value) => {
                                                        paymentMethods[key].paymentAmount = value
                                                        setPaymentMethods(clone(paymentMethods));
                                                    }
                                                    }
                                                />

                                            </View>}
                                            {/*{Boolean(paymentMethods[key]?.paymentAmount) &&
                                                <View style={{width: 140, marginLeft: 5}}>

                                                    <TextInput
                                                        label=""
                                                        placeholder={'Bank Charges'}

                                                        mode={'outlined'}
                                                        keyboardType='numeric'
                                                        onChangeText={(value) => {
                                                            paymentMethods[key].bankCharges = value
                                                            setPaymentMethods(clone(paymentMethods));
                                                        }
                                                        }
                                                    />

                                                </View>}*/}
                                        </>}

                                    </View>
                                </View>

                                <View style={{width:50}}>
                                    {Boolean(paymentMethods[key]?.paymentAmount) &&
                                        <TouchableOpacity onPress={() => {
                                            paymentMethods[key].paymentAmount = 0;
                                            paymentMethods[key].bankCharges = 0;
                                            setPaymentMethods(clone(paymentMethods));
                                        }}>
                                            <ProIcon name={'circle-xmark'}></ProIcon>
                                        </TouchableOpacity>
                                    }
                                </View>

                            </View>


                        </View>)
                    })
                }


                <View style={[styles.grid, styles.justifyContent]} >

                    <View style={{width:30}}>
                        <TouchableOpacity>
                            {
                                Boolean(activePayLater) ?
                                    <ProIcon name={'circle-check'}   color={styles.green.color}></ProIcon> :
                                    <ProIcon name={'circle'} ></ProIcon>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.w_auto]}>
                        <TouchableOpacity onPress={() => {
                            let newDA = paymentMethods.map((pm: any) => ({...pm, paymentAmount: 0}))
                            setPaymentMethods(newDA);
                            dispatch(setCartData({
                                payment: [{
                                    paymentby: "Pay Later",
                                    paymentAmount: vouchertotaldisplay
                                }]
                            }));
                        }} style={[styles.px_5]}>
                            <View style={[styles.grid, styles.justifyContent,{paddingVertical:20}]}>
                                <View><Paragraph style={[styles.paragraph, styles.bold,{color:Boolean(activePayLater)?styles.green.color:'black'}]}>Pay later</Paragraph></View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View></View>

                </View>

            </View>


                    <ItemDivider/>

                <View>
                    {<View style={[styles.grid,styles.justifyContent,styles.p_5]}>
                        <Paragraph style={[styles.paragraph, styles.bold,{color:styles.red.color}]}> Remaining </Paragraph>
                        <Paragraph style={[styles.paragraph,styles.bold,{color:styles.red.color}]}>  {toCurrency(remainingAmount || '0')}</Paragraph>
                    </View>}
                </View>


                </Card.Content>
            </Card>


        </ScrollView>


        <View>


            {<View style={[styles.grid, styles.justifyContent]}>

                <View style={[styles.w_auto]}>
                    <Button
                        more={{backgroundColor: styles.secondary.color, color: 'black',height:50}}
                        onPress={() => {
                            validatePayment({print: true}).then()
                        }}>Print & Generate Invoice</Button>
                </View>

                <View style={[styles.w_auto, styles.ml_1]}>
                    <Button more={{color:'white',height:50}} onPress={() => {
                        validatePayment().then()
                    }}> Generate Invoice </Button>
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


