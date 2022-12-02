import {current, device, localredux} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {appLog, dateFormat, getTempOrders, isEmpty, saveTempLocalOrder, toCurrency} from "../../libs/function";
import {FlatList, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Card, FAB, Menu, Paragraph, Title, withTheme} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import {hideLoader, setAlert, setDialog, showLoader} from "../../redux-store/reducer/component";
import ClientAndSource from "../Cart/ClientAndSource";
import moment from "moment";
import {setSelected} from "../../redux-store/reducer/selected-data";
import Button from "../../components/Button";
import ReserveList from "./ReserveList";
import Tabs from "../../components/TabView";
import {Container} from "../../components";


const Index = (props: any) => {


    const navigation = useNavigation()

    const {currentLocation} = localredux.localSettingsData;

    const dispatch = useDispatch();
    const [refreshing, setRefreshing]: any = useState(false);
    const [floating, setFloating] = useState(false);
    const [shifttable, setShifttable] = useState(false);
    const [shiftingFromtable, setShiftingFromtable] = useState<any>();
    const [shiftingTotable, setShiftingTotable] = useState<any>();
    const [tableorders,setTableOrders]:any = useState()



    const getOriginalTablesData = () => {
        const {currentLocation} = localredux.localSettingsData;
        let tables;
        tables = currentLocation?.tables?.map((t: any) => ({
            ...t,
            ordertype: 'tableorder'
        }))
        return tables
    }

    const [tables, setTables] = useState((isEmpty(currentLocation?.tables) ? [] : getOriginalTablesData()) || []);


    useEffect(() => {
        getOrder().then()
    }, [currentLocation.tables])


    useEffect(() => {
        navigation.addListener('focus', (e) => {
            getOrder().then()
        })
    }, [navigation])


    const resetTables = async () => {
        shiftStart(false);
        getOrder().then()
    }

    const shiftStart = (value: any) => {
        dispatch(setSelected({label: 'Tables', value: 'tableorder', field: 'ordertype'}))
        setShifttable(value)
        setShiftingFromtable('');
        setShiftingTotable('');
    }


    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const onClickReserveTable = () => {
        closeMenu();
        dispatch(setDialog({
            visible: true,
            title: "Reserved Tables",
            hidecancel: true,
            width: '90%',
            component: () => <ReserveList navigation={navigation}/>
        }))
    }



    const onClickAddTable = () => {
        navigation.navigate('AddTable', {getOrder: getOrder})
        closeMenu();
    }


    const getOrder = async () => {

        let newtables = getOriginalTablesData();
        let newothertables: any = [];


        getTempOrders().then(async (tableorders:any)=>{
            setTableOrders(tableorders);
            Object.values(tableorders).map((table: any) => {
                let findTableIndex = tables?.findIndex((t: any) => t.tableid == table.tableid)
                if (findTableIndex != -1) {
                    newtables[findTableIndex] = table;
                } else {
                    newothertables.push(table)
                }
            });
            newtables = newtables.concat(newothertables);
            await setTables(newtables);

        })


    }


    const setOrderSetting = (title: any, ordertype: any) => {

        current.table = {'tablename': ordertype.label, ordertype: ordertype.value, invoiceitems: [], kots: []};


        const placeOrder = async (config: any) => {

            //await dispatch(resetCart())
            let tabledetail = {...current.table, ...config}

            if (Boolean(tabledetail.reservetable)) {
                const finditems = currentLocation?.tables.find((t: any) => {
                    return t.tableid == tabledetail.reservetable.tableid
                })

                tabledetail = {
                    ...tabledetail,
                    ...tabledetail.reservetable,
                    tablename: finditems.tablename
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
                title: title,
                tabledetails: current.table,
                'placeOrder': placeOrder
            });
        }

    }


    const Item = memo(
        (props: any) => {

            let {
                item, shifttable,
                resetTables,
                setShiftingFromtable,
                shiftingFromtable,
            } = props

            const shiftFrom = (tableorderid: any) => {
                setShiftingFromtable(tableorderid);
            }
            const shiftTo = async (tabledetail: any) => {
                dispatch(showLoader())
                const {tableid, tablename}: any = tabledetail.item;
                tableorders[shiftingFromtable] = {
                    ...tableorders[shiftingFromtable],
                    tableid,
                    tablename
                }
                await saveTempLocalOrder(tableorders[shiftingFromtable]).then(() => {
                    dispatch(hideLoader())
                    resetTables()
                })
            }


            let shiftstart = Boolean((shifttable && Boolean(item.tableorderid) && (item.ordertype === 'tableorder'))) && !Boolean(shiftingFromtable);
            let shifting = Boolean((shifttable && !Boolean(item.tableorderid))) && Boolean(shiftingFromtable);


            return (
                <Card style={[styles.card,styles.m_2,  styles.noshadow, {
                    maxWidth: '100%', minWidth: 150,marginBottom:5,
                    backgroundColor: Boolean(item.kots?.length) ? styles.yellow.color : Boolean(item.invoiceitems?.length) ? styles.secondary.color : styles.white.color,
                    borderRadius: 5
                }, styles.flexGrow,]} key={item.tableid}>
                    {<TouchableOpacity
                        style={{minHeight: 120}}
                        onPress={() => {
                            current.table = {invoiceitems: [], kots: [], ...item};
                            !shifttable ? navigation.navigate('CartStackNavigator', current.table) : Boolean(shifting) ? shiftTo(props) : shiftFrom(item.tableorderid)
                        }}>
                        {((shiftstart || shifting) || !shifttable) && <View style={[styles.p_4]}>
                            <View style={[styles.grid, styles.mb_3]}>
                                <View
                                    style={[styles.badge, styles.px_5, {backgroundColor: styles.primary.color}]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, {color: 'white'}]}>{item.tablename || 'Retail'} </Text></View></View>
                            {Boolean(item.invoiceitems?.length) && <>
                                <Paragraph><ProIcon align={'left'} name={'user'} action_type={'text'}
                                                    size={13}/> {item.paxes} x {item.clientname}</Paragraph>

                                {Boolean(item?.advanceorder?.date) && <>
                                    <Paragraph style={[styles.paragraph, styles.text_xs]}>Delivery on </Paragraph>
                                    <Text
                                        style={[styles.paragraph]}>{moment(item?.advanceorder.date).format(dateFormat())} {moment(item?.advanceorder.time).format('HH:mm')}</Text>
                                </>}


                                <View style={[styles.mt_3]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_lg, styles.bold, {color: 'black'}]}>{toCurrency(item.vouchertotaldisplay)}</Text>
                                </View>

                            </>}

                            {item.printcounter &&
                                <View style={[styles.absolute, {right: 10, top: 12}]}><Text><ProIcon size={15}
                                                                                                     name={'print'}
                                                                                                     type={'solid'}
                                                                                                     action_type={'text'}/></Text></View>}


                        </View>}


                    </TouchableOpacity>}
                </Card>
            );
        },
        (r1, r2) => {
            return r1.item === r2.item;
        }
    );

    navigation.setOptions({
        headerTitle:currentLocation?.locationname,
        headerLeft: () =>  <Appbar.Action icon="menu" onPress={() => navigation.navigate('ProfileSettingsNavigator')}/> ,
        headerRight: () => {
            return <View>

                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                        openMenu()
                    }}/>  }>
                    <Menu.Item onPress={onClickAddTable} title="Add Table"/>
                    {!shifttable && <Menu.Item onPress={() => {
                        closeMenu()
                        setShifttable(true)
                    }} title="Shift Table"/>}
                    {shifttable && <Menu.Item onPress={() => {
                        closeMenu()
                        setShifttable(false)
                    }} title="Disable Shift"/>}
                    <Menu.Item onPress={onClickReserveTable} title="Reserve Tables"/>
                </Menu>

            </View>
        }
    })


    const renderItem = useCallback(({item, index}: any) => <Item shifttable={shifttable}
                                                                 shiftingFromtable={shiftingFromtable}
                                                                 setShiftingFromtable={setShiftingFromtable}
                                                                 shiftingTotable={shiftingTotable}
                                                                 setShiftingTotable={setShiftingTotable}
                                                                 getOrder={getOrder}
                                                                 resetTables={resetTables} item={item}
                                                                 key={index}/>, [shifttable, shiftingFromtable, shiftingTotable]);


    const AllTable = () => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'all'}/>
        </View>
    );

    const OnlyTable = () => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'tableorder'}/>
        </View>
    );

    const HomeDelivery = () => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'homedelivery'}/>
        </View>
    );

    const TakeAway = () => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'takeaway'}/>
        </View>
    );

    const AdvanceOrder = () => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'advanceorder'}/>
        </View>
    );


    const TableFlatlist = ({type}: any) => {

        return (
            <View style={[styles.px_2]}>
                <FlatList
                    data={tables?.filter((table: any) => {
                        if (type === 'all') {
                            return true
                        } else {
                            return table.ordertype === type
                        }
                    })}
                    renderItem={renderItem}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}

                    numColumns={device.tablet ? 4 : 2}
                    getItemLayout={(data, index) => {
                        return {length: 100, offset: 100 * index, index};
                    }}
                    ListFooterComponent={() => {
                        return <View style={{height: 80}}></View>
                    }}

                    ListEmptyComponent={<View>
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
                                                'label': '+ QSR / Quick Bill',
                                                value: 'qsr'
                                            })
                                        } else if (type === 'takeaway') {
                                            setOrderSetting("Takeaway", {'label': 'Takeaway', value: 'takeaway'})
                                        } else if (type === 'advanceorder') {
                                            setOrderSetting("Advanced Order", {
                                                'label': 'Advance Order',
                                                value: 'advanceorder'
                                            })
                                        } else if (type === 'homedelivery') {
                                            setOrderSetting("Home Delivery", {
                                                'label': 'Home Delivery',
                                                value: 'homedelivery'
                                            })
                                        } else if (type === 'tableorder') {
                                            setOrderSetting("Table Reservation", {
                                                'label': 'Table Reservation',
                                                value: 'tableorder'
                                            })
                                        }
                                    }}> + Take New Order
                                </Button>
                            </View>
                        </View>
                    </View>}


                />

            </View>
        )
    }


    return (
        <>
            <Tabs
                scenes={{
                    all: AllTable,
                    tableorder: OnlyTable,
                    homedelivery: HomeDelivery,
                    takeaway: TakeAway,
                    advanceorder: AdvanceOrder
                }}
                routes={[
                    {key: 'all', title: 'All'},
                    {key: 'tableorder', title: 'Tables'},
                    {key: 'homedelivery', title: 'HomeDelivery'},
                    {key: 'takeaway', title: 'TakeAway'},
                    {key: 'advanceorder', title: 'AdvanceOrder'},
                ]}
                scrollable={true}
            />

            <FAB.Group
                open={floating}
                fabStyle={{backgroundColor: 'black', marginBottom: 10}}
                backdropColor={'#00000070'}
                icon={'plus'}
                actions={[
                    {
                        icon: 'truck',
                        label: 'Home Delivery',
                        onPress: () => setOrderSetting("Home Delivery", {
                            'label': 'Home Delivery',
                            value: 'homedelivery'
                        }),
                    },
                    {
                        icon: 'sack',
                        label: 'Takeaway',
                        onPress: () => setOrderSetting("Takeaway", {'label': 'Takeaway', value: 'takeaway'}),
                    },
                    {
                        icon: 'sack',
                        label: 'Advance Order',
                        onPress: () => setOrderSetting("Advanced Order", {
                            'label': 'Advance Order',
                            value: 'advanceorder'
                        }),
                    },
                    {
                        icon: 'popcorn',
                        label: '+ QSR / Quick Bill',
                        onPress: () => setOrderSetting("+ QSR / Quick Bill", {
                            'label': '+ QSR / Quick Bill',
                            value: 'qsr'
                        }),
                    },
                    {
                        icon: 'table',
                        label: 'Table Reservation',
                        onPress: () => setOrderSetting("Table Reservation", {
                            'label': 'Table Reservation',
                            value: 'tableorder'
                        }),
                    },
                ]}
                onStateChange={() => {
                    setFloating(!floating)
                }}
                onPress={() => {
                    if (floating) {
                        // do something if the speed dial is open
                    }
                }}
            />
        </>
    );


}

const mapStateToProps = (state: any) => ({
    ordertype: state.selectedData.ordertype,
})

export default connect(mapStateToProps)(withTheme(Index));

