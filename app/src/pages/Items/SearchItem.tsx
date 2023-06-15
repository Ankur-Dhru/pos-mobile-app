import {device, ItemDivider} from "../../libs/static";
import React, {useCallback, useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, ProIcon, SearchBox} from "../../components";

import {appLog, selectItem} from "../../libs/function";
import {connect} from "react-redux";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";

import {AddItem, ItemView} from "./ItemListTablet";
import CartTotal from "../Cart/CartTotal";


const Index = ({navigation, invoiceitems}: any) => {


    let [items, setItems]: any = useState([]);
    let [search, setSearch] = useState('');
    const [loading, setLoading]: any = useState(true);


    const handleSearch = async (search?: any,event?:any) => {
        setLoading(false)
        if (Boolean(search)) {
            setSearch(search);
            await getItemsByWhere({itemname: search, start: 0}).then((items) => {
                if(event === 'submit' && items.length === 1){
                    selectItem(items[0]).then();
                    navigation.goBack()
                }
                mergeVoucherItem(items)
                setLoading(true)
            });
        } else {
            setSearch('');
            setItems([]);
            setLoading(true)
        }
    }

    const mergeVoucherItem = (items?: any) => {
        let newitems = items?.map((i: any) => {
            const find = invoiceitems?.filter((ii: any) => {
                return ((+i.itemid === +ii.itemid) && Boolean(ii.added));
            })
            if (Boolean(find) && Boolean(find[0])) {
                return find[0]
            }
            return {...i, productqnt: 0}
        });
        setItems(newitems);
    }

    useEffect(() => {
        mergeVoucherItem(items)
    }, [invoiceitems])

    const onRead = (value?: any) => {
        appLog('value', value)
    }


    const renderItem = useCallback(({item, index}: any) => {
        return <ItemView displayType={'flatlist'}  item={item}   index={index}
                                key={item.productid} search={true} />
    }, [search]);

    return (
        <Container style={{backgroundColor: 'white', padding: 0}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[styles.grid, styles.middle, styles.justifyContent, {padding: 10}]}>
                    <View style={[styles.w_auto]}>
                        <SearchBox handleSearch={handleSearch} autoFocus={true} onIconPress={() => navigation.goBack()}
                                   icon={{source: 'arrow-left', direction: 'auto'}} placeholder="Search Item..."/>
                    </View>
                    <View>
                        <TouchableOpacity onPress={async () => {
                            navigation.replace('ScanItem');
                        }}>
                            <Paragraph style={[styles.paragraph, {marginTop: 10}]}><ProIcon
                                name={'scanner-gun'}/></Paragraph></TouchableOpacity>
                    </View>
                </View>


                <Card style={[styles.card, styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent, {paddingVertical: 0}]}>

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
                                </View>
                                <AddItem navigation={navigation} search={search}/>
                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search Item from here</Text>
                            </View>}
                            keyExtractor={item => item.itemid}
                        />}
                    </Card.Content>
                </Card>


                {!device.tablet &&
                    <CartTotal/>
                 }

            </View>
        </Container>

    )

}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
