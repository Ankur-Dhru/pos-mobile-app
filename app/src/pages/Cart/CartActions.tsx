import React, {memo, useEffect} from "react";
import {
    appLog, base64Encode,
    clone, dateFormat,
    generateKOT, getItem, getLeftRight, getPrintTemplate, getPrintTemplateLogo, getTrimChar,
    isRestaurant, numberFormat, objToArray, printInvoice, renderTemplate,

    retrieveData,
    saveTempLocalOrder, storeData
} from "../../libs/function";
import {View} from "react-native";
import {Card, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart, setCartData} from "../../redux-store/reducer/cart-data";
import {hideLoader, setAlert, setBottomSheet, showLoader} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import {db, device, localredux, PRINTER} from "../../libs/static";
import store from "../../redux-store/store";



const Index = ({
                   tableorders,
                   ordertype,
                   printcounter,
                   vouchertotaldisplay,
                   theme: {colors}
               }: any) => {

    const navigation = useNavigation()
    const hasRestaurant = isRestaurant()
    const dispatch = useDispatch()

    useEffect(() => {
        if (printcounter && !device.tablet) {
            navigation.navigate('Payment')
        }
    }, [])


    return <View>



        {<View style={[styles.marginOver,{backgroundColor:'white',marginTop:0,marginBottom:0,paddingVertical:5, paddingHorizontal: device.tablet? 10:5}]}>
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
                            <Button disable={!Boolean(vouchertotaldisplay)}
                                    onPress={() => generateKOT().then(() => {

                                        saveTempLocalOrder().then((msg:any) => {
                                            dispatch(hideLoader())
                                        })
                                    })}
                                    more={{backgroundColor: styles.yellow.color, color: 'black',height:50}}
                            >Print KOT </Button>
                        </View>
                        {ordertype !== 'qsr' && <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    onPress={async () => {



                                        printInvoice('',true).then((data: any) => {
                                            saveTempLocalOrder('', {print: Boolean(data)}).then((msg:any) => {
                                                dispatch(hideLoader())
                                            })
                                        });

                                        /*await generateKOT().then(() => {
                                            printInvoice().then((status: any) => {
                                                saveTempLocalOrder('', {print: Boolean(status)}).then((msg:any) => {
                                                    dispatch(hideLoader())
                                                })
                                            });
                                        });*/

                                    }
                                    }

                                    more={{backgroundColor: styles.accent.color, color: 'white',height:50}}
                            >Print Bill {`${printcounter ? '(' + printcounter + ')' : ''}`}</Button>
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
                                        dispatch(showLoader());
                                        saveTempLocalOrder().then((msg:any) => {

                                            dispatch(resetCart())
                                            dispatch(hideLoader());
                                            if (!device.tablet) {
                                                navigation.goBack()
                                            }
                                        })
                                    }
                                    }
                                    more={{backgroundColor: styles.yellow.color, color: 'black',height:50}}
                            > On Hold </Button>
                        </View></>}


                    <View style={[styles.w_auto, styles.ml_1]}>
                        <Button
                            disable={!Boolean(vouchertotaldisplay)}
                            secondbutton={!Boolean(vouchertotaldisplay)}

                            onPress={() => {
                                if (Boolean(vouchertotaldisplay)) {
                                    dispatch(showLoader())
                                    saveTempLocalOrder().then((msg:any) => {
                                        dispatch(hideLoader())
                                        navigation.navigate('Payment');
                                    })
                                }
                            }}

                            more={{backgroundColor: styles.green.color, color: 'white',height:50}}
                        > Payment Received
                        </Button>
                    </View>
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
    }
}

export default connect(mapStateToProps)(withTheme(memo(Index)));

