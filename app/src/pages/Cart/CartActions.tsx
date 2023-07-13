import React, {memo, useEffect} from "react";
import {
    appLog, base64Encode,
    clone, dateFormat,
    generateKOT, getItem, getLeftRight, getPrintTemplate, getPrintTemplateLogo, getTrimChar,
    isRestaurant, numberFormat, objToArray, printInvoice, renderTemplate,

    retrieveData,
    saveTempLocalOrder, storeData
} from "../../libs/function";
import {Alert, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart, setCartData} from "../../redux-store/reducer/cart-data";
import {hideLoader, setAlert, setBottomSheet, showLoader} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import {db, device, localredux, PRINTER, urls} from "../../libs/static";
import store from "../../redux-store/store";
import {ProIcon} from "../../components";



const Index = ({
                   tableorders,
                   ordertype,
                   printcounter,
                   vouchertotaldisplay,
                   kotongenerateinvoice,
                   theme: {colors}
               }: any) => {

    const navigation = useNavigation()
    const hasRestaurant = isRestaurant()
    const dispatch = useDispatch()

    const {settings:{cant_complete_remote_order}} = localredux.authData

    useEffect(() => {
        if (printcounter && !device.tablet) {
            navigation.navigate('Payment')
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


    return <View>



        {<View style={[{backgroundColor:'white',marginTop:0,marginBottom:0,paddingVertical:5, paddingHorizontal: 5}]}>
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
                                    style={{backgroundColor: styles.yellow.color, borderRadius: 7,height:50}}>
                                <View style={[styles.grid,styles.noWrap,styles.middle,styles.center,styles.w_100,styles.h_100]}>
                                    <ProIcon name={'print'} size={15} />
                                    <View>
                                        <Paragraph style={[styles.paragraph,styles.bold,{width:80}]}>Send To Kitchen</Paragraph>
                                    </View>
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
                                    style={{backgroundColor: styles.accent.color, height:50,borderRadius:7}}
                            >
                               <View style={[styles.grid,styles.noWrap,styles.middle,styles.center,styles.w_100,styles.h_100]}>
                                   <ProIcon name={'print'} color={'white'} size={15}/>
                                   <Paragraph  style={[styles.paragraph,styles.bold,{color:'white'}]}> Print Bill {`${printcounter ? '(' + printcounter + ')' : ''}`}</Paragraph>
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
                                more={{backgroundColor: styles.yellow.color, color: 'black',height:50}}
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
                                    more={{backgroundColor: styles.yellow.color, color: 'black',height:50}}
                            > On Hold </Button>
                        </View></>}


                    {(!Boolean(urls.localserver) || (Boolean(urls.localserver) && !cant_complete_remote_order)) && <View style={[styles.w_auto, styles.ml_1]}>
                        <Button

                            secondbutton={!Boolean(vouchertotaldisplay)}
                            onPress={() => {
                                if (Boolean(vouchertotaldisplay)) {
                                    dispatch(showLoader())
                                    saveTempLocalOrder().then((data:any) => {
                                        dispatch(hideLoader());
                                        navigation.navigate('Payment');
                                    })
                                }
                            }}
                            more={{backgroundColor: styles.green.color, color: 'white',height:50}}
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
        kotongenerateinvoice: state.localSettings?.kotongenerateinvoice,
    }
}

export default connect(mapStateToProps)(withTheme(memo(Index)));

