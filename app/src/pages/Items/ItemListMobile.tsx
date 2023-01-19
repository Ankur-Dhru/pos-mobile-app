import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, Text, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";

import {styles} from "../../theme";
import {appLog, isRestaurant, objToArray, selectItem, toCurrency} from "../../libs/function";
import {Card, Divider, List, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import AddButton from "./AddButton";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import {AddItem} from "./ItemListTablet";
import {useNavigation} from "@react-navigation/native";
import GroupListMobile from "./GroupListMobile";
import CartTotal from "../Cart/CartTotal";
import Avatar from "../../components/Avatar";
import {ItemDivider, localredux} from "../../libs/static";
import GroupHeading from "./GroupHeading";


export const Item = memo(({item}: any) => {
    //item = JSON.parse(item?.data);

    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;
    const hasRestaurant = isRestaurant();
    const hasKot = Boolean(item?.kotid);

    return (
        <List.Item
            style={[styles.listitem,{paddingTop:5}]}
            key={item.itemid || item.comboid}
            title={item.itemname}
            titleStyle={[styles.bold,{textTransform: 'capitalize'}]}
            titleNumberOfLines={2}
            description={()=>{
                return <View style={[styles.grid, styles.middle]}>
                    {hasRestaurant && !Boolean(item.comboid) && <View style={[styles.mr_1]}>
                        <VegNonVeg type={item.veg}/>
                    </View>}
                    <Paragraph style={[styles.paragraph, styles.text_xs]}>
                        {toCurrency(baseprice)}
                    </Paragraph>
                    {
                        Boolean(item.comboid) && <Paragraph  style={[styles.paragraph, styles.text_xs]}>Group</Paragraph>
                    }
                </View>
            }}
            onPress={() => {
                 selectItem(item).then()
            }}
            left={() => <View style={{marginTop:5}}><Avatar label={item.itemname} value={item.itemid || item.comboid} fontsize={14} size={40}/></View>}
            right={() => {

                if(item.comboid){
                    return  <List.Icon icon="chevron-right" style={{height:35,width:35,margin:0}} />
                }

                if(Boolean(item?.productqnt) && !hasKot){
                    return <View><AddButton item={item} page={'itemlist'}/></View>
                }
                return  <List.Icon icon="plus" style={{height:35,width:35,margin:0}} />
            }}
        />
    )


}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})

export const getCombos = (selectedgroup:any) => {
    let combogroup: any = [];
    if(Boolean(localredux.initData?.combogroup)) {

        combogroup = Object.keys(localredux.initData?.combogroup).filter((key: any) => {
            const group = localredux.initData?.combogroup[key];
            return group.categoryid === selectedgroup
        }).map((key: any) => {
            const group = localredux.initData?.combogroup[key];

            appLog('group',group)

            return {
                itemname: group.itemgroupname,
                comboid: key,
                categoryid: group.categoryid,
                itemid: group.categoryid
            }
        });
    }

    return combogroup
}


const Index = (props: any) => {

    const {selectedgroup, invoiceitems} = props;

    const navigation = useNavigation()

    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);


    const updateItems = (items:any) => {
        return  items?.map((i: any) => {
            const find = invoiceitems.filter((ii: any) => {
                return ((+i.itemid === +ii.itemid) && Boolean(ii.added));
            })
            if (Boolean(find) && Boolean(find[0])) {
                return find[0]
            }
            return i;
        })
    }

    useEffect(() => {
       let newitems = updateItems(dataSource)
        setDataSource([...newitems]);
    }, [invoiceitems])


    useEffect(() => {

        getItemsByWhere({itemgroupid: selectedgroup}).then((newitems: any) => {
            const combogroup = getCombos(selectedgroup)
            if (Boolean(newitems.length > 0)) {
                let items = updateItems(newitems)
                setDataSource([...items,...combogroup]);
            } else {
                setDataSource([...combogroup]);
            }
            setLoading(true)
        });
    }, [selectedgroup,invoiceitems.length])


    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index} key={item.productid || item.comboid}/>
    }, [selectedgroup]);


    if (!loading) {
        return <></>
    }

    return (
        <>
            <Card style={[styles.card,styles.h_100, styles.flex,{marginBottom:0}]}>

                <Card.Content style={[styles.cardContent]}>

                <GroupHeading/>

                    <View style={[styles.h_100]}>
                    <FlatList
                        data={dataSource.filter((item:any)=>{
                            return !Boolean(item.groupid) && !item.isGrouped
                        })}
                        keyboardDismissMode={'on-drag'}
                        keyboardShouldPersistTaps={'always'}
                        renderItem={renderItem}
                        getItemLayout={(data, index) => {
                            return {length: 100, offset: 100 * index, index};
                        }}
                        ItemSeparatorComponent={ItemDivider}
                        /*onMomentumScrollEnd={onEndReached}
                        onEndReachedThreshold={0.5}*/

                        ListFooterComponent={() => {
                            return <View style={{height: 100}}></View>
                        }}
                        ListEmptyComponent={<View>
                            <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> Start
                                    building your item library.</Text>
                                <Text style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> Tap
                                    Create Item to begin.</Text>
                            </View>
                            <AddItem navigation={navigation}/>
                        </View>}
                    />
                    </View>

                <View style={[styles.mt_auto]}>
                    <GroupListMobile/>
                </View>

                </Card.Content>

            </Card>

            <CartTotal/>

        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
