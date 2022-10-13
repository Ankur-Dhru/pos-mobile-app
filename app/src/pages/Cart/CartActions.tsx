import React, { memo } from "react";
import {
    appLog,
    clone,
    deleteTempLocalOrder,
    errorAlert,
    findObject,
    generateKOT,
    getTicketStatus,
    isEmpty,
    isRestaurant, printInvoice,
    retrieveData,
    saveTempLocalOrder,
    storeData
} from "../../libs/function";
import {View} from "react-native";
import {Card, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart,  updateCartItems, updateCartKots} from "../../redux-store/reducer/cart-data";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import moment from "moment";
import {device, localredux, TICKET_STATUS} from "../../libs/static";
import CancelReason from "./CancelReason";

import {hideLoader,  showLoader} from "../../redux-store/reducer/component";

const Index = ({
                   cartData,
                   tableorders,
                   vouchertotaldisplay,
                   theme: {colors}
               }: any) => {

    const navigation = useNavigation()
    const hasRestaurant = isRestaurant()
    const dispatch = useDispatch()








    return <Card style={[styles.p_4]}>

        {<View>
            <View>
                <View style={[styles.grid, styles.justifyContent, styles.noWrap]}>



                    {/*<View style={[styles.w_auto]}>
                        <Button
                                secondbutton={!Boolean(vouchertotaldisplay)}
                                onPress={() => cancelOrder()}
                                more={{backgroundColor: styles.red.color, color: 'white'}}
                        > Cancel </Button>
                    </View>*/}

                    {hasRestaurant && <>

                        <View style={[styles.w_auto]}>
                            <Button  disable={!Boolean(vouchertotaldisplay)}
                                     onPress={() =>  {
                                         if(Boolean(vouchertotaldisplay)){
                                             dispatch(showLoader())
                                             saveTempLocalOrder().then(() => {

                                                 navigation.replace('DrawerStackNavigator');
                                                 dispatch(hideLoader())
                                             })
                                         }
                                     }}
                                     more={{backgroundColor: styles.green.color,  }}
                            >Save </Button>
                        </View>

                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    onPress={() => generateKOT()}
                                    more={{backgroundColor: styles.yellow.color, }}
                            >KOT </Button>
                        </View>
                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}
                                    onPress={() => {
                                        dispatch(showLoader())
                                        saveTempLocalOrder().then(() => {
                                            printInvoice().then();
                                            dispatch(hideLoader())
                                        })

                                    }}
                                    more={{backgroundColor: styles.accent.color,  }}
                            >Print </Button>
                        </View>
                    </>}
                    {/*<View style={[styles.w_auto, styles.ml_1, styles.mr_1]}>
                        <Button> Drawer </Button>
                    </View>*/}

                    {(!hasRestaurant) && <>
                        {Object.keys(tableorders).length > 0 && <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={Boolean(vouchertotaldisplay)}
                                    secondbutton={Boolean(vouchertotaldisplay)}
                                    onPress={async () => {
                                        await dispatch(setBottomSheet({
                                            visible: true,
                                            height: '50%',
                                            component: () => <HoldOrders/>
                                        }))
                                    }}
                                    more={{backgroundColor: styles.yellow.color,  }}
                            > Recall </Button>
                        </View>}
                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}
                                    secondbutton={!Boolean(vouchertotaldisplay)}
                                    onPress={() => {
                                        dispatch(showLoader());
                                        saveTempLocalOrder().then(() => {
                                            dispatch(resetCart())
                                            dispatch(hideLoader());
                                            if (!device.tablet) {
                                                navigation.goBack()
                                            }
                                        })}
                                    }
                                    more={{backgroundColor: styles.yellow.color,  }}
                            > On Hold </Button>
                        </View></>}



                    <View style={[styles.w_auto, styles.ml_1]}>
                        <Button
                            disable={!Boolean(vouchertotaldisplay)}
                            secondbutton={!Boolean(vouchertotaldisplay)}

                            onPress={() =>  {
                                if(Boolean(vouchertotaldisplay)){
                                    dispatch(showLoader())
                                    saveTempLocalOrder().then(() => {
                                        dispatch(hideLoader())
                                        navigation.navigate('Payment');
                                    })
                                }
                            }}

                            more={{backgroundColor: styles.green.color, color: 'white'}}
                        >Bill
                        </Button>
                    </View>
                </View>
            </View>

        </View>}

    </Card>
}

const mapStateToProps = (state: any) => {
    return {
        vouchertotaldisplay: state.cartData.vouchertotaldisplay,
        cartData: state.cartData,
        tableorders: state.tableOrdersData || {},
    }
}

export default connect(mapStateToProps)(withTheme(memo(Index)));
