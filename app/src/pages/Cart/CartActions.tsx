import React, {memo, useEffect} from "react";
import {
    appLog, base64Encode,
    clone, dateFormat, errorAlert,
    generateKOT, getItem, getLeftRight, getPrintTemplate, getPrintTemplateLogo, getTrimChar,
    isRestaurant, numberFormat, objToArray, prelog, printInvoice,

    retrieveData, saveLocalOrder,
    saveTempLocalOrder, storeData
} from "../../libs/function";
import {Alert, TouchableOpacity, View} from "react-native";
import {Caption, Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart, setCartData, updateCartField} from "../../redux-store/reducer/cart-data";
import {hideLoader, setAlert, setBottomSheet, showLoader} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import {ACTIONS, db, device, localredux, METHOD, PRINTER, STATUS, urls, VOUCHER} from "../../libs/static";
import store from "../../redux-store/store";
import {ProIcon} from "../../components";
import {redirectTo} from "./Payment";
import apiService from "../../libs/api-service";
import {itemTotalCalculation} from "../../libs/item-calculation";



const Index = ({
                   tableorders,
                   ordertype,
                   printcounter,
                   vouchertotaldisplay,
                   kotongenerateinvoice,
                   clientid,
                   theme: {colors}
               }: any) => {

    const navigation = useNavigation()
    const hasRestaurant = isRestaurant()

    const dispatch = useDispatch()

    let cartData = store.getState().cartData;


    const {settings:{cant_complete_remote_order}} = localredux.authData

    useEffect(() => {
        if (printcounter && !device.tablet) {
            if(!Boolean(urls.localserver) || (Boolean(urls.localserver) && !cant_complete_remote_order)){
                navigation.navigate('Payment')
            }
        }
    }, [])


    const KOTActions = (cancelkotprint:any) => {
        generateKOT(cancelkotprint).then(() => {
            dispatch(hideLoader())
            printInvoice().then((status: any) => {
                saveTempLocalOrder('', {print: Boolean(status)}).then((msg:any) => {
                    dispatch(hideLoader())
                })
            });
        });
    }



    const saveVoucher = async (config:any) => {


        cartData =  await itemTotalCalculation({
            ...cartData,
        }, undefined, undefined, undefined, undefined, 2, 2, false, false);


        if (Boolean(vouchertotaldisplay)) {
            dispatch(showLoader())

            const {workspace}: any = localredux.initData;
            const {token}: any = localredux.authData;

            await apiService({
                method: METHOD.POST,
                action: ACTIONS.SALESRETURN,
                body: cartData,
                workspace: workspace,
                token: token,
                other: {url: urls.posUrl},
            }).then(async (result) => {
                dispatch(hideLoader())
                if (result.status === STATUS.SUCCESS) {
                    if (config?.print) {
                        printInvoice({...cartData},PRINTER.SALESRETURN).then(() => {});
                    }
                    redirectTo(cartData,navigation)
                    dispatch(setAlert({visible: true, message: 'Order Save Successfully'}));
                } else {
                    errorAlert(result.message)
                }
            });

        }
    }


    if(cartData.vouchertypeid === VOUCHER.SALESRETURN) {
        return <View style={[{
            backgroundColor: 'white',
            marginTop: 0,
            marginBottom: 0,
            paddingVertical: 5,
            paddingHorizontal: 5
        }]}>
            <View>
                <View style={[styles.grid, styles.justifyContent, styles.noWrap]}>

                    <View style={[styles.w_auto, styles.ml_1]}>
                        <Button
                            secondbutton={!Boolean(vouchertotaldisplay)}
                            onPress={() => {
                                saveVoucher({print: false})
                            }}
                            more={{backgroundColor: styles.primary.color, color: 'white', height: 50}}
                        > Save
                        </Button>
                    </View>

                    <View style={[styles.w_auto, styles.ml_1]}>

                        <Button
                            secondbutton={!Boolean(vouchertotaldisplay)}
                            onPress={() => {
                                saveVoucher({print: true})
                            }}
                            more={{backgroundColor: styles.green.color, color: 'white', height: 50}}
                        > Save & Print
                        </Button>
                    </View>

                </View>
            </View>

        </View>
    }


    return <View>



        {<View style={[{backgroundColor:'white',marginTop:5,marginBottom:0,paddingHorizontal: device.tablet? 5 :0  }]}>
            <View>
                <View style={[styles.grid, styles.justifyContent, styles.noWrap]}>


                    {/*<View style={[styles.w_auto]}>
                        <Button
                                secondbutton={!Boolean(vouchertotaldisplay)}
                                onPress={() => cancelOrder().then()}
                                more={{backgroundColor: styles.red.color, color: 'white'}}
                        > Cancel </Button>
                    </View>*/}

                    {hasRestaurant && <>

                        {/*<View style={[styles.w_auto]}>
                            <Button  disable={!Boolean(vouchertotaldisplay)}
                                     onPress={() =>  {
                                         if(Boolean(vouchertotaldisplay)){
                                             dispatch(showLoader())
                                             saveTempLocalOrder().then(() => {

                                                 navigation.replace('ClientAreaStackNavigator');
                                                 dispatch(hideLoader())
                                             })
                                         }
                                     }}
                                     more={{backgroundColor: styles.green.color,  }}
                            >Save </Button>
                        </View>*/}

                        <View style={[styles.w_auto]}>
                            <TouchableOpacity
                                    onPress={() => { Boolean(vouchertotaldisplay) && generateKOT().then(() => {
                                        saveTempLocalOrder().then((msg:any) => {
                                            dispatch(hideLoader())
                                        })
                                    })}}
                                    style={{backgroundColor: styles.yellow.color, borderRadius: 5,height:55}}>
                                <View style={[styles.noWrap,styles.middle,styles.center,styles.w_100,styles.h_100]}>
                                    <ProIcon name={'print'}  height={20}  size={13}/>
                                    <Paragraph style={[styles.paragraph]}>Send To Kitchen</Paragraph>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {ordertype !== 'qsr' && <View style={[styles.w_auto, styles.ml_1]}>
                            <TouchableOpacity
                                    onPress={async () => {
                                        if (Boolean(vouchertotaldisplay)) {
                                            if (kotongenerateinvoice === 'Ask On Place') {
                                                await Alert.alert(
                                                    "Alert",
                                                    'Want to print KOT?',
                                                    [
                                                        {
                                                            text: "Cancel", onPress: () => {
                                                                KOTActions(true)
                                                            }, style: 'cancel'
                                                        },
                                                        {text: "Print", onPress: () => KOTActions(false)}
                                                    ]
                                                );
                                            } else {
                                                KOTActions(kotongenerateinvoice === 'Disable')
                                            }

                                        }
                                    }
                                 }
                                    style={{backgroundColor: styles.accent.color, height:55,borderRadius:5}}
                            >
                               <View style={[styles.noWrap,styles.middle,styles.center,styles.w_100,styles.h_100]}>
                                   <ProIcon name={'print'} color={'white'} height={20} size={13}/>
                                   <Caption  style={[styles.paragraph,{color:'white'}]}> Print Bill {`${printcounter ? '(' + printcounter + ')' : ''}`}</Caption>
                               </View>
                            </TouchableOpacity>
                        </View>}
                    </>}
                    {/*<View style={[styles.w_auto, styles.ml_1, styles.mr_1]}>
                        <Button> Drawer </Button>
                    </View>*/}

                    {(!hasRestaurant) &&  <>
                        {device.tablet && <View style={[styles.w_auto,styles.mr_1]}>
                            <Button
                                secondbutton={Boolean(vouchertotaldisplay)}
                                onPress={async () => {
                                      await dispatch(setBottomSheet({
                                        visible: true,
                                        height: '50%',
                                        component: () => <HoldOrders/>
                                    }))
                                }}
                                more={{backgroundColor: styles.yellow.color, color: 'black',height:55}}
                            > Recall </Button>
                        </View>}
                        <View style={[styles.w_auto]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}
                                    secondbutton={!Boolean(vouchertotaldisplay)}
                                    onPress={() => {

                                        if (Boolean(vouchertotaldisplay)) {

                                            dispatch(showLoader());
                                            saveTempLocalOrder().then((msg: any) => {

                                                dispatch(resetCart())
                                                dispatch(hideLoader());
                                                if (!device.tablet) {
                                                    navigation.goBack()
                                                }
                                            })
                                        }
                                    }
                                    }
                                    more={{backgroundColor: styles.yellow.color, color: 'black',height:55}}
                            > On Hold </Button>
                        </View></>}


                    {(!Boolean(urls.localserver) || (Boolean(urls.localserver) && !cant_complete_remote_order)) && <View style={[styles.w_auto, styles.ml_1]}>
                        <Button

                            secondbutton={!Boolean(vouchertotaldisplay)}
                            onPress={() => {

                                if(localredux.localSettingsData?.currentLocation?.clientrequired && clientid === 1){
                                    errorAlert('Please Select Client')
                                }
                                else{
                                    if (Boolean(vouchertotaldisplay)) {
                                        dispatch(showLoader())
                                        saveTempLocalOrder().then((data:any) => {
                                            dispatch(hideLoader());
                                            navigation.navigate('Payment');
                                        })
                                    }
                                }
                            }}
                            more={{backgroundColor: styles.green.color, color: 'white',height:55}}
                        > Payment Received
                        </Button>
                    </View>}
                </View>
            </View>

        </View>}

    </View>
}

const mapStateToProps = (state: any) => {
    return {
        vouchertotaldisplay: state.cartData.vouchertotaldisplay,
        printcounter: state.cartData?.printcounter,
        ordertype: state.cartData.ordertype,
        clientid: state.cartData.clientid,
        kotongenerateinvoice: state.localSettings?.kotongenerateinvoice,
    }
}

export default connect(mapStateToProps)(withTheme(memo(Index)));

