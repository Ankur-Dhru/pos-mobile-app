import {current, ItemDivider, localredux, METHOD, urls} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {
    appLog,
    clone,
    dateFormat,
    errorAlert,
    getTempOrders, groupBy,
    isEmpty,
    saveTempLocalOrder,
    toCurrency
} from "../../libs/function";
import {
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    SectionList,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Appbar, Caption, Card, FAB, List, Menu, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {hideLoader, setAlert, setBottomSheet, showLoader} from "../../redux-store/reducer/component";
import ClientAndSource from "../Cart/ClientAndSource";
import moment from "moment";
import {setSelected} from "../../redux-store/reducer/selected-data";
import Button from "../../components/Button";
import ReserveList from "./ReserveList";
import {TabBar, TabView} from "react-native-tab-view";
import apiService from "../../libs/api-service";
import {uuid} from "uuidv4";

let interval: any = ''
const Index = ({tableorders}: any) => {


    const navigation = useNavigation()

    const {currentLocation} = localredux.localSettingsData;

    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    const [floating, setFloating] = useState(false);
    const [shifttable, setShifttable] = useState(false);
    const [shiftingFromtable, setShiftingFromtable] = useState<any>();
    const [shiftingFromtableid, setShiftingFromtableid] = useState<any>();
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

    let areas = Object.keys(groupBy(tables.filter((table:any)=> {
        return Boolean(table.area) && table.ordertype === 'tableorder'
    }),'area'))
    areas.push('All');
    const [floor,setFloor] = useState(areas[0]);

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
            getOrder().then(() => {
            })
            return () => {
                clearInterval(interval);
                interval = null;
            };
        }
    }, [tableorders, currentLocation.tables, isFocused,refreshing])

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
            visible: true,
            height: '50%',
            component: () => <ReserveList navigation={navigation}/>
        }))
    }


    const onClickAddTable = () => {
        navigation.navigate('AddTable', {getOrder: getOrder})
        closeMenu();
    }


    const getOrder = () => {

        return new Promise(async (resolve) => {
            let newtables = getOriginalTablesData();
            let newothertables: any = [];

            await getTempOrders().then(async (tableorders: any) => {

                Object.values(tableorders).map((table: any) => {
                    let findTableIndex = tables?.findIndex((t: any) => t.tableid == table.tableid);
                    if (findTableIndex != -1) {
                        newtables[findTableIndex] = table;
                    } else {
                        newothertables.push(table)
                    }
                });
                newtables = newtables.concat(newothertables);

                await setTables(newtables);

                setRefreshing(false);

                resolve(newtables)

            })
        })


    }


    const setOrderSetting = (title: any, ordertype: any) => {

        current.table = {'tablename': ordertype.label,area:ordertype.label, ordertype: ordertype.value, invoiceitems: [], kots: []};


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

    const setTableOrderDetail = async (tabledetails: any) => {

        const sameStaff = ((Boolean(tabledetails?.staffid) && (tabledetails?.staffid === adminid)) || (!Boolean(tabledetails?.staffid)))

        if ((accessMultipleDevice && sameStaff) || !accessMultipleDevice) {
            if ((Boolean(urls.localserver) && Boolean(tabledetails.tableorderid))) {


                await apiService({
                    method: METHOD.GET,
                    action: 'tableorder',
                    queryString: {key: 'tableid', value: tabledetails.tableid},
                    other: {url: urls.localserver},
                }).then((response: any) => {

                    const {kots,numOfKOt}:any = tabledetails

                    if(kots?.length > 0 || numOfKOt > 0){
                        let {staffid,staffname,...others}:any = response.data;
                        tabledetails = {
                            ...tabledetails,
                            ...others,
                        }
                    }
                    else{
                        tabledetails = {
                            ...tabledetails,
                            ...response.data,
                        }
                    }
                })
            }
            navigation.navigate('CartStackNavigator', tabledetails)

        } else {
            errorAlert(`Table only access by ${tabledetails.staffname}`)
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

            const shiftFrom = (tableorderid: any,tableid:any) => {
                setShiftingFromtable(tableorderid);
                setShiftingFromtableid(tableid)
            }
            const shiftTo = async (tabledetail: any) => {
                dispatch(showLoader())

                const {tableid, tablename,area}: any = tabledetail.item;

                let clone_tableorders = clone(tableorders)


                if (Boolean(urls.localserver)) {

                    await apiService({
                        method: METHOD.GET,
                        action: 'tableorder',
                        queryString: {key: 'tableid', value: shiftingFromtableid},
                        other: {url: urls.localserver},
                    }).then(async (response: any) => {

                        response.data = clone({
                            ...response.data,
                            tableid: tableid,
                            tablename: tablename,
                            area: area
                        })

                        await saveTempLocalOrder(response.data).then(async () => {
                            await resetTables()
                            await dispatch(hideLoader())
                        })

                    })


                }
                else {
                    clone_tableorders[shiftingFromtable] = clone({
                        ...clone_tableorders[shiftingFromtable],
                        tableid: tableid,
                        tablename: tablename,
                        area: area
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


            return (
                <Card style={[styles.card, styles.m_1, styles.mb_2, {
                    marginTop: 0,
                    width: oriantation === 'portrait' ? '45%' : '24%',
                    backgroundColor: Boolean(item?.printcounter) ? styles.yellow.color : Boolean(item.clientname) ? styles.secondary.color : styles.light.color,
                    borderRadius: 5,
                }, styles.flexGrow,]} key={item.tableid}>
                    {<TouchableOpacity
                        style={{minHeight: 120}}
                        onPress={() => {
                            current.table = {invoiceitems: [], kots: [], ...item};
                            !shifttable ? setTableOrderDetail(current.table) : Boolean(shifting) ? shiftTo(props) : shiftFrom(item.tableorderid,item.tableid)
                        }}>
                        {((shiftstart || shifting) || !shifttable) && <View style={[styles.p_4]}>
                            <View style={[styles.grid, styles.mb_3]}>
                                <View
                                    style={[styles.badge, styles.px_5, {backgroundColor: 'black'}]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, {color: 'white'}]}>{item.tablename || 'Retail'} </Text></View></View>
                            {Boolean(item.vouchertotaldisplay) && <>
                                <Paragraph><ProIcon align={'left'} name={'user'} action_type={'text'}
                                                    size={13}/> {item.paxes} x {item.clientname}</Paragraph>

                                {Boolean(item?.advanceorder?.date) && <>
                                    <Paragraph style={[styles.paragraph, styles.text_xs]}>Delivery on </Paragraph>
                                    <Paragraph
                                        style={[styles.paragraph]}>{moment(item?.advanceorder.date).format(dateFormat())} {moment(item?.advanceorder.time).format('HH:mm')}</Paragraph>
                                </>}


                                {((accessMultipleDevice && sameStaff) || !accessMultipleDevice) &&   <View style={[styles.mt_3]}>
                                    <Paragraph
                                        style={[styles.paragraph, styles.bold, styles.text_lg, {color: 'black'}]}>{toCurrency(item.vouchertotaldisplay)}</Paragraph>
                                </View>}

                            </>}

                            {Boolean(item?.printcounter) &&
                                <View style={[styles.absolute, {right: 10, top: 12}]}><Text><ProIcon size={15}
                                                                                                     name={'print'}
                                                                                                     type={'solid'}
                                                                                                     action_type={'text'}/></Text></View>}


                            {Boolean(item?.staffname) &&
                                <Paragraph style={[styles.paragraph, styles.text_xs]}>{item.staffname}</Paragraph>}

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
        headerTitle: currentLocation?.locationname,
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
                        {!shifttable && <Menu.Item onPress={() => {
                            closeMenu()
                            setShifttable(true)
                        }} title="Shift Table"/>}
                        {shifttable && <Menu.Item onPress={() => {
                            closeMenu()
                            setShifttable(false)
                        }} title="Disable Shift"/>}
                         {!Boolean(urls.localserver) && <Menu.Item onPress={onClickReserveTable} title="Reserved Tables"/>}

                        <Menu.Item onPress={() => {
                            getOrder().then();
                            closeMenu()
                        }} title="Refresh"/>
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
                <Caption style={[styles.caption,styles.px_6]}>Areas</Caption>
            </View>
            {
                areas.map((area:any,index:any)=>{
                   return(<List.Item
                        style={[styles.listitem]}
                        title={area}
                        onPress={() => {
                            setFloor(area);
                            dispatch(setBottomSheet({visible:false}))
                        }}
                        key={index}
                        left={() => <List.Icon icon="layers"/>}
                        right={() => <List.Icon icon="chevron-right"/>}
                    />)
                })
            }
        </View>
    }

    const renderItem = useCallback(({item, index}: any) => <Item shifttable={shifttable}
                                                                 shiftingFromtable={shiftingFromtable}
                                                                 setShiftingFromtable={setShiftingFromtable}
                                                                 shiftingTotable={shiftingTotable}
                                                                 setShiftingTotable={setShiftingTotable}
                                                                 getOrder={getOrder}
                                                                 resetTables={resetTables} item={item}
                                                                 key={index}/>, [shifttable, shiftingFromtable, shiftingTotable]);

    const AllTable = memo(() => (
        <View style={[styles.flex]}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <TableSectionlist type={'all'} area={'All'}/>
            </ScrollView>
        </View>
    ));

    const OnlyTable = memo(() => (
        <View style={[styles.flex]}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <TableSectionlist type={'tableorder'} area={floor}/>
            </ScrollView>
            {areas.length > 1 && <View style={[styles.mt_auto]}>

                <TouchableOpacity onPress={()=>{
                    dispatch(setBottomSheet({
                        visible: true,
                        height: '80%',
                        component: () => <Floors/>
                    }))
                }}  style={[styles.p_3,styles.mb_3,styles.grid,styles.center,styles.middle]}>

                    <View style={[styles.grid, styles.center, styles.mb_3]}>
                        <View
                            style={[styles.badge, styles.px_5, styles.py_5, styles.grid, styles.noWrap, styles.middle, {
                                backgroundColor: '#000',
                                borderRadius: 30,
                                paddingLeft: 20,
                                paddingRight: 20
                            }]}>
                            <Paragraph><ProIcon name={'layer-group'} type={"solid"} color={'white'} size={'18'}  action_type={'text'}/> </Paragraph>
                            <Paragraph style={[styles.paragraph, styles.bold, {color: 'white'}]}> {floor}</Paragraph>
                        </View>
                    </View>

                </TouchableOpacity>

            </View>}

        </View>
    ));

    const HomeDelivery = memo(() => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'homedelivery'}/>
        </View>
    ));

    const TakeAway = memo(() => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'takeaway'}/>
        </View>
    ));

    const AdvanceOrder = memo(() => (
        <View style={[styles.flex]}>
            <TableFlatlist type={'advanceorder'}/>
        </View>
    ));

    const EmptyCompoennt = ({type}:any) => {
        return (
            <View>
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
            </View>
        )
    }

    const TableSectionlist = memo(({type,area}: any) => {

        let floors = groupBy(tables.filter((table:any)=> {
            if(type === 'tableorder'){
                return table.ordertype === type
            }
            return true
        }),'area');
        let data:any = []
        Object.keys(floors).map((key:any)=>{
            data.push({title:key,data:floors[key]})
        })


        return (
            <View style={[styles.px_2,styles.flex,styles.h_100]}>
                <>
                    {
                        data.filter((floor:any)=>{
                            if(area !== 'All'){
                                return  floor.title === area
                            }
                            return true
                        }).map((floor:any,index:any)=>{
                            return <View  key={index}>
                                {Boolean(data.length > 1) && (Boolean(floor?.title !== 'undefined') ?   <Paragraph style={[styles.bold]}> {floor?.title}</Paragraph> : <View style={{height:20}}></View>)}
                                <View style={[styles.grid]}>
                                    {
                                        floor.data.map((item:any,index:any)=>{
                                            return <Item shifttable={shifttable}
                                                         shiftingFromtable={shiftingFromtable}
                                                         setShiftingFromtable={setShiftingFromtable}
                                                         shiftingTotable={shiftingTotable}
                                                         setShiftingTotable={setShiftingTotable}
                                                         getOrder={getOrder}
                                                         resetTables={resetTables} item={item}
                                                         key={index}/>
                                        })
                                    }
                                </View>
                            </View>
                        })
                    }
                </>


              {/*  <SectionList
                    sections={data}
                    keyExtractor={(item, index) => item + index}
                    renderSectionHeader={({section: {title}}) => (
                        <Paragraph style={styles.bold}> {title}</Paragraph>
                    )}
                    renderItem={renderItem}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => getOrder()}
                        />
                    }
                    numColumns={oriantation === 'landscape' ? 4 : 2}
                    getItemLayout={(data, index) => {
                        return {length: 100, offset: 100 * index, index};
                    }}
                    ListFooterComponent={() => {
                        return <View style={{height: 80}}></View>
                    }}

                    ListEmptyComponent={<EmptyCompoennt type={type}/>}
                />*/}


            </View>
        )
    })

    const TableFlatlist = memo(({type,area}: any) => {

        return (
            <View style={[styles.px_2]} key={oriantation}>
                <FlatList
                    data={tables?.filter((table: any) => {
                        if(type === 'tableorder'){
                            return table.ordertype === type && table.area === area
                        }
                        return table.ordertype === type
                    })}
                    renderItem={renderItem}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => getOrder()}
                        />
                    }
                    numColumns={oriantation === 'landscape' ? 4 : 2}
                    getItemLayout={(data, index) => {
                        return {length: 100, offset: 100 * index, index};
                    }}
                    ListFooterComponent={() => {
                        return <View style={{height: 80}}></View>
                    }}

                    ListEmptyComponent={<EmptyCompoennt type={type}/>}
                />
            </View>
        )
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

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={[styles.noshadow, styles.mb_3, {backgroundColor: 'white',}]}
            labelStyle={[styles.bold, {color: 'black', textTransform: 'capitalize'}]}
            indicatorStyle={{backgroundColor: styles.accent.color}}
            scrollEnabled={true}
            tabStyle={{minWidth: 80, width: 'auto'}}
        />
    );

    let routes = [{key: 'all', title: 'All'}, {key: 'tableorder', title: 'Tables'}, {
        key: 'homedelivery',
        title: 'Homedelivery'
    }, {key: 'takeaway', title: 'Takeaway'}]

    let actions = [
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
            label: '+ QSR / Quick Bill',
            onPress: () => setOrderSetting("+ QSR / Quick Bill", {
                'label': '+ QSR / Quick Bill',
                value: 'qsr'
            }),
        },

    ]

    if (!Boolean(urls.localserver)) {
        routes.push({key: 'advanceorder', title: 'Advance Order'});
        actions.push({
            icon: 'table',
            label: 'Table Reservation',
            onPress: () => setOrderSetting("Table Reservation", {
                'label': 'Table Reservation',
                value: 'tableorder'
            }),
        }, {
            icon: 'sack',
            label: 'Advance Order',
            onPress: () => setOrderSetting("Advanced Order", {
                'label': 'Advance Order',
                value: 'advanceorder'
            }),
        }, {
            icon: 'currency-inr',
            label: 'Expense',
            onPress: () => navigation.navigate("AddEditExpense")
        }, {
            icon: 'currency-inr',
            label: 'Payment Received',
            onPress: () => navigation.navigate("AddEditPaymentReceived")
        })
    }


    return (
        <>

            <TabView
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                style={styles.bg_white}
            />


            {/*<Tabs
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
            />*/}


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
        </>
    );


}

const mapStateToProps = (state: any) => ({
    ordertype: state.selectedData.ordertype,
    tableorders: state.tableOrdersData
})

export default connect(mapStateToProps)(withTheme(Index));

