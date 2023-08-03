import React, {memo, useEffect, useState} from "react";
import {
    appLog,
    clone,
    errorAlert, findObject,
    getDefaultCurrency,
    getFloatValue,
    getTicketStatus,
    groupBy,
    isEmpty, printInvoice,
    saveLocalOrder,
    toCurrency
} from "../../libs/function";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, TextInput, withTheme,} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Button, Container} from "../../components";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {device, ItemDivider, localredux, TICKET_STATUS} from "../../libs/static";
import store from "../../redux-store/store";
import {setCartData, updateCartField} from "../../redux-store/reducer/cart-data";
import ProIcon from "../../components/ProIcon";
import crashlytics from "@react-native-firebase/crashlytics";
import ToggleButtons from "../../components/ToggleButton";
import PaxesSelection from "../Items/PaxesSelection";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";


export const splitPaxwise = async () => {
    let {cartData, cartData: {invoiceitems}} = store.getState()
    const paxwiseitems = groupBy(invoiceitems, 'pax');
    let data: any = {}
    return await new Promise(async (resolve) => {
        let vouchertotal = 0;
        for (const key of Object.keys(paxwiseitems)) {
            data[key] = await itemTotalCalculation({
                ...cartData,
                invoiceitems: paxwiseitems[key]
            }, undefined, undefined, undefined, undefined, 2, 2, false, false);
            vouchertotal += data[key].vouchertotaldisplay
        }

        let paxarray = Object.keys(data);
        let difference = cartData.vouchertotaldisplay - vouchertotal
        data[paxarray.length].vouchertotaldisplay = data[paxarray.length].vouchertotaldisplay + difference
        resolve(data)
    })
}

