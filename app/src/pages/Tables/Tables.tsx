import {current, localredux, METHOD, urls, VOUCHER} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {
    clone,
    dateFormat,
    deleteTempLocalOrder,
    errorAlert,
    getTempOrders,
    groupBy,
    isEmpty,
    isRestaurant, prelog,
    saveTempLocalOrder,
    toCurrency,
    voucherData
} from "../../libs/function";
import {Dimensions, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Caption, Card, FAB, List, Menu, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {hideLoader, setAlert, setBottomSheet, setDialog, showLoader} from "../../redux-store/reducer/component";
import ClientAndSource from "../Cart/ClientAndSource";
import moment from "moment";
import {setSelected} from "../../redux-store/reducer/selected-data";
import Button from "../../components/Button";
import ReserveList from "./ReserveList";
import {TabBar, TabView} from "react-native-tab-view";
import apiService from "../../libs/api-service";
//import crashlytics from "@react-native-firebase/crashlytics";
import Splittable from "./Splittable";
import TableMenu from "./TableMenu";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {deleteOrder, setTableOrders} from "../../redux-store/reducer/table-orders-data";
import InvoicesList from "../Cart/InvoicesList";
import OnlineorderList from "../Cart/OnlineorderList";

let interval: any = ''


const TableCheckbox = ({item, updateTableInfo}: any) => {

    const [selected, setSelected] = useState(item.selected);

    return (<View style={[styles.absolute, {width: 30, bottom: 5, right: 5}]}>
        {<TouchableOpacity onPress={() => {
            item.selected = !selected
            setSelected(!selected);
            updateTableInfo(item, item.tableorderid)
        }}>
            {Boolean(selected) ? <ProIcon name={'circle-check'} color={styles.green.color}></ProIcon> :
                <ProIcon name={'circle'}></ProIcon>}
        </TouchableOpacity>}
    </View>)
}

const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
const other = moment().add(2, 'days').format('YYYY-MM-DD');

const datePeriod = [{label: 'Today', from: today, to: today}, {label: 'Tomorrow', from: tomorrow, to: tomorrow}];


export const getOriginalTablesData = () => {
    const {currentLocation} = localredux.localSettingsData;
    let tables;
    tables = currentLocation?.tables?.map((t: any) => ({
        ...t, ordertype: 'tableorder'
    }))
    return tables
}


export const getOrderFromTable = (tables: any) => {

    return new Promise(async (resolve) => {
        let newtables = getOriginalTablesData();

        let newothertables: any = [];

        await getTempOrders().then(async (tableorders: any) => {


            Object.values(tableorders).map((table: any) => {


                let findTableIndex = tables?.findIndex((t: any) => t.tableid == table.tableid);

                if (findTableIndex !== -1 && table.ordertype === 'tableorder') {

                    newtables[findTableIndex] = {
                        ...newtables[findTableIndex],
                        orders: {
                            ...newtables[findTableIndex]?.orders,
                            [table.tableorderid]: {...table, orders: ''}
                        },
                        lasttableorderid: table?.tableorderid,
                    }

                    const orderids = Object.keys(newtables[findTableIndex]?.orders);

                    if (orderids?.length > 1) {
                        let splittotal = 0;
                        let paxtotal = 0;
                        Object.values(newtables[findTableIndex]?.orders).map((item: any) => {
                            splittotal += +item.vouchertotaldisplay;
                            paxtotal += +item.pax || 1;
                        })

                        newtables[findTableIndex] = {
                            ...newtables[findTableIndex], split: true, paxtotal: paxtotal, splittotal: splittotal
                        }
                    }

                } else {
                    newothertables.push(table)
                }

            });
            newtables = newtables.concat(newothertables);

            resolve(newtables);

        })
    })


}


const Index = ({tableorders}: any) => {


    const navigation = useNavigation()

    const {currentLocation} = localredux.localSettingsData;
    const locationname = localredux.licenseData.data.locationname;

    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    const [floating, setFloating] = useState(false);
    const [shifttable, setShifttable] = useState(false);
    const [splittable, setSplittable] = useState(false);
    const [shiftingFromtable, setShiftingFromtable] = useState<any>();
    const [shiftingFromtableid, setShiftingFromtableid] = useState<any>();
    const [shiftingTotable, setShiftingTotable] = useState<any>();


    const [tables, setTables] = useState((isEmpty(currentLocation?.tables) ? [] : getOriginalTablesData()) || []);

    let areas:any = []
    if(!isEmpty(tables)) {
        Object.keys(groupBy(tables?.filter((table: any) => {
            return Boolean(table.area) && table.ordertype === 'tableorder'
        }), 'area'))
        areas.push('All');
    }


    const [floor, setFloor] = useState(areas[0]);

    const isFocused = useIsFocused();

    const {settings, role, adminid}: any = localredux.loginuserData
    const accessMultipleDevice = settings?.cant_access_order_multiple_device;


    useEffect(() => {
        if (isFocused) {
            if (!interval) {
                interval = setInterval(() => {
                    getOrder().then(() => {
                    })
                }, 15000);
            }
            getOrder().then(() => {});
            return () => {
                clearInterval(interval);
                interval = null;
            };
        }
    }, [tableorders, currentLocation?.tables, isFocused, refreshing])

    const resetTables = () => {
        shiftStart(false);
        getOrder().then(() => {

        })
    }

    const shiftStart = (value: any) => {
        dispatch(setSelected({label: 'Tables', value: 'tableorder', field: 'ordertype'}))
        setShifttable(value)
        setShiftingFromtable('');
        setShiftingTotable('');
    }


    const [visible, setVisible] = React.useState(false);
    const [index, setIndex]: any = useState(0)
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const onClickReserveTable = () => {
        closeMenu();
        dispatch(setBottomSheet({
            visible: true, height: '50%', component: () => <ReserveList navigation={navigation}/>
        }))
    }


    const onClickAddTable = () => {
        navigation.navigate('AddTable', {getOrder: getOrder})
        closeMenu();
    }


    const getOrder = async () => {
        await getOrderFromTable(tables).then((newtables) => {
            setTables(newtables);
            setRefreshing(false);
        })
    }


    const setOrderSetting = (title: any, ordertype: any) => {

        current.table = {
            'tablename': ordertype.label, area: ordertype.label, ordertype: ordertype.value, invoiceitems: [], kots: []
        };


        const placeOrder = async (config: any) => {

            //await dispatch(resetCart())
            let tabledetail = {...current.table, ...config}

            if (Boolean(tabledetail.reservetable)) {
                const finditems = currentLocation?.tables.find((t: any) => {
                    return t.tableid == tabledetail.reservetable.tableid
                })

                tabledetail = {
                    ...tabledetail, ...tabledetail.reservetable, tablename: finditems.tablename
                }
            }

            await dispatch(refreshCartData(tabledetail))

            if (tabledetail.ordertype === 'tableorder') {
                saveTempLocalOrder().then(() => {
                    dispatch(setAlert({visible: true, message: 'Table Reserve Successfully'}))
                })
            } else {
                navigation.navigate('CartStackNavigator', tabledetail);
            }

        }

        if (ordertype.value === 'qsr') {
            placeOrder(current.table).then()
        } else {
            navigation.navigate('ClientAndSource', {
                title: title, tabledetails: current.table, 'placeOrder': placeOrder
            });
        }

    }

    const setTableOrderDetail = async (tabledetails: any) => {
        //crashlytics().log('setTableOrderDetail');
        const sameStaff = ((Boolean(tabledetails?.staffid) && (tabledetails?.staffid === adminid)) || (!Boolean(tabledetails?.staffid)))

        tabledetails = {
            ...tabledetails, pax:+tabledetails?.paxes
        }

        if ((accessMultipleDevice && sameStaff) || !accessMultipleDevice) {


            if ((Boolean(urls.localserver) && Boolean(tabledetails?.tableorderid))) {

                await apiService({
                    method: METHOD.GET,
                    action: 'tableorder',
                    queryString: {key: 'tableid', value: tabledetails?.tableid},
                    other: {url: urls.localserver},
                }).then((response: any) => {

                    const {kots, numOfKOt}: any = tabledetails;


                    if (kots?.length > 0 || numOfKOt > 0) {
                        let {staffid, staffname, ...others}: any = response.data;
                        tabledetails = {
                            ...tabledetails, ...others,currentpax:'all'
                        }
                    } else {
                        tabledetails = {
                            ...tabledetails, ...response.data,currentpax:'all'
                        }
                    }

                    tabledetails.invoiceitems.map((item:any,index:any)=>{
                        item = {
                            ...item,...item.itemdetail
                        }
                        tabledetails.invoiceitems[index] = item
                    })
                })
            }

            navigation.navigate('CartStackNavigator', tabledetails);
            dispatch(setDialog({visible: false}));


        } else {
            errorAlert(`Table only access by ${tabledetails?.staffname}`)
        }
    }


    const updateTableInfo = (item: any, tableorderid: any) => {
        tableorders[tableorderid] = item;
    }

    const mergeTables = async () => {
        let mergeitems: any = [];
        let mergekots: any = []
        let selectedorders: any = []
        let totalpax = 0;
        let orderbyp = false;
        Object.keys(tableorders).map((key: any) => {
            const {selected, invoiceitems, kots, pax, orderbypax} = tableorders[key];
            if (Boolean(selected)) {
                selectedorders.push(key);
                totalpax += +pax || 0;
                invoiceitems?.map((item: any) => {
                    mergeitems.push(item)
                })
                kots.map((item: any) => {
                    mergekots.push(item)
                })
            }
            if (orderbypax) {
                orderbyp = orderbypax
            }
        })


        const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);

        const mergeOrder = {
            ...tableorders[selectedorders[0]],
            invoiceitems: mergeitems,
            kots: mergekots, ...voucherDataJson,
            tableorderid: '',
            selected: false,
            pax: totalpax,
            orderbypax: orderbyp
        }

        const cartData = await itemTotalCalculation({
            ...mergeOrder,
        }, undefined, undefined, undefined, undefined, 2, 2, false, false);


        saveTempLocalOrder(cartData).then((order: any) => {
            for (const tableorderid of selectedorders) {
                deleteTempLocalOrder(tableorderid).then(() => {
                    dispatch(deleteOrder(tableorderid))
                })
            }
            dispatch(setTableOrders(order))
            dispatch(setDialog({visible: false}))
        })

    }


    const getSplitTables = async (orders: any) => {

        let Component = () => {
            return (<View>
                <View style={[styles.grid]}>
                    {Object.values(orders).map((item: any, index: any) => {
                        return <Item shifttable={shifttable}
                                     shiftingFromtable={shiftingFromtable}
                                     setShiftingFromtable={setShiftingFromtable}
                                     shiftingTotable={shiftingTotable}
                                     setShiftingTotable={setShiftingTotable}
                                     splittable={splittable}
                                     getOrder={getOrder}
                                     resetTables={resetTables} item={item}
                                     key={index}
                                     updateTableInfo={updateTableInfo}
                                     splitdetailtables={true}
                        />
                    })}
                </View>


                <View style={[styles.mt_5, styles.grid, styles.justifyContent]}>
                    <Button more={{color: 'black', backgroundColor: '#eee'}}
                            onPress={() => {
                                dispatch(setDialog({visible: false}))
                            }}> Close
                    </Button>

                    <Button more={{color: 'black', backgroundColor: '#eee'}}
                            onPress={() => {
                                mergeTables()
                            }}> Merge Selected
                    </Button>

                </View>

            </View>)
        }


        dispatch(setDialog({
            visible: true, title: "Split Table", hidecancel: true, component: () => <Component/>
        }))
    }


    const splitTable = (tabledetails: any) => {
        dispatch(setDialog({
            visible: true, title: `Split ${tabledetails.tablename}`, hidecancel: true, component: () => <Splittable/>
        }))
    }

    useEffect(()=>{
        navigation.setOptions({
            headerTitle: currentLocation?.locationname || locationname,
            headerLeft: () => <Appbar.Action icon="menu" onPress={() => navigation.navigate('ProfileSettingsNavigator')}/>,
            headerRight: () => {
                return <>

                    <View style={[styles.grid, styles.justifyContent, styles.middle]}>

                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                                openMenu()
                            }}/>}>

                            {/*<Menu.Item onPress={onClickAddTable} title="Add Table"/>*/}

                            {/*{!shifttable && <Menu.Item onPress={() => {
                            closeMenu()
                            setShifttable(true)
                        }} title="Shift Table"/>}

                        {shifttable && <Menu.Item onPress={() => {
                            closeMenu()
                            setShifttable(false)
                        }} title="Disable Shift"/>}*/}

                            {/*{!splittable && <Menu.Item onPress={() => {
                             closeMenu()
                             setSplittable(true)
                         }} title="Split Table"/>}


                         {splittable && <Menu.Item onPress={() => {
                             closeMenu()
                             setSplittable(false)
                         }} title="Disable Split"/>}*/}

                            {!Boolean(urls.localserver) &&
                                <Menu.Item onPress={onClickReserveTable} title="Reserved Tables"/>}

                            {/*{isRestaurant() && <Menu.Item onPress={async () => {
                            closeMenu();
                            navigation?.navigate('SwitchItems')
                        }} title="Switch Items"/>}*/}

                            <Menu.Item onPress={async () => {
                                closeMenu()
                                await dispatch(setBottomSheet({
                                    visible: true,
                                    height: '90%',
                                    component: () => <OnlineorderList/>
                                }))
                            }} title="Online Orders"/>

                           {/* <Menu.Item onPress={async () => {
                                closeMenu()
                                await dispatch(setBottomSheet({
                                    visible: true,
                                    height: '90%',
                                    component: () => <InvoicesList/>
                                }))
                            }} title="Invoices"/>





                            <Menu.Item onPress={() => {
                                getOrder().then();
                                closeMenu()
                            }} title="Refresh"/>*/}


                            {/*{!isRestaurant() && <Menu.Item onPress={async () => {
                        await dispatch(setBottomSheet({
                            visible: true,
                            height: '50%',
                            component: () => <HoldOrders/>
                        }))
                    }} title="Holding Orders"/>}*/}
                        </Menu>


                        {/*<Appbar.Action icon={'refresh'} onPress={() => {
                        getOrder().then()
                    }}/>*/}

                    </View>

                </>
            }
        })
    },[visible])

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return (dim.height >= dim.width) ? 'portrait' : 'landscape';
    };

    const [oriantation, setOrientation] = useState(isPortrait())

    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            setOrientation(isPortrait())
        });
    }, [])

    const Floors = () => {
        return <View style={[styles.w_100]}>
            <View>
                <Caption style={[styles.caption, styles.px_6]}>Areas</Caption>
            </View>
            {areas.map((area: any, index: any) => {
                return (<List.Item
                    style={[styles.listitem]}
                    title={area}
                    onPress={() => {
                        setFloor(area);
                        dispatch(setBottomSheet({visible: false}))
                    }}
                    key={index}
                    left={() => <List.Icon icon="layers"/>}
                    right={() => <List.Icon icon="chevron-right"/>}
                />)
            })}
        </View>
    }


    const Item = memo((props: any) => {

        let {
            item, shifttable, splittable, resetTables, key, setShiftingFromtable, shiftingFromtable, splitdetailtables
        } = props;

        item = Boolean(item?.orders) ? {...item?.orders[item.lasttableorderid], ...item} : item

        const shiftFrom = (tableorderid: any, tableid: any) => {
            //crashlytics().log('shiftFrom');
            setShifttable(true);
            setShiftingFromtable(tableorderid);
            setShiftingFromtableid(tableid)
            dispatch(setDialog({visible: false}))
        }
        const shiftTo = async (tabledetail: any) => {
            dispatch(showLoader())
            //crashlytics().log('shiftTo');
            const {tableid, tablename, area}: any = tabledetail.item;

            let clone_tableorders = clone(tableorders)


            if (Boolean(urls.localserver)) {

                await apiService({
                    method: METHOD.GET,
                    action: 'tableorder',
                    queryString: {key: 'tableid', value: shiftingFromtableid},
                    other: {url: urls.localserver},
                }).then(async (response: any) => {

                    response.data = clone({
                        ...response.data, tableid: tableid, tablename: tablename, area: area
                    });

                    await saveTempLocalOrder(response.data).then(async () => {
                        await resetTables()
                        await dispatch(hideLoader())
                    })

                })


            } else {
                clone_tableorders[shiftingFromtable] = clone({
                    ...clone_tableorders[shiftingFromtable], tableid: tableid, tablename: tablename, area: area
                })
                await saveTempLocalOrder(clone_tableorders[shiftingFromtable]).then(async () => {
                    await resetTables()
                    await dispatch(hideLoader())
                })
            }


        }


        let shiftstart = Boolean((shifttable && Boolean(item.tableorderid) && (item.ordertype === 'tableorder'))) && !Boolean(shiftingFromtable);
        let shifting = Boolean((shifttable && !Boolean(item.tableorderid))) && Boolean(shiftingFromtable);

        const sameStaff = ((Boolean(item?.staffid) && (item?.staffid === adminid)) || (!Boolean(item?.staffid)))

        return (<Card style={[styles.card, styles.m_1, styles.mb_2, shifting && styles.shifting, {
            marginTop: 0,

            backgroundColor: item.split ? styles.vegan.color : splittable ? styles.secondary.color : Boolean(item?.printcounter) ? styles.yellow.color : Boolean(item.clientname) ? styles.secondary.color :  styles.light.color,
            borderRadius: 5,
        }, styles.flexGrow,]} key={item.tableid}>
            {<TouchableOpacity
                style={{minHeight: 120}}
                onPress={() => {
                    current.table = {invoiceitems: [], kots: [], ...item};
                    item.split ? getSplitTables(current.table.orders) : splittable ? splitTable(current.table) : !shifttable ? setTableOrderDetail(current.table) : Boolean(shifting) ? shiftTo(props) : shiftFrom(item.tableorderid, item.tableid)
                }}>
                {((shiftstart || shifting) || !shifttable) && <View style={[styles.p_4]}>
                    <View style={[styles.grid, styles.mb_3]}>
                        <View
                            style={[styles.badge, styles.px_5, {backgroundColor: 'black'}]}>
                            <Text
                                style={[styles.paragraph, styles.text_xs, {color: 'white'}]}>{`${item.tablename} ${item?.split ? '- split' : (splitdetailtables && !item.splitnumber) ? ' - 1' : ''}` || 'Retail'} </Text></View></View>
                    {Boolean(item.vouchertotaldisplay) && <>
                        <Paragraph><ProIcon align={'left'} name={'user'} action_type={'text'}
                                            size={13}/>{` ${item?.paxtotal || item?.pax || 1} ${!Boolean(item.paxtotal) ? `x ${item.clientname}` : ''}`}
                        </Paragraph>


                        {Boolean(item?.advanceorder?.date) && <>
                            <Paragraph style={[styles.paragraph, styles.text_xs]}>Delivery on </Paragraph>
                            <Paragraph
                                style={[styles.paragraph]}>{moment(item?.advanceorder.date).format(dateFormat())} {moment(item?.advanceorder.time).format('HH:mm')} </Paragraph>
                        </>}


                        {((accessMultipleDevice && sameStaff) || !accessMultipleDevice) && <View style={[styles.mt_3]}>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, styles.text_lg, {color: 'black'}]}>{toCurrency(item?.splittotal || item.vouchertotaldisplay)}</Paragraph>
                        </View>}

                    </>}

                    {Boolean(item?.printcounter) &&
                        <View style={[styles.absolute, {right: 10, top: 12}]}><Text><ProIcon size={15}
                                                                                             name={'print'}
                                                                                             type={'solid'}
                                                                                             action_type={'text'}/></Text></View>}


                    {Boolean(item?.staffname) &&
                        <Paragraph style={[styles.paragraph, styles.text_xs]}>{item.staffname}</Paragraph>}


                    {splitdetailtables && !Boolean(item?.printcounter) && !Boolean(item?.voucherdiscountdisplay) &&
                        <TableCheckbox item={item} updateTableInfo={updateTableInfo}/>}

                </View>}

                {(item.ordertype === 'tableorder' && ((item?.vouchertotaldisplay || item.split)) && !splitdetailtables) && !Boolean(item.printcounter) && // !Boolean(item.vouchertotaldisplay) &&
                    <TableMenu
                        data={{
                            "area": item.area,
                            "ordertype": item.ordertype,
                            "pax": 1,
                            "qrcodeid": item.qrcodeid,
                            "tableid": item.tableid,
                            "tablename": item.tablename,
                            invoiceitems: [],
                            splitnumber: Boolean(item?.orders) ? Object.keys(item?.orders)?.length : 0,
                            kots: [],
                            tableorderid:'',
                            tableoderidforswitch:item.tableorderid
                        }}
                        setTableOrderDetail={setTableOrderDetail}
                        shiftFrom={shiftFrom}
                    />}


            </TouchableOpacity>}
        </Card>);
    }, (r1, r2) => {
        return r1.item === r2.item;
    });


    const renderItem = useCallback(({item, index}: any) => <Item shifttable={shifttable}
                                                                 shiftingFromtable={shiftingFromtable}
                                                                 setShiftingFromtable={setShiftingFromtable}
                                                                 shiftingTotable={shiftingTotable}
                                                                 setShiftingTotable={setShiftingTotable}
                                                                 getOrder={getOrder}
                                                                 resetTables={resetTables} item={item}
                                                                  />, [shifttable, shiftingFromtable, shiftingTotable]);


    const HomeDelivery = memo(() => (<View style={[styles.flex]}>
        <TableFlatlist type={'homedelivery'}/>
    </View>));

    const TakeAway = memo(() => (<View style={[styles.flex]}>
        <TableFlatlist type={'takeaway'}/>
    </View>));

    const AdvanceOrder = memo(() => (<View style={[styles.flex]}>
        <TableFlatlist type={'advanceorder'}/>
    </View>));

    const EmptyCompoennt = ({type}: any) => {
        return (<View>
            <View style={[styles.p_6]}>

            </View>
            <View style={[]}>
                <View style={[styles.grid, styles.center]}>
                    <Button
                        more={{color: 'white'}}
                        secondbutton={true}
                        onPress={async () => {
                            if (type === 'qsr') {
                                setOrderSetting("+ QSR / Quick Bill", {
                                    'label': '+ QSR / Quick Bill', value: 'qsr'
                                })
                            } else if (type === 'takeaway') {
                                setOrderSetting("Takeaway", {'label': 'Takeaway', value: 'takeaway'})
                            } else if (type === 'advanceorder') {
                                setOrderSetting("Advanced Order", {
                                    'label': 'Advance Order', value: 'advanceorder'
                                })
                            } else if (type === 'homedelivery') {
                                setOrderSetting("Home Delivery", {
                                    'label': 'Home Delivery', value: 'homedelivery'
                                })
                            } else if (type === 'tableorder') {
                                setOrderSetting("Table Reservation", {
                                    'label': 'Table Reservation', value: 'tableorder'
                                })
                            }
                        }}> + Take New Order
                    </Button>
                </View>
            </View>
        </View>)
    }

    const AllTable = memo(() => (<View style={[styles.flex]}>
        <ScrollView>
            <TableSectionlist type={'all'} area={'All'}/>
        </ScrollView>
    </View>));

    const OnlyTable = memo(() => (<View style={[styles.flex]}>
        <ScrollView>
            <TableSectionlist type={'tableorder'} area={floor}/>
        </ScrollView>
        {areas.length > 1 && <View style={[styles.mt_auto]}>

            <TouchableOpacity onPress={() => {
                dispatch(setBottomSheet({
                    visible: true, height: '80%', component: () => <Floors/>
                }))
            }} style={[styles.p_3, styles.mb_3, styles.grid, styles.center, styles.middle]}>

                <View style={[styles.grid, styles.center, styles.mb_3]}>
                    <View
                        style={[styles.badge, styles.px_5, styles.py_5, styles.grid, styles.noWrap, styles.middle, {
                            backgroundColor: '#000', borderRadius: 30, paddingLeft: 20, paddingRight: 20
                        }]}>
                        <Paragraph><ProIcon name={'layer-group'} type={"solid"} color={'white'} size={18}
                                            action_type={'text'}/> </Paragraph>
                        <Paragraph style={[styles.paragraph, styles.bold, {color: 'white'}]}> {floor}</Paragraph>
                    </View>
                </View>

            </TouchableOpacity>

        </View>}

    </View>));


    const TableSectionlist = memo(({type, area}: any) => {

        let floors:any = {}
        if(!isEmpty(tables)) {
             floors = groupBy(tables?.filter((table: any) => {
                if (type === 'tableorder') {
                    return table.ordertype === type
                }
                return true
            }), 'area');
        }


        let data: any = []
        if(!isEmpty(floors)) {
            Object.keys(floors).map((key: any) => {
                if (key === 'Advance Order') {
                    const todaysorder = floors[key].filter((data3: any) => {
                        return data3.advanceorder.date === today
                    })
                    todaysorder?.length && data.push({title: "Today's Advance Order", data: todaysorder})

                    const tomorrowsorder = floors[key].filter((data3: any) => {
                        return data3.advanceorder.date === tomorrow
                    })
                    tomorrowsorder?.length && data.push({title: "Tomorrow's Advance Order", data: tomorrowsorder})

                    const othersorder = floors[key].filter((data3: any) => {
                        return data3.advanceorder.date !== tomorrow && data3.advanceorder.date !== today
                    })
                    othersorder?.length && data.push({title: "After Tomorrow's Advance Order", data: othersorder})

                } else if (Boolean(key !== 'undefined')) {
                    data.push({title: key, data: floors[key]})
                }
            })
        }


        return (<View style={[styles.px_2, styles.flex, styles.h_100]}>

                {data.filter((floor: any) => {
                    if (area !== 'All') {
                        return floor.title === area
                    }
                    return true
                }).map((floor: any, key: any) => {
                    return <View key={key}>
                        {Boolean(data.length > 1) && (Boolean(floor?.title !== 'undefined') ?
                            <Paragraph style={[styles.bold]}> {floor?.title}</Paragraph> :
                            <View style={{height: 20}}></View>)}
                        <View style={[styles.grid]}>
                            {floor?.data?.map((item: any, index: any) => {
                                return <View key={'a'+index} style={[styles.flexGrow,{width: oriantation === 'portrait' ? '45%' : '24%'}]}>
                                        <Item shifttable={shifttable}
                                             shiftingFromtable={shiftingFromtable}
                                             setShiftingFromtable={setShiftingFromtable}
                                             shiftingTotable={shiftingTotable}
                                             setShiftingTotable={setShiftingTotable}
                                             splittable={splittable}
                                             getOrder={getOrder}
                                             resetTables={resetTables} item={item}
                                         />
                                </View>
                            })}
                        </View>
                    </View>
                })}

        </View>)
    })

    const TableFlatlist = memo(({type, area}: any) => {

        return (<View style={[styles.px_2]} key={oriantation}>
            <FlatList
                data={tables?.filter((table: any) => {
                    if (type === 'tableorder') {
                        return table.ordertype === type && table.area === area
                    }
                    return table.ordertype === type
                })}
                renderItem={renderItem}
                keyboardDismissMode={'on-drag'}
                keyboardShouldPersistTaps={'always'}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => getOrder()}
                />}
                numColumns={oriantation === 'landscape' ? 4 : 2}
                getItemLayout={(data, index) => {
                    return {length: 100, offset: 100 * index, index};
                }}
                ListFooterComponent={() => {
                    return <View style={{height: 80}}></View>
                }}

                ListEmptyComponent={<EmptyCompoennt type={type}/>}
            />
        </View>)
    })

    const renderScene = ({route, jumpTo}: any) => {

        switch (route.key) {
            case 'all':
                return <AllTable/>;
            case 'tableorder':
                return <OnlyTable/>;
            case 'homedelivery':
                return <HomeDelivery/>;
            case 'takeaway':
                return <TakeAway/>;
            case 'advanceorder':
                return <AdvanceOrder/>;
        }
    };

    const renderTabBar = (props: any) => (<TabBar
        {...props}
        style={[styles.noshadow, styles.mb_3, {backgroundColor: 'white',}]}
        labelStyle={[styles.bold, {color: 'black', textTransform: 'capitalize'}]}
        indicatorStyle={{backgroundColor: styles.accent.color}}
        scrollEnabled={true}
        tabStyle={{minWidth: 80, width: 'auto'}}
    />);

    let routes = [{key: 'all', title: 'All'}, {key: 'tableorder', title: 'Tables'}, {
        key: 'homedelivery', title: 'Homedelivery'
    }, {key: 'takeaway', title: 'Takeaway'}]

    let actions = [{
        icon: 'truck', label: 'Home Delivery', onPress: () => setOrderSetting("Home Delivery", {
            'label': 'Home Delivery', value: 'homedelivery'
        }),
    }, {
        icon: 'sack',
        label: 'Takeaway',
        onPress: () => setOrderSetting("Takeaway", {'label': 'Takeaway', value: 'takeaway'}),
    }, {
        icon: 'popcorn', label: '+ QSR / Quick Bill', onPress: () => setOrderSetting("+ QSR / Quick Bill", {
            'label': '+ QSR / Quick Bill', value: 'qsr'
        }),
    },

    ]

    if (!Boolean(urls.localserver)) {
        routes.push({key: 'advanceorder', title: 'Advance Order'});
        actions.push({
            icon: 'table', label: 'Table Reservation', onPress: () => setOrderSetting("Table Reservation", {
                'label': 'Table Reservation', value: 'tableorder'
            }),
        }, {
            icon: 'sack', label: 'Advance Order', onPress: () => setOrderSetting("Advanced Order", {
                'label': 'Advance Order', value: 'advanceorder'
            }),
        }, {
            icon: 'currency-inr', label: 'Expense', onPress: () => navigation.navigate("AddEditExpense")
        }, {
            icon: 'currency-inr',
            label: 'Payment Received',
            onPress: () => navigation.navigate("AddEditPaymentReceived")
        }, {
            icon: 'currency-inr', label: 'Sales Return', onPress: () => navigation.navigate("AddEditSalesReturn")
        })
    }


    return (<>

        <TabView
            navigationState={{index, routes}}
            onIndexChange={setIndex}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            style={styles.bg_white}
        />

        {shifttable &&  <View  style={[styles.center,{}]}>
            <TouchableOpacity  onPress={()=>setShifttable(false)}>
                <Paragraph style={[styles.center,styles.p_5,{textAlign:'center'}]}>Disable Shifting</Paragraph>
            </TouchableOpacity>
        </View>}



        <FAB.Group
            open={floating}
            fabStyle={{backgroundColor: 'black', marginBottom: 10}}
            backdropColor={'#00000070'}
            icon={'plus'}
            actions={actions}
            onStateChange={() => {
                setFloating(!floating)
            }}
            onPress={() => {
                if (floating) {
                    // do something if the speed dial is open
                }
            }}
        />
    </>);


}

const mapStateToProps = (state: any) => ({
    ordertype: state.selectedData.ordertype, tableorders: state.tableOrdersData
})

export default connect(mapStateToProps)(withTheme(Index));

