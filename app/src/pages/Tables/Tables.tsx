import {current, device, localredux, ordertypes} from "../../libs/static";
import React, {useEffect, useState} from "react";
import {isEmpty, toCurrency} from "../../libs/function";
import {FlatList, ScrollView, Text, View} from "react-native";
import {Card, FAB, Paragraph, Portal, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import dataContainer from "../../hoc/dataContainer";
import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import Button from "../../components/Button";
import {resetCart, setCartData} from "../../redux-store/reducer/cart-data";
import { showLoader } from "../../redux-store/reducer/component";


const Index = (props: any) => {

    const {navigation, tableorders} = props;

    const {currentLocation} = localredux.localSettingsData;

    const [ordertype, setOrdertype] = useState(ordertypes[0]);
    const [floating, setFloating] = useState(false);

    const dispatch = useDispatch();
    // const isFocus = useIsFocused()

    const placeOrder = (ordertype:any) => {
        dispatch(resetCart())
        current.table = {'tablename': ordertype.label, ordertype: ordertype.value};
        dispatch(setCartData(current.table))
        navigation.navigate('CartStackNavigator', current.table)
    }

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
    }, [ordertype, tableorders])

    useEffect(() => {
        dispatch(resetCart())
    }, [ordertype])

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

    const renderitemssquare = ({item}: any) => {

        return (
            <View style={[{minWidth: 150}, styles.flexGrow]} key={item.tableid}>
                <Card style={[styles.m_2,  {height: 125}]}
                      onPress={() => {
                          current.table = item;
                          dispatch(resetCart())
                          dispatch(setCartData(item))
                          navigation.navigate('CartStackNavigator', {...item})
                      }}>
                    <Card.Content style={[]}>
                        <View style={[styles.grid, styles.mb_3]}>
                            <View
                            style={[styles.badge, styles.px_5, {backgroundColor: Boolean(item.vouchertotaldisplay) ? styles.green.color : styles.red.color}]}>
                                <Text style={[styles.paragraph, styles.text_sm, {color: 'white'}]}>{item.tablename || 'Retail'}</Text></View></View>
                            {Boolean(item.vouchertotaldisplay) && <>
                                <Paragraph><ProIcon align={'left'} name={'user'} action_type={'text'}
                                                    size={13}/> {item.paxes} x {item.clientname}</Paragraph>
                                <View style={[styles.mt_3]}>
                                    <Text
                                        style={[styles.paragraph, styles.text_lg,styles.bold, {color: styles.green.color}]}>{toCurrency(item.vouchertotaldisplay)}</Text>
                                </View>
                            </>}
                    </Card.Content>
                </Card>
            </View>
        )
    }

    return <>


            <View style={[styles.grid,styles.noWrap,styles.bg_light,{paddingTop:5,paddingBottom:5}]}>
                <ScrollView horizontal={true}>
                {
                    ordertypes.map((type: any) => {
                        return <Button style={[styles.m_2]}  onPress={() => {
                            setOrdertype(type)
                        }} secondbutton={ordertype.value !== type.value}   more={{backgroundColor:ordertype.value !== type.value ? 'white':styles.primary.color}} >{type.label}</Button>
                    })
                }
                </ScrollView>
            </View>


        <FlatList
            data={tables?.filter((table: any) => {
                if (ordertype.value === 'all') {
                    return true
                } else {
                    return table.ordertype === ordertype.value
                }
            })}
            renderItem={renderitemssquare}
            numColumns={device.tablet?4:2}
            initialNumToRender={5}
        />

        {/*{(ordertype.value !== 'all' && ordertype.value !== 'tableorder') && <View style={[{minWidth: 170}]}>
            <Card style={[styles.m_2, {height: 150}]}
                  onPress={() => {
                      current.table = {'tablename': ordertype.label, ordertype: ordertype.value},
                          navigation.navigate('CartStackNavigator', current.table)
                  }}>
                <Card.Content>
                    <View style={[styles.h_100, styles.center, styles.middle]}>
                        <Text>
                            <ProIcon name={'plus'}/>
                        </Text>
                        <Text>{ordertype.label}</Text>
                    </View>
                </Card.Content>
            </Card>
        </View>}*/}


        <FAB.Group
            open={floating}
            fabStyle={{backgroundColor:'black',marginBottom:10}}
            backdropColor={'#00000070'}
            icon={'plus'}
            actions={[
                {
                    icon: 'truck',
                    label: 'Home Delivery',
                    onPress: () => placeOrder({'label': 'Home Delivery', value: 'homedelivery'}),
                },
                {
                    icon: 'sack',
                    label: 'Takeaway',
                    onPress: () => placeOrder({'label': 'Takeaway', value: 'takeaway'}),
                },
                {
                    icon: 'popcorn',
                    label: 'QSR',
                    onPress: () => placeOrder({'label': 'QSR', value: 'qsr'}),
                },
            ]}
            onStateChange={()=>{
                if(ordertype.value === 'qsr'){
                    placeOrder({'label': 'QSR', value: 'qsr'})
                }
                else if(ordertype.value === 'takeaway'){
                    placeOrder({'label': 'Takeaway', value: 'takeaway'})
                }
                else if(ordertype.value === 'homedelivery'){
                    placeOrder({'label': 'Home Delivery', value: 'homedelivery'})
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
}


const mapStateToProps = (state: any) => ({
    tableorders: state.tableOrdersData || {},
})

export default connect(mapStateToProps)(dataContainer(withTheme(Index)));

