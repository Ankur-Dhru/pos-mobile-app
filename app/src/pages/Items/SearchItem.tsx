import {device, ItemDivider} from "../../libs/static";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card, Divider, List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, SearchBox} from "../../components";

import {appLog, isRestaurant, selectItem, toCurrency} from "../../libs/function";

import AddButton from "./AddButton";
import {connect, useDispatch} from "react-redux";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";

import {AddItem} from "./ItemListTablet";
import {useNavigation} from "@react-navigation/native";
import CartTotal from "../Cart/CartTotal";
import {Item} from "./ItemListMobile";

/*const Item = memo(({item}: any) => {

    const navigation = useNavigation();

    return (
        <List.Item
            style={[styles.listitem]}
            key={item.itemid}
            title={item.itemname}
            titleStyle={[styles.bold,{textTransform: 'capitalize'}]}

            onPress={() => {
                selectItem(item).then();
                //navigation.goBack()
            }}

            right={() => {
                return  <AddButton item={item}/>
            }}
        />
    )

}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})*/

const Index = ({navigation,invoiceitems}: any) => {


    let [items, setItems]:any = useState([]);
    let [search, setSearch] = useState('');
    const [loading, setLoading]: any = useState(true);


    const handleSearch = async (search?: any) => {
        setLoading(false)
        if (Boolean(search)) {
            setSearch(search);
            await getItemsByWhere({itemname: search, start: 0}).then((items) => {
                mergeVoucherItem(items)
                setLoading(true)
            });
        }
        else{
            setSearch('');
            setItems([]);
            setLoading(true)
        }
    }

    const mergeVoucherItem = (items?:any) => {
        let newitems = items?.map((i: any) => {
            const find = invoiceitems.filter((ii: any) => {
                return ((+i.itemid === +ii.itemid) && Boolean(ii.added));
            })
            if (Boolean(find) && Boolean(find[0])) {
                return find[0]
            }
            return {...i,productqnt:0}
        })
        setItems(newitems);
    }

    useEffect(()=>{
        mergeVoucherItem(items)
    },[invoiceitems])



    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index} key={item.key || item.productid}/>
    }, [search]);

    return (
        <Container style={{backgroundColor:'white',padding:0}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>


                <View style={[{padding: 10}]}>
                    <SearchBox handleSearch={handleSearch} autoFocus={true}  onIconPress={() => navigation.goBack()}
                               icon={{ source: 'arrow-left', direction: 'auto' }} placeholder="Search Item..."/>
                </View>

                <Card style={[styles.card,styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent,{paddingVertical:0}]}>

                        {loading && <FlatList
                            data={items}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            ItemSeparatorComponent={ItemDivider}
                            ListEmptyComponent={Boolean(search.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No result found</Text>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> Tap  to Create New Item.</Text>
                                </View>
                                <AddItem navigation={navigation} search={search}/>
                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search Item from here</Text>
                            </View>}
                            keyExtractor={item => item.itemid}
                        />}
                    </Card.Content>
                </Card>


                {!device.tablet &&  <View style={[styles.p_3]}>
                    <CartTotal/>
                </View>}

            </View>
        </Container>

    )

}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
