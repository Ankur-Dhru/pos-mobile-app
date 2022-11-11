import React, { memo } from "react";
import {
    appLog,
    cancelOrder,
    clone,
    deleteTempLocalOrder,
    errorAlert,
    findObject,
    getTicketStatus,
    isEmpty,
    isRestaurant, printInvoice, printKOT,
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
import {device, localredux, TICKET_STATUS, TICKETS_TYPE} from "../../libs/static";
import CancelReason from "./CancelReason";

import {hideLoader,  showLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";

const Index = ({
                   tableorders,
                   vouchertotaldisplay,
                   theme: {colors}
               }: any) => {

    const navigation = useNavigation()
    const hasRestaurant = isRestaurant()
    const dispatch = useDispatch()








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

                                    onPress={() =>  generateKOT().then(()=>{
                                        saveTempLocalOrder().then(() => {
                                             dispatch(hideLoader())
                                         })
                                    })}
                                    more={{backgroundColor: styles.yellow.color,color:'black' }}
                            >KOT </Button>
                        </View>
                        <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    onPress={() =>
                                        generateKOT().then(()=>{
                                            saveTempLocalOrder().then(() => {
                                                printInvoice().then();
                                                 dispatch(hideLoader())
                                             })
                                    })}

                                    more={{backgroundColor: styles.accent.color,  }}
                            >Print </Button>
                        </View>
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
                                    more={{backgroundColor: styles.yellow.color,color:'black'  }}
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
                                    more={{backgroundColor: styles.yellow.color,color:'black'  }}
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

    </View>
}

const mapStateToProps = (state: any) => {
    return {
        vouchertotaldisplay: state.cartData.vouchertotaldisplay,
    }
}

export default connect(mapStateToProps)(withTheme(memo(Index)));






const generateKOT = async () => {

    let kotid: any = '';
    store.dispatch(showLoader())
    let cartData = store.getState().cartData;
    const {currentLocation: {departments}} = localredux.localSettingsData;

    const currentTicketType = localredux.initData?.tickets[TICKETS_TYPE.KOT];

    const {adminid, username}: any = localredux.loginuserData;
    const today: any = store.getState().localSettings?.today;

    try {
        await retrieveData('fusion-pro-pos-mobile-kotno').then(async (kotno: any) => {

            if(!Boolean(kotno)){
                kotno = 0;
            }
            if ((today !== moment().format('YYYY-MM-DD'))) {
                kotno = 0;
            }
            kotid = kotno;

            appLog('departments',departments)

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
                        return Boolean(itemL1?.itemdepartmentid) && !Boolean(itemL1?.kotid)
                    });

                    if (itemForKot?.length > 0) {

                        let kitchens: any = [];


                        itemForKot?.forEach((item: any) => {

                            const kitchenid = item?.itemdepartmentid;

                            let find = kitchens.find((k: any) => k === kitchenid);
                            if (!Boolean(find)) {
                                kitchens = [
                                    ...kitchens,
                                    kitchenid
                                ]
                            }
                        });

                        const openTicketStatus = getTicketStatus(TICKET_STATUS.DONE);

                        kitchens.forEach((k: any) => {
                            kotid++;

                            storeData('fusion-pro-pos-mobile-kotno', kotid).then(() => {
                            });
                            let kotitems: any = [];

                            itemForKot.forEach((itemL1: any, index: any) => {

                                if (itemL1?.itemdepartmentid === k) {

                                    if (!Boolean(itemL1?.kotid)) {
                                        itemL1 = {
                                            ...itemL1,
                                            kotid: kotid,
                                            can_not_change: true
                                        }
                                    }

                                    let {
                                        product_qnt,
                                        productratedisplay,
                                        notes,
                                        productqnt,
                                        ref_id,
                                        groupname,
                                        itemunit,
                                        itemid,
                                        itemname,
                                        itemaddon,
                                        itemtags
                                    } = itemL1;

                                    const kot = {
                                        "productid": itemid,
                                        "productrate": productratedisplay,
                                        "productratedisplay": productratedisplay,
                                        "productqnt": productqnt,
                                        "productqntunitid": itemunit,
                                        "related": 0,
                                        "item_ref_id": "",
                                        "staffid": adminid,
                                        "productdisplayname": itemname,
                                        "itemgroupname": groupname,
                                        "instruction": notes || '',
                                        itemaddon: itemaddon?.map((item: any) => {
                                            return `${item.productqnt} X ${item.itemname}`
                                        }),
                                        itemtags: itemtags?.map((itemtag: any) => {
                                            return itemtag?.taglist?.map((tag: any) => {
                                                if (tag.selected) {
                                                    return `${itemtag.taggroupname} : ${tag.name}`
                                                }
                                            })
                                        }).join(' '),
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
                                ticketstatusname: "Close",
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

                            appLog('newkot', newkot)


                            kots = [...kots, newkot];

                            printkot.push(newkot);

                            printKOT(newkot)


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

                        await store.dispatch(updateCartKots(kots))
                        await store.dispatch(updateCartItems(updateditems))

                        await store.dispatch(hideLoader())

                    }

                }
            }
        });
    } catch (e) {
        appLog('e', e)
    }

}
