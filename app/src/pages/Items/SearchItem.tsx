import {device} from "../../libs/static";
import React, {memo, useEffect, useRef, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, SearchBox} from "../../components";

import {selectItem} from "../../libs/function";

import AddButton from "./AddButton";
import {connect, useDispatch} from "react-redux";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";

import {AddItem} from "./ItemListTablet";
import {useNavigation} from "@react-navigation/native";


const Item = memo(({item}: any) => {

    const navigation = useNavigation();
    return (<TouchableOpacity onPress={() => {
        selectItem(item).then();
        navigation.goBack()
    }} style={[styles.noshadow]}>
        <View style={[styles.grid, styles.noWrap, styles.top, styles.p_4]}>
            <View style={[{width: '62%'}]}>
                <Paragraph style={[styles.paragraph, styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>
            </View>
            {<View style={[styles.ml_auto]}>
                <AddButton item={item}/>
            </View>}
        </View>

        <Divider/>

    </TouchableOpacity>)
}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})

const Index = ({navigation}: any) => {


    let [items, setItems] = useState([]);
    let [search, setSearch] = useState('');
    const [loading, setLoading]: any = useState(true);


    const handleSearch = async (search?: any) => {
        setLoading(false)
        if (Boolean(search)) {
            setSearch(search);
            await getItemsByWhere({itemname: search, start: 0}).then((items) => {
                setItems(items);
                setLoading(true)
            });
        }
        else{
            setSearch('');
            setItems([]);
            setLoading(true)
        }
    }



    useEffect(() => {
        device.search = search
    }, [search])

    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index} search={true} key={i.item.key || i.item.productid}/>
        );
    };

    return (
        <Container>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[{marginTop: 10}]}>
                    <SearchBox handleSearch={handleSearch} autoFocus={true}  placeholder="Search Item..."/>
                </View>

                <Card style={[styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent]}>

                        {loading && <FlatList
                            data={items}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderitems}
                            ListEmptyComponent={Boolean(search.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No
                                        result found</Text>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> Tap
                                        to Create New Item.</Text>
                                </View>
                                <AddItem navigation={navigation}/>
                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search
                                    Item from here</Text>
                            </View>}
                            keyExtractor={item => item.itemid}
                        />}
                    </Card.Content>
                </Card>

            </View>
        </Container>

    )

}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
