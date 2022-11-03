import {current, device, localredux} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {isEmpty, saveTempLocalOrder, toCurrency} from "../../libs/function";
import {FlatList, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import {FAB, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import {hideLoader, setAlert, setModal, showLoader} from "../../redux-store/reducer/component";
import ClientAndSource from "../Cart/ClientAndSource";
import moment from "moment";

import OrderTypes from "./OrderTypes";
import {setSelected} from "../../redux-store/reducer/selected-data";


const Index = (props: any) => {

    const {tableorders, ordertype} = props;

    const navigation = useNavigation()

    const {currentLocation} = localredux.localSettingsData;


    const dispatch = useDispatch();
    const [refreshing,setRefreshing]:any = useState(false);
    const [floating, setFloating] = useState(false);
    const [shifttable, setShifttable] = useState(false);
    const [shiftingFromtable, setShiftingFromtable] = useState<any>();
    const [shiftingTotable, setShiftingTotable] = useState<any>();


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
    }, [tableorders,currentLocation.tables])


    const resetTables = async () => {
        shiftStart(false);
    }

    const shiftStart = (value: any) => {
        dispatch(setSelected({label: 'Tables', value: 'tableorder', field: 'ordertype'}))
        setShifttable(value)
        setShiftingFromtable('');
        setShiftingTotable('');
    }


    const getOrder = async () => {
        setRefreshing(true)
        let newtables = getOriginalTablesData();
        let newothertables: any = [];
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
        setRefreshing(false)
    }


    const setOrderSetting = (title: any, ordertype: any) => {

        current.table = {'tablename': ordertype.label, ordertype: ordertype.value, invoiceitems: [], kots: []};

        dispatch(setModal({
            visible: true,
            hidecancel: true,
            width: '98%',
            component: () => <ClientAndSource title={title} tabledetails={current.table} placeOrder={placeOrder}
                                              navigation={navigation}/>
        }))


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
                <View style={[{minWidth: 150}, styles.flexGrow,]} key={item.tableid}>
                    {<TouchableOpacity style={[styles.m_2, styles.noshadow, {
                        height: 140,
                        backgroundColor: Boolean(item.kots?.length) ? styles.yellow.color : Boolean(item.invoiceitems?.length) ? styles.secondary.color : styles.light.color,
                        borderRadius: 5
                    }]}
                                       onPress={() => {
                                           current.table = {invoiceitems: [], kots: [], ...item};
                                           !shifttable ? navigation.navigate('CartStackNavigator', current.table) : Boolean(shifting) ? shiftTo(props) : shiftFrom(item.tableorderid)
                                       }}>
                        {((shiftstart || shifting) || !shifttable) && <View style={[styles.p_5]}>
                            <View style={[styles.grid, styles.mb_3]}>
                                <View
                                    style={[styles.badge, styles.px_5, {backgroundColor: styles.primary.color}]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, {color: 'white'}]}>{item.tablename || 'Retail'} </Text></View></View>
                            {Boolean(item.invoiceitems?.length) && <>
                                <Paragraph><ProIcon align={'left'} name={'user'} action_type={'text'}
                                                    size={13}/> {item.paxes} x {item.clientname}</Paragraph>

                                {Boolean(item?.advanceorder?.date) &&
                                    <Paragraph>Delivery on
                                        : {moment(item?.advanceorder.date).format('DD/MM/YYYY')} {moment(item?.advanceorder.time).format('HH:mm')}</Paragraph>}

                                <View style={[styles.mt_3]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_lg, styles.bold, {color: 'black'}]}>{toCurrency(item.vouchertotaldisplay)}</Text>
                                </View>
                            </>}



                        </View>}
                    </TouchableOpacity>}
                </View>
            );
        },
        (r1, r2) => {
            return r1.item === r2.item;
        }
    );


    const renderItem = useCallback(({item, index}: any) => <Item shifttable={shifttable}
                                                                 shiftingFromtable={shiftingFromtable}
                                                                 setShiftingFromtable={setShiftingFromtable}
                                                                 shiftingTotable={shiftingTotable}
                                                                 setShiftingTotable={setShiftingTotable}
                                                                 getOrder={getOrder}
                                                                 resetTables={resetTables} item={item}
                                                                 key={index}/>, [shifttable, shiftingFromtable, shiftingTotable]);

    return (
        <>
            <OrderTypes shifttable={shifttable} setShifttable={(value: any) => shiftStart(value)} getOrder={getOrder}/>

            <View style={[styles.px_4, styles.flex, styles.h_100]}>

                <FlatList
                    data={tables?.filter((table: any) => {
                        if (ordertype?.value === 'all') {
                            return true
                        } else {
                            return table.ordertype === ordertype?.value
                        }
                    })}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => getOrder()}
                        />
                    }
                    numColumns={device.tablet ? 4 : 2}
                    getItemLayout={(data, index) => {
                        return {length: 100, offset: 100 * index, index};
                    }}
                    ListFooterComponent={() => {
                        return <View style={{height: 80}}></View>
                    }}
                    ListEmptyComponent={() => {
                        return (
                            <>
                                <View style={{marginTop: 70}}><Paragraph
                                    style={[styles.paragraph, {textAlign: 'center'}]}>No any order </Paragraph></View>

                            </>
                        )
                    }}
                />

            </View>


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
                        icon: 'popcorn',
                        label: 'QSR',
                        onPress: () => setOrderSetting("QSR", {'label': 'QSR', value: 'qsr'}),
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
                        icon: 'table',
                        label: 'Table Reservation',
                        onPress: () => setOrderSetting("Table Reservation", {
                            'label': 'Table Reservation',
                            value: 'tableorder'
                        }),
                    },
                ]}
                onStateChange={() => {
                    if (ordertype.value === 'qsr') {
                        setOrderSetting("QSR", {'label': 'QSR', value: 'qsr'})
                    } else if (ordertype.value === 'takeaway') {
                        setOrderSetting("Takeaway", {'label': 'Takeaway', value: 'takeaway'})
                    } else if (ordertype.value === 'advanceorder') {
                        setOrderSetting("Advanced Order", {'label': 'Advance Order', value: 'advanceorder'})
                    } else if (ordertype.value === 'homedelivery') {
                        setOrderSetting("Home Delivery", {'label': 'Home Delivery', value: 'homedelivery'})
                    } else if (ordertype.value === 'tableorder') {
                        setOrderSetting("Table Reservation", {'label': 'Table Reservation', value: 'tableorder'})
                    } else {
                        setFloating(!floating)
                    }
                }}
                onPress={() => {
                    if (floating) {
                        // do something if the speed dial is open
                    }
                }}
            />

        </>
    )
}

const mapStateToProps = (state: any) => ({
    tableorders: state.tableOrdersData || {},
    ordertype: state.selectedData.ordertype,
})

export default connect(mapStateToProps)(withTheme(Index));

