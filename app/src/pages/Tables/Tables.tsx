import {current, device, localredux} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {appLog, filterArray, isEmpty, saveTempLocalOrder, toCurrency} from "../../libs/function";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card, FAB, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {refreshCartData, resetCart, setCartData, updateCartField} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {hideLoader, setDialog} from "../../redux-store/reducer/component";
import ClientAndSource from "../Cart/ClientAndSource";
import moment from "moment";



const Index = (props: any) => {

    const {tableorders,ordertype} = props;

    const navigation = useNavigation()

    const {currentLocation} = localredux.localSettingsData;


    const dispatch = useDispatch();
    const [floating, setFloating] = useState(false);


    const getOriginalTablesData = () => {
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
    }, [tableorders])




    const getOrder = async () => {
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
    }



    const setOrderSetting = (ordertype:any) => {

        current.table = {'tablename':  ordertype.label, ordertype: ordertype.value,invoiceitems:[],kots:[]};

        dispatch(setDialog({
            visible: true,
            title: "Source & Client",
            hidecancel: true,
            width: 'auto',
            component: () => <ClientAndSource tabledetails={current.table} placeOrder={placeOrder} navigation={navigation} />
        }))


        const placeOrder = async (config:any) => {

            //await dispatch(resetCart())
            let tabledetail = {...current.table,...config}

            if(Boolean(tabledetail.reservetable)){
                const finditems =  currentLocation?.tables.find((t:any)=>{
                    return t.tableid == tabledetail.reservetable.tableid
                })

                tabledetail = {
                    ...tabledetail,
                    ...tabledetail.reservetable,
                    tablename:finditems.tablename
                }
            }

            await dispatch(refreshCartData(tabledetail))

            if(tabledetail.ordertype ==='tableorder'){
                saveTempLocalOrder().then(() => {})
            }
            else{
                navigation.navigate('CartStackNavigator',tabledetail);
            }
        }

    }



    const Item = memo(
        ({item}: any) => {

            appLog('item',item)

            return (
                <View style={[{minWidth: 150}, styles.flexGrow,]} key={item.tableid}>
                    <TouchableOpacity style={[styles.m_2,styles.noshadow,  {height: 135,backgroundColor: Boolean(item.kots?.length) ? styles.yellow.color : Boolean(item.clientname) ? styles.secondary.color : styles.light.color,borderRadius:5}]}
                                      onPress={() => {
                                          appLog('item',item)
                                          current.table = {invoiceitems:[],kots:[],...item};
                                          navigation.navigate('CartStackNavigator', current.table)
                                      }}>
                        <View style={[styles.p_5]}>
                            <View style={[styles.grid, styles.mb_3]}>
                                <View
                                    style={[styles.badge, styles.px_5, {backgroundColor:  styles.primary.color}]}>
                                    <Text style={[styles.paragraph, styles.text_xs, {color: 'white'}]}>{item.tablename || 'Retail'} </Text></View></View>
                            {Boolean(item.clientname) && <>
                                <Paragraph><ProIcon align={'left'} name={'user'} action_type={'text'}
                                                    size={13}/> {item.paxes} x {item.clientname}</Paragraph>
                                <View style={[styles.mt_3]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_lg,styles.bold,{color:'black'}]}>{toCurrency(item.vouchertotaldisplay)}</Text>
                                </View>
                            </>}
                            {Boolean(item?.advanceorder?.date) &&
                                <Paragraph>Delivery on :  {moment(item?.advanceorder.date).format('DD/MM/YYYY')} {moment(item?.advanceorder.time).format('HH:mm A')}</Paragraph>}

                            {Boolean(item.reservetable) && <Paragraph>Reserved</Paragraph>}

                        </View>
                    </TouchableOpacity>
                </View>
            );
        },
        (r1, r2) => {
            return r1.item === r2.item;
        }
    );

    const renderItem = useCallback(({item, index}: any) => <Item item={item} key={index}/>, []);



    return (
        <>

        <View  style={[styles.px_4,styles.flex,styles.h_100]}>

        <FlatList
            data={tables?.filter((table: any) => {
                if (ordertype?.value === 'all') {
                    return true
                } else {
                    return table.ordertype === ordertype?.value
                }
            })}
            renderItem={renderItem}
            numColumns={device.tablet?4:2}
            getItemLayout={(data, index) => {
                return { length: 100, offset: 100 * index, index };
            }}
            ListFooterComponent={() => {
                return <View style={{height: 80}}></View>
            }}
            ListEmptyComponent={()=>{
                return (
                    <>
                        <View style={{marginTop:70}}><Paragraph style={[styles.paragraph,{textAlign:'center'}]}>No any order</Paragraph></View>
                        <View  style={{marginTop:20}}><Paragraph  style={[styles.paragraph,{textAlign:'center'}]}><ProIcon name={'utensils'} size={25}/></Paragraph></View>
                    </>
                )
            }}
        />

            <View style={[styles.grid,styles.mb_3,{marginTop:'auto'}]}>
                <Button onPress={()=> {  }}  >
                    Shift Table
                </Button>
            </View>

        </View>


            <FAB.Group
                open={floating}
                fabStyle={{backgroundColor:'black',marginBottom:10}}
                backdropColor={'#00000070'}
                icon={'plus'}
                actions={[
                    {
                        icon: 'truck',
                        label: 'Home Delivery',
                        onPress: () => setOrderSetting({'label': 'Home Delivery', value: 'homedelivery'}),
                    },
                    {
                        icon: 'sack',
                        label: 'Takeaway',
                        onPress: () => setOrderSetting({'label': 'Takeaway', value: 'takeaway'}),
                    },
                    {
                        icon: 'popcorn',
                        label: 'QSR',
                        onPress: () => setOrderSetting({'label': 'QSR', value: 'qsr'}),
                    },
                    {
                        icon: 'sack',
                        label: 'Advance Order',
                        onPress: () => setOrderSetting({'label': 'Advance Order', value: 'advanceorder'}),
                    },
                    {
                        icon: 'popcorn',
                        label: 'Reserve Table',
                        onPress: () => setOrderSetting({'label': 'Reserve Table', value: 'tableorder'}),
                    },
                ]}
                onStateChange={()=>{
                    if(ordertype.value === 'qsr'){
                        setOrderSetting({'label': 'QSR', value: 'qsr'})
                    }
                    else if(ordertype.value === 'takeaway'){
                        setOrderSetting({'label': 'Takeaway', value: 'takeaway'})
                    }
                    else if(ordertype.value === 'advanceorder'){
                        setOrderSetting({'label': 'Advance Order', value: 'advanceorder'})
                    }
                    else if(ordertype.value === 'homedelivery'){
                        setOrderSetting({'label': 'Home Delivery', value: 'homedelivery'})
                    }
                    else if(ordertype.value === 'tableorder'){
                        setOrderSetting({'label': 'Reserve Table', value: 'tableorder'})
                    }
                    else{
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

