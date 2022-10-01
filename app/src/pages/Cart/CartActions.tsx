import React, { memo } from "react";
import {
    appLog,
    clone,
    deleteTempLocalOrder,
    errorAlert,
    findObject,
    getTicketStatus,
    isEmpty,
    isRestaurant,
    retrieveData,
    saveLocalOrder,
    saveTempLocalOrder,
    storeData
} from "../../libs/function";
import {View} from "react-native";
import {withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart, updateCartField, updateCartItems, updateCartKots} from "../../redux-store/reducer/cart-data";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import moment from "moment";
import {device, localredux, TICKET_STATUS} from "../../libs/static";
import CancelReason from "./CancelReason";


const Index = ({
                   cartData,
                   tableorders,
                   vouchertotaldisplay,
                   theme: {colors}
               }: any) => {

    const navigation = useNavigation()
    const hasRestaurant = isRestaurant()
    const dispatch = useDispatch()

    const {currentLocation: {departments, currentTicketType}} = localredux.localSettingsData;
    const {adminid, username}: any = localredux.loginuserData;

    const generateKOT = async () => {

        let kotid: any = '';
        retrieveData('fusion-pro-pos-mobile-kotno').then(async (kotno: any) => {
            kotid = kotno;
            if (isEmpty(departments)) {
                errorAlert(`No Kitchen Department`);
            } else {

                let {
                    invoiceitems,
                    tableorderid,
                    tableid,
                    tablename,
                    ordertype,
                    kots,
                    commonkotnote,
                } = cartData;


                let itemForKot: any = [], newkot = {};
                let printkot: any = [];
                if (ordertype !== "tableorder") {
                    tablename = ordertype
                    if (tableorderid) {
                        tablename += ` #${tableorderid}`
                    }
                }


                if (invoiceitems) {


                    itemForKot = invoiceitems.filter((itemL1: any) => {
                        return Boolean(itemL1.isDepartmentSelected) && !Boolean(itemL1?.kotid)
                    });

                    if (itemForKot.length > 0) {

                        let kitchens: any = [];


                        itemForKot.forEach((item: any) => {

                            const kitchenid = item?.itemdetail.itemdepartmentid;

                            let find = kitchens.find((k: any) => k === kitchenid);
                            if (!Boolean(find)) {
                                kitchens = [
                                    ...kitchens,
                                    kitchenid
                                ]
                            }
                        });


                        const openTicketStatus = getTicketStatus(TICKET_STATUS.OPEN);

                        kitchens.forEach((k: any) => {
                            kotid++;
                            storeData('fusion-pro-pos-mobile-kotno', kotid).then(() => {
                            });
                            let kotitems: any = [];

                            itemForKot.forEach((itemL1: any, index: any) => {

                                if (itemL1?.itemdetail?.itemdepartmentid === k) {

                                    if (!Boolean(itemL1?.kotid)) {
                                        itemL1 = {
                                            ...itemL1,
                                            kotid: kotid,
                                            can_not_change: true
                                        }
                                    }


                                    let {
                                        product_qnt,
                                        item_total_amount,
                                        item_total_amount_display,
                                        instruction,
                                        ref_id
                                    } = itemL1;

                                    let {
                                        groupname,
                                        itemunit,
                                        itemid,
                                        itemname,
                                        predefinenotes,
                                        extranote
                                    } = itemL1.itemdetail;

                                    if (predefinenotes) {
                                        predefinenotes = predefinenotes.join(", ");
                                    }
                                    if (extranote) {
                                        if (Boolean(predefinenotes)) {
                                            predefinenotes += ", " + extranote;
                                        } else {
                                            predefinenotes = extranote;
                                        }
                                    }
                                    const kot = {
                                        "productid": itemid,
                                        "productrate": item_total_amount,
                                        "productratedisplay": item_total_amount_display,
                                        "productqnt": product_qnt,
                                        "productqntunitid": itemunit,
                                        "related": 0,
                                        "item_ref_id": "",
                                        "staffid": adminid,
                                        "productdisplayname": itemname,
                                        "itemgroupname": groupname,
                                        "instruction": instruction,
                                        ref_id,
                                        key: itemL1.key,
                                    };

                                    kotitems = [...kotitems, clone(kot)];

                                    itemForKot[index] = itemL1;
                                }

                            });

                            const department = findObject(departments, 'departmentid', k, true)

                            newkot = {

                                tickettypeid: currentTicketType?.tickettypeid,
                                ticketnumberprefix: currentTicketType?.ticketnumberprefix,
                                ticketstatus: openTicketStatus?.statusid,
                                ticketstatusname: openTicketStatus?.ticketstatusname,
                                ticketitems: kotitems,
                                ticketdate: moment().format("YYYY-MM-DD"),
                                tickettime: moment().format("hh:mm A"),
                                datetime: moment().unix(),
                                kotid,
                                tableid,
                                counter: 1,
                                commonkotnote: commonkotnote,
                                status: "pending",
                                table: tablename,
                                departmentid: k,
                                departmentname: department?.name,
                                staffid: adminid,
                                staffname: username,
                                ordertype: ordertype,
                            };

                            kots = [...kots, newkot];

                            printkot.push(newkot);

                        });


                        const updateditems = invoiceitems.map((item: any) => {
                            const find = findObject(itemForKot, 'key', item.key, true);
                            if (Boolean(find)) {
                                item = {
                                    ...item,
                                    kotid: find.kotid,
                                }
                            }
                            return item
                        })

                        await dispatch(updateCartKots(kots))
                        await dispatch(updateCartItems(updateditems))

                        saveTempLocalOrder().then()

                    }
                }
            }
        });


    }

    const cancelOrder = async () => {
        const {kots, tableorderid, invoiceitems}: any = cartData
        if (kots.length === 0 || (kots.length > 0 && invoiceitems.length === 0)) {
            dispatch(resetCart())
            navigation.replace('DrawerStackNavigator');
            if (tableorderid) {
                deleteTempLocalOrder(tableorderid).then(() => {
                })
            }
        } else {
            dispatch(setDialog({
                visible: true,
                hidecancel: true,
                component: () => <CancelReason type={'ordercancelreason'} confirmCancelOrder={confirmCancelOrder}/>
            }))
        }
    }


    const confirmCancelOrder = async ({cancelreason, cancelreasonid}: any) => {
        await dispatch(updateCartField({
            cancelreason: cancelreason,
            cancelreasonid: cancelreasonid,
        }))
        await saveLocalOrder().then(async () => {
            navigation.replace('DrawerStackNavigator');
        })
    }

    return <View style={[styles.p_4,styles.bg_white]}>

        {<View>
            <View>
                <View style={[styles.grid, styles.justifyContent, styles.noWrap]}>

                    <View style={[styles.w_auto]}>
                        <Button
                                secondbutton={!Boolean(vouchertotaldisplay)}
                                onPress={() => cancelOrder()}
                                more={{backgroundColor: styles.red.color, color: 'white'}}
                        > Cancel </Button>
                    </View>

                    {hasRestaurant && <>
                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    onPress={() => generateKOT()}
                                    more={{backgroundColor: styles.yellow.color, }}
                            > KOT </Button>
                        </View>
                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    more={{backgroundColor: styles.yellow.color,  }}
                            > Print </Button>
                        </View>
                    </>}
                    {/*<View style={[styles.w_auto, styles.ml_1, styles.mr_1]}>
                        <Button> Drawer </Button>
                    </View>*/}
                    {hasRestaurant && <View style={[styles.w_auto, styles.ml_1]}>
                        <Button  disable={!Boolean(vouchertotaldisplay)}
                                onPress={() => {

                                   Boolean(vouchertotaldisplay) &&  saveTempLocalOrder().then(() => {
                                        navigation.replace('DrawerStackNavigator');
                                    })}
                            }
                         more={{backgroundColor: styles.yellow.color,  }}
                        > Save </Button>
                    </View>}
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
                                    onPress={() => Boolean(vouchertotaldisplay) &&  saveTempLocalOrder().then(() => {
                                        dispatch(resetCart())
                                        if (!device.tablet) {
                                            navigation.goBack()
                                        }
                                    })}
                                    more={{backgroundColor: styles.yellow.color,  }}
                            > On Hold </Button>
                        </View></>}



                    <View style={[styles.w_auto, styles.ml_1]}>
                        <Button
                            disable={!Boolean(vouchertotaldisplay)}
                            secondbutton={!Boolean(vouchertotaldisplay)}
                            onPress={() => Boolean(vouchertotaldisplay) && saveTempLocalOrder().then(() => {
                                navigation.navigate('Payment');
                            })}

                            more={{backgroundColor: styles.green.color, color: 'white'}}
                        > Bill
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
        cartData: state.cartData,
        tableorders: state.tableOrdersData || {},
    }
}

export default connect(mapStateToProps)(withTheme(memo(Index)));
