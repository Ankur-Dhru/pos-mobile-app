import React, {memo, useEffect} from "react";
import {appLog, generateKOT, isRestaurant, printInvoice, saveTempLocalOrder} from "../../libs/function";
import {View} from "react-native";
import {withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart} from "../../redux-store/reducer/cart-data";
import {hideLoader, setBottomSheet, showLoader} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import {device} from "../../libs/static";


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


    return <View style={[!device.tablet && styles.p_3]}>

        {<View>
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

                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}
                                    onPress={() => generateKOT().then(() => {
                                        appLog('generate KOT')
                                        saveTempLocalOrder().then((msg:any) => {
                                            appLog('msg',msg)
                                            dispatch(hideLoader())
                                        })
                                    })}
                                    more={{backgroundColor: styles.yellow.color, color: 'black'}}
                            >Print KOT </Button>
                        </View>
                        {ordertype !== 'qsr' && <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    onPress={async () => {

                                        await generateKOT().then(() => {
                                            appLog('generate KOT')
                                            printInvoice().then((status: any) => {
                                                appLog('invoice print success', status)
                                                saveTempLocalOrder('', {print: Boolean(status)}).then((msg:any) => {
                                                    appLog('msg',msg)
                                                    dispatch(hideLoader())
                                                })

                                            });
                                        });


                                    }
                                    }

                                    more={{backgroundColor: styles.accent.color, color: 'white'}}
                            >Print Bill {`${printcounter ? '(' + printcounter + ')' : ''}`}</Button>
                        </View>}
                    </>}
                    {/*<View style={[styles.w_auto, styles.ml_1, styles.mr_1]}>
                        <Button> Drawer </Button>
                    </View>*/}

                    {(!hasRestaurant) && <>
                        {<View style={[styles.w_auto, styles.ml_1]}>
                            <Button
                                secondbutton={Boolean(vouchertotaldisplay)}
                                onPress={async () => {
                                    await dispatch(setBottomSheet({
                                        visible: true,
                                        height: '50%',
                                        component: () => <HoldOrders/>
                                    }))
                                }}
                                more={{backgroundColor: styles.yellow.color, color: 'black'}}
                            > Recall </Button>
                        </View>}
                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}
                                    secondbutton={!Boolean(vouchertotaldisplay)}
                                    onPress={() => {
                                        dispatch(showLoader());
                                        saveTempLocalOrder().then((msg:any) => {
                                            appLog('msg',msg)
                                            dispatch(resetCart())
                                            dispatch(hideLoader());
                                            if (!device.tablet) {
                                                navigation.goBack()
                                            }
                                        })
                                    }
                                    }
                                    more={{backgroundColor: styles.yellow.color, color: 'black'}}
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
                                        appLog('msg',msg)
                                        dispatch(hideLoader())
                                        navigation.navigate('Payment');
                                    })
                                }
                            }}

                            more={{backgroundColor: styles.green.color, color: 'white'}}
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