const Index = ({
                   paidamount,
                   payment,
                   vouchercurrencyrate,
                   clientid,
                   orderbypax,
                   currentpax
               }: any) => {

    const dispatch = useDispatch();
    const navigation: any = useNavigation()

    if (!Boolean(paidamount)) {
        paidamount = 0
    }

    let {cartData, cartData: {invoiceitems}} = store.getState()


    const [vouchertotaldisplay,setVouchertotaldisplay] = useState(cartData.vouchertotaldisplay)
    const [paxwise, setPaxwise]:any = useState({})

    const {paymentgateway}: any = localredux.initData;
    const {defaultpaymentgateway}: any = localredux.localSettingsData.currentLocation || {};
    const {taxInvoice} = localredux.localSettingsData;



    useEffect(() => {
        crashlytics().log('change tax Invoice');
        if (taxInvoice) {
            dispatch(setCartData({payment: [{paymentby: "Pay Later"}]}));
        }
    }, [taxInvoice]);


    useEffect(() => {
        splitPaxwise().then((data: any) => {
            cartData = {
                ...cartData,
                payment: payment,
                currentpax:'all'
            }
            setPaxwise(data);
            dispatch(setCartData(cartData));
        })
    }, [])


    const [remainingAmount, setRemainingAmount] = useState<any>(0);
    const [billremainingAmount,setBillremainingAmount] = useState(cartData.vouchertotaldisplay)
    const [activePayLater, setActivePayLater] = useState<boolean>(false);

    const getGatewayDetailByKey = (key: any, value: any) => {
        crashlytics().log('getGatewayDetailByKey');
        const gatewayname: any = Object.keys(paymentgateway[key]).filter((key) => key !== "settings");
        let returnData = paymentgateway[key] && paymentgateway[key][gatewayname] && paymentgateway[key][gatewayname].find((a: any) => a.input === value)
        return {...returnData, type: gatewayname[0]}
    }

    const getPaymentgateways = () => {

        return Object.keys(paymentgateway).map((key: any) => {
            const b: any = getGatewayDetailByKey(key, 'displayname');
            const find = payment.find((pay: any) => pay.paymentmethod === key);
            let item: any = {label: b.value, value: key, type: b.type, paymentby: b.value, paymentmethod: key};
            if (!isEmpty(find)) {
                item.paymentAmount = find?.paymentAmount || 0
            }

            if (defaultpaymentgateway === key) {
                item.paymentAmount = vouchertotaldisplay || 0
            }

            if(currentpax !== 'all') {
                if (paxwise[currentpax]?.payments && paxwise[currentpax]?.payments[0]?.paymentgateways) {
                    let find = findObject(paxwise[currentpax]?.payments[0]?.paymentgateways,'gid',key,true)
                    item.paymentAmount = find?.pay;
                }
            }

            return item
        })
    }

    const [paymentMethods, setPaymentMethods] = useState<any>(clone(isEmpty(paymentgateway) ? [] : getPaymentgateways()));


    useEffect(() => {

        crashlytics().log('change payment method');
        const sum = paymentMethods.reduce((accumulator: any, object: any) => {
            return accumulator + +(object?.paymentAmount || 0);
        }, 0);

        setRemainingAmount(vouchertotaldisplay - sum);
        let paidSelected = Boolean((payment[0]?.paymentby === "Pay Later") || (sum === 0));
        if (paidSelected) {
            paidSelected = !paymentMethods.some((pm: any) => Boolean(pm.paymentAmount))
        }


        if(currentpax !== 'all' && !isEmpty(paxwise)){
            let totalpaxpay:any = 0;
            Object.keys(paxwise)?.map((key:any)=>{

                if(paxwise[key]?.payments && paxwise[key]?.payments[0]?.paymentgateways){
                    paxwise[key]?.payments[0]?.paymentgateways.map(({pay}:any)=>{
                        totalpaxpay += +pay
                    })
                }

            })
            setBillremainingAmount(cartData.vouchertotaldisplay -  totalpaxpay);
        }


        setActivePayLater(paidSelected)

    }, [paymentMethods])


    useEffect(()=>{
        let total = cartData.vouchertotaldisplay
        if(currentpax !=='all') {
            total = paxwise[currentpax]?.vouchertotaldisplay
        }

        setVouchertotaldisplay(total)
    },[currentpax])


    /*useEffect(()=>{
        Object.keys(paxwise).map((key:any)=>{

        })
    },[paxwise])*/


    useEffect(()=>{
        setPaymentMethods(getPaymentgateways())
    },[vouchertotaldisplay])


    const setPaymentbypax = (cartData:any) => {

        cartData = {
            ...cartData, payment: paymentMethods,
        }

        let paymentgateways: any = [];
        const systemc: any = getDefaultCurrency();

        paymentMethods.map((payment: any) => {

            const gatewayname: any = Object.keys(paymentgateway[payment.paymentmethod]).filter((key) => key !== "settings");

            const name = paymentgateway[payment.paymentmethod][gatewayname].find((a: any) => a.input === "displayname")

            if (Boolean(payment.paymentAmount)) {
                paymentgateways = [...paymentgateways, {
                    "gid": payment.paymentmethod,
                    "gatewayname": name.value,
                    "pay": payment.paymentAmount,
                    "paysystem": getFloatValue(payment.paymentAmount * (1 / vouchercurrencyrate), systemc.decimalplace),
                    "receipt": "",
                    "phone": "",
                    "otp": "",
                    pax:currentpax,
                    referencetxnno: payment?.referencetxnno,
                    bankcharges: payment?.bankCharges,
                    "gatewaytype": gatewayname[0]
                }]
            }
        })



        if (remainingAmount === vouchertotaldisplay) {
            paymentgateways = [{gatewayname: 'Pay later', gatewaytype: 'paylater', pay: vouchertotaldisplay}]
        }

        cartData.payments = [{
            "remainingamount": remainingAmount, "totalamount": vouchertotaldisplay, paymentgateways
        }];

        cartData.paymentmethod = cartData?.payments[0]?.paymentgateways.map((method: any) => {
            return method.gid
        }).join(',');

        return cartData
    }

    const payNext = async () => {

        try {
            let cartData: any = setPaymentbypax(paxwise[currentpax]);
            setPaxwise({...paxwise,[currentpax]:cartData})
            if(Boolean(paxwise[currentpax + 1])) {
                dispatch(updateCartField({currentpax: currentpax + 1}))
            }
            else{
                dispatch(updateCartField({currentpax: 1}))
            }

        } catch (e) {
            appLog('e', e)
        }

    }

    const validatePayment = async (config?: any) => {

        crashlytics().log('validatePayment');

        try {

           let cartData = setPaymentbypax(store.getState().cartData)



            if(currentpax !== 'all'){
                let payments:any = []
                Object.keys(paxwise).map((key:any)=>{
                    paxwise[key]?.payments[0]?.paymentgateways?.map((paxpayment:any)=>{
                        payments.push(paxpayment);
                    })
                })
                cartData = {
                    ...cartData,
                    payments: [{
                        "remainingamount": 0,
                        "totalamount": cartData.vouchertotaldisplay,
                        "paymentgateways": payments
                    }]
                }
            }



            if (Boolean(cartData?.kots.length)) {
                const DONEStatus = getTicketStatus(TICKET_STATUS.DONE);
                cartData.kots = cartData?.kots?.map((kot: any, key: any) => {
                    return {
                        ...kot, ticketstatus: DONEStatus?.statusid, ticketstatusname: DONEStatus?.ticketstatusname
                    }
                });
            }

            if (Boolean(cartData?.vehicleno)) {
                cartData.vouchernotes += `Vehicle No : ${cartData.vehicleno}`;
            }

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


    const paymentSelection = (key: any, pm: any) => {
        crashlytics().log('paymentSelection');
        if (remainingAmount > 0) {
            paymentMethods[key] = {
                ...pm, paymentAmount: remainingAmount
            }
            setPaymentMethods(clone(paymentMethods));
        } else {
            let newData = [...paymentMethods.map((data: any) => ({
                ...data, paymentAmount: 0
            }))];
            newData[key] = {
                ...pm, paymentAmount: vouchertotaldisplay
            }
            setPaymentMethods(clone(newData));
        }
    }


    return <Container style={{padding: 0}}>


        <ScrollView>

            <Card style={[styles.card]}>
                <Card.Content>


                    {orderbypax && <>
                        <ToggleButtons
                            width={'50%'}
                            default={'all'}
                            btns={[{label: 'Common Bill', value: 'all'}, {label: 'By Pax', value: 1}]}
                            onValueChange={(value: any) => {
                                dispatch(updateCartField({'currentpax':value}))
                            }}
                        />

                        {currentpax !== 'all' && <View style={[styles.p_5]}>
                            <PaxesSelection paxwise={paxwise} />
                        </View>}

                    </>}


                    <View style={[styles.grid, styles.justifyContent, styles.p_5, styles.mt_5]}>
                        <Paragraph style={[styles.paragraph, styles.bold, styles.text_lg]}>{"Total"} </Paragraph>
                        <Paragraph
                            style={[styles.paragraph, styles.bold, styles.text_lg]}> {toCurrency(vouchertotaldisplay)}</Paragraph>
                    </View>


                    {Boolean(paidamount) && <View>
                        <View style={[styles.grid, styles.justifyContent, styles.p_5]}>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, {color: styles.green.color}]}>{"Advance Pay"}</Paragraph>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, {color: styles.green.color}]}> {toCurrency(paidamount)}</Paragraph>
                        </View>
                    </View>}


                    <ItemDivider/>


                    <View style={[styles.py_5]}>

                        {paymentMethods?.map((pm: any, key: any) => {

                            return (<View key={key}>


                                <View style={[styles.grid, styles.justifyContent]}>


                                    <View style={{width: 30}}>
                                        {<TouchableOpacity onPress={() => {
                                            paymentSelection(key, pm)
                                        }}>
                                            {Boolean(paymentMethods[key]?.paymentAmount) ?
                                                <ProIcon name={'circle-check'} color={styles.green.color}></ProIcon> :
                                                <ProIcon name={'circle'}></ProIcon>}
                                        </TouchableOpacity>}
                                    </View>


                                    <View style={[styles.w_auto]}>
                                        <View style={[styles.grid, styles.px_5, styles.justifyContent]}>

                                            <TouchableOpacity onPress={() => {
                                                paymentSelection(key, pm)
                                            }} style={[styles.w_auto]}>
                                                <View style={{paddingVertical: 20}}><Paragraph
                                                    style={[styles.paragraph, styles.bold, {color: Boolean(paymentMethods[key]?.paymentAmount) ? styles.green.color : 'black'}]}>{pm.label}</Paragraph></View>
                                            </TouchableOpacity>

                                            {<>
                                                {Boolean(paymentMethods[key]?.paymentAmount) &&
                                                    <View style={{width: 100, paddingBottom: 5}}>

                                                        <TextInput
                                                            label=""
                                                            placeholder={'Amount'}
                                                            mode={'outlined'}
                                                            numberOfLines={1}
                                                            selectionColor={styles.secondary.color}
                                                            selectTextOnFocus={true}
                                                            keyboardType='numeric'
                                                            value={pm?.paymentAmount + ''}
                                                            onChangeText={(value) => {
                                                                paymentMethods[key].paymentAmount = value
                                                                setPaymentMethods(clone(paymentMethods));
                                                            }}
                                                        />

                                                    </View>}
                                            </>}


                                        </View>
                                    </View>

                                    <View style={{width: 50}}>
                                        {Boolean(paymentMethods[key]?.paymentAmount) && paymentMethods.length > 1 && (clientid !== 1) &&
                                            <TouchableOpacity onPress={() => {
                                                paymentMethods[key].paymentAmount = 0;
                                                paymentMethods[key].bankCharges = 0;
                                                setPaymentMethods(clone(paymentMethods));
                                            }}>
                                                <ProIcon name={'circle-xmark'}></ProIcon>
                                            </TouchableOpacity>}
                                    </View>

                                </View>


                            </View>)
                        })}


                        {currentpax === 'all' &&  <View style={[styles.grid, styles.justifyContent]}>

                            <View style={{width: 30}}>
                                <TouchableOpacity>
                                    {Boolean(activePayLater) ?
                                        <ProIcon name={'circle-check'} color={styles.green.color}></ProIcon> :
                                        <ProIcon name={'circle'}></ProIcon>}
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.w_auto]}>
                                <TouchableOpacity onPress={() => {

                                    if (+clientid !== 1) {
                                        if (!Boolean(remainingAmount)) {
                                            let newDA = paymentMethods.map((pm: any) => ({...pm, paymentAmount: 0}))
                                            setPaymentMethods(newDA);
                                            dispatch(setCartData({
                                                payment: [{
                                                    paymentby: "Pay Later", paymentAmount: vouchertotaldisplay
                                                }]
                                            }));
                                        }
                                    } else {
                                        errorAlert('Please select client')
                                    }

                                }} style={[styles.px_5]}>
                                    <View style={[styles.grid, styles.justifyContent, {paddingVertical: 20}]}>
                                        <View><Paragraph
                                            style={[styles.paragraph, styles.bold, {color: Boolean(activePayLater) ? styles.green.color : 'black'}]}>Pay
                                            later</Paragraph></View>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View></View>

                        </View>}

                    </View>


                    <ItemDivider/>

                    <View>
                        {<View style={[styles.grid, styles.justifyContent, styles.p_5]}>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, styles.text_lg, {color: styles.red.color}]}>Remaining </Paragraph>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, styles.text_lg, {color: styles.red.color}]}>  {toCurrency(remainingAmount || '0')}</Paragraph>
                        </View>}
                    </View>

                    {currentpax !== 'all' && <View>
                        {<View style={[styles.grid, styles.justifyContent, styles.p_5]}>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, styles.text_lg, {color: styles.red.color}]}>Bill Remaining </Paragraph>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, styles.text_lg, {color: styles.red.color}]}>  {toCurrency(billremainingAmount || '0')}</Paragraph>
                        </View>}
                    </View>}


                </Card.Content>
            </Card>




        </ScrollView>



        {currentpax !== 'all' && Boolean(billremainingAmount !== 0) && Boolean(remainingAmount === 0) && <View  style={[styles.p_4]}>
            <Button
                more={{color: 'black', backgroundColor: styles.secondary.color, height: 55}}
                onPress={() => {
                    payNext().then()
                }}>Pay #pax {currentpax} </Button>
        </View>}



        {(currentpax === 'all'   || Boolean(billremainingAmount === 0)) && <View>


            {<View style={[styles.grid, styles.justifyContent, styles.p_4]}>

                <View style={[styles.w_auto]}>
                    <Button more={{backgroundColor: styles.secondary.color, color: 'black', height: 55}}
                            onPress={() => {
                                validatePayment().then()
                            }}> Generate Invoice </Button>
                </View>

                <View style={[styles.w_auto, styles.ml_1]}>
                    <Button
                        more={{color: 'white', backgroundColor: styles.primary.color, height: 55}}
                        onPress={() => {
                            validatePayment({print: true}).then()
                        }}>Print & Generate Invoice</Button>

                </View>


            </View>}


        </View>}

    </Container>

}

const mapStateToProps = (state: any) => ({
    payment: state?.cartData?.payment,
    payments: state?.cartData?.payments,
    clientid: state?.cartData?.clientid,

    paidamount: state.cartData.paidamount,
    voucherid: state.cartData.voucherid,
    vouchercurrencyrate: state.cartData.vouchercurrencyrate,
    orderbypax: state.cartData.orderbypax,
    currentpax: state.cartData.currentpax,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));


