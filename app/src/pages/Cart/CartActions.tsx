import React, {memo, useEffect} from "react";
import {
    appLog,
    clone,
    errorAlert,
    findObject,
    getTicketStatus,
    isEmpty,
    isRestaurant,
    printInvoice,
    printKOT,
    retrieveData, saveLocalSettings,
    saveTempLocalOrder,
    storeData
} from "../../libs/function";
import {View} from "react-native";
import {withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {resetCart, updateCartItems, updateCartKots} from "../../redux-store/reducer/cart-data";
import {hideLoader, setBottomSheet, showLoader} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import {device, localredux, TICKET_STATUS, TICKETS_TYPE} from "../../libs/static";
import store from "../../redux-store/store";
import moment from "moment/moment";
import {setSettings} from "../../redux-store/reducer/local-settings-data";


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
        if (printcounter  && !device.tablet) {
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
                                        saveTempLocalOrder().then(() => {
                                            dispatch(hideLoader())
                                        })
                                    })}
                                    more={{backgroundColor: styles.yellow.color, color: 'black'}}
                            >KOT </Button>
                        </View>
                        {ordertype !== 'qsr' && <View style={[styles.w_auto, styles.ml_1]}>
                            <Button disable={!Boolean(vouchertotaldisplay)}

                                    onPress={() => {
                                        generateKOT().then(() => {
                                            appLog('kot print success')
                                            saveTempLocalOrder('', {print: true}).then(() => {
                                                appLog('save success')
                                                printInvoice().then(()=>{
                                                    appLog('invoice print success')
                                                    dispatch(hideLoader())
                                                });
                                            })
                                        })
                                    }
                                }

                                    more={{backgroundColor: styles.accent.color,}}
                            >Print {`${printcounter ? '(' + printcounter + ')' : ''}`}</Button>
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
                                        saveTempLocalOrder().then(() => {
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
                                    saveTempLocalOrder().then(() => {
                                        dispatch(hideLoader())
                                        navigation.navigate('Payment');
                                    })
                                }
                            }}

                            more={{backgroundColor: styles.green.color, color: 'white'}}
                        >Payment
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


export const generateKOT = async () => {

    return new Promise(async (resolve,reject) => {

        let kotid: any = '';
        store.dispatch(showLoader())
        let cartData = store.getState().cartData;
        const {currentLocation: {departments}} = localredux.localSettingsData;

        const currentTicketType = localredux.initData?.tickets[TICKETS_TYPE.KOT];

        const {adminid, username}: any = localredux.loginuserData;

        const today: any = store.getState().localSettings?.today;

        try {
            await retrieveData('fusion-pro-pos-mobile-kotno').then(async (kotno: any) => {

                if (!Boolean(kotno)) {
                    kotno = 0;
                }
                if ((today !== moment().format('YYYY-MM-DD'))) {
                    kotno = 0;
                    await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
                        data.today=moment().format('YYYY-MM-DD');
                        saveLocalSettings("today", data.today).then();
                        await store.dispatch(setSettings(data));
                    })
                }
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

                            let length = kitchens.length;


                            const recursive = async (i: any) => {
                                kotid++;

                                let k = kitchens[i]

                                await storeData('fusion-pro-pos-mobile-kotno', kotid).then(() => {
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

                                        const kot: any = {
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
                                            predefinenotes: notes || '',
                                            ref_id,
                                            key: itemL1.key,
                                        };

                                        if (itemaddon) {
                                            kot.addons = itemaddon
                                                .map(({
                                                          productid,
                                                          productrate,
                                                          productratedisplay,
                                                          productqntunitid,

                                                          productdisplayname,
                                                          productqnt
                                                      }: any) => {

                                                    return {
                                                        productid,
                                                        productrate,
                                                        productdisplayname,
                                                        productratedisplay,
                                                        productqntunitid,
                                                        productqnt
                                                    }
                                                })
                                        }

                                        if (Boolean(itemtags)) {
                                            kot.predefinenotes = kot.predefinenotes + ' ' + itemtags?.map((itemtag: any) => {
                                                return itemtag?.taglist?.map((tag: any) => {
                                                    if (tag.selected) {
                                                        return `${itemtag.taggroupname} : ${tag.name}`
                                                    }
                                                })
                                            })?.join('  ')
                                        }

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
                                    print: 0,
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

                                await printKOT(newkot).then(async () => {

                                    if (i < length - 1) {
                                        recursive(++i)
                                    } else {
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
                                        await store.dispatch(hideLoader());
                                        resolve({})
                                    }
                                })
                            }

                            await recursive(0);

                        }
                        else{
                            resolve({})
                        }

                    }
                }
            });
        } catch (e) {

            appLog('e', e)
            reject('print reject')
        }



    })

}
