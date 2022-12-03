import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, Text, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";

import {styles} from "../../theme";
import {appLog, isRestaurant, selectItem, toCurrency} from "../../libs/function";
import {Card, Divider, List, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import AddButton from "./AddButton";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import {AddItem} from "./ItemListTablet";
import {useNavigation} from "@react-navigation/native";
import GroupListMobile from "./GroupListMobile";
import CartTotal from "../Cart/CartTotal";
import Avatar from "../../components/Avatar";
import {ItemDivider} from "../../libs/static";
import store from "../../redux-store/store";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import GroupHeading from "./GroupHeading";


const Item = memo(({item}: any) => {
    //item = JSON.parse(item?.data);

    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;
    const hasRestaurant = isRestaurant();
    const hasKot = Boolean(item?.kotid);

    return (
        <List.Item
            style={[styles.listitem,{paddingTop:5}]}
            key={item.itemid}
            title={item.itemname}
            titleStyle={{textTransform: 'capitalize'}}
            titleNumberOfLines={2}
            description={()=>{
                return <View style={[styles.grid, styles.middle]}>
                    {hasRestaurant && <View style={[styles.mr_1]}>
                        <VegNonVeg type={item.veg}/>
                    </View>}
                    <Paragraph style={[styles.paragraph, styles.text_xs]}>
                        {toCurrency(baseprice)}
                    </Paragraph>
                </View>
            }}
            onPress={() => {
                !Boolean(item?.productqnt) && selectItem(item)
            }}
            left={() => <View><Avatar label={item.itemname} value={item.itemid} fontsize={14} size={42}/></View>}
            right={() => {

                if(Boolean(item?.productqnt) && !hasKot){
                    return <View><AddButton item={item} page={'itemlist'}/></View>
                }
                return  <List.Icon icon="plus"/>
            }}
        />
    )

    return (<TouchableOpacity onPress={() => {
        !Boolean(item?.productqnt) && selectItem(item)
    }} style={[styles.noshadow]}>
        <View>
            <View>
                <View style={[styles.grid, styles.top, styles.noWrap, styles.p_4]}>

                    <View>
                        <Avatar label={item.itemname} value={item.itemid} fontsize={12} size={35}/>
                    </View>

                    <View style={[styles.w_auto,styles.ml_2]}>
                        <Paragraph style={[styles.paragraph, styles.text_sm, styles.bold]}>{item.itemname}</Paragraph>

                        <View style={[styles.grid, styles.middle]}>
                            {hasRestaurant && <View style={[styles.mr_1]}>
                                <VegNonVeg type={item.veg}/>
                            </View>}
                            <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                {toCurrency(baseprice)}
                            </Paragraph>
                        </View>
                    </View>

                    {<View style={[styles.ml_auto]}>
                        {
                            (Boolean(item?.productqnt) && !hasKot) ? <AddButton item={item} page={'itemlist'}/> : <>
                                <View style={[styles.grid, styles.middle, {
                                    minWidth: 50,
                                    borderRadius: 5,
                                    padding: 5,
                                    backgroundColor: styles.secondary.color
                                }]}>
                                    <Paragraph
                                        style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, styles.px_6, {color: styles.primary.color}]}> Add </Paragraph>
                                </View></>
                        }

                    </View>}

                </View>

            </View>

        </View>

    </TouchableOpacity>)
}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})


const Index = (props: any) => {

    const {selectedgroup, invoiceitems} = props;

    const navigation = useNavigation()

    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);


    useEffect(() => {

        /*if(sGroup!==selectedgroup){
            setDataSource([])
            setStart(0)
            sGroup = selectedgroup;
        }*/

        getItemsByWhere({itemgroupid: selectedgroup}).then((newitems: any) => {

            if (Boolean(newitems.length > 0)) {
                newitems = newitems?.map((i: any) => {
                    const find = invoiceitems.filter((ii: any) => {
                        return +i.itemid === +ii.itemid;
                    })
                    if (Boolean(find) && Boolean(find[0])) {
                        return find[0]
                    }
                    return i;
                })
                setDataSource([...newitems]); //...dataSource,
            } else {
                setDataSource([]);
            }
            setLoading(true)
        });


    }, [selectedgroup, invoiceitems])


    /*const onEndReached = () => {
        setStart(++start)
    }*/


    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index} key={item.productid}/>
    }, [selectedgroup]);


    if (!loading) {
        return <></>
    }

    return (
        <>
            <Card style={[styles.card,styles.h_100, styles.flex,{marginBottom:0}]}>

                <Card.Content style={[styles.cardContent]}>

                <GroupHeading/>

                    <FlatList
                        data={dataSource}
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

                <View>
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
