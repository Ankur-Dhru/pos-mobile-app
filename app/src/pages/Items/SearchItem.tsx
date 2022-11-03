import {localredux} from "../../libs/static";
import React, {memo, useEffect, useState} from "react";
import {FlatList, SafeAreaView, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {SearchBox} from "../../components";

import {appLog, filterArray, selectItem} from "../../libs/function";

import AddButton from "./AddButton";
import {connect, useDispatch} from "react-redux";
import {setModal} from "../../redux-store/reducer/component";
import {getItemsByWhere, readTable} from "../../libs/Sqlite/selectData";
import {TABLE} from "../../libs/Sqlite/config";
import {AddItem} from "./ItemListTablet";


const Item = memo(({item}:any) => {

    const dispatch = useDispatch()

    return (<TouchableOpacity onPress={() => {
        selectItem(item);
        dispatch(setModal({visible:false}))
    }} style={[styles.noshadow]}>
        <View style={[styles.grid, styles.noWrap, styles.top,styles.p_4]}>
            <View style={[{width:'62%'}]}>
                <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>
            </View>
            {<View  style={[styles.ml_auto]}>
                <AddButton item={item}  />
            </View>}
        </View>

        <Divider/>

    </TouchableOpacity>)
},(r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})

const Index = ( ) => {

    let [items, setItems] = useState([]);
    let [search,setSearch] = useState('');
    const [loading,setLoading]:any = useState(false);


    const handleSearch = async (search:any) => {
        if (Boolean(search) && search.length>3) {
            setSearch(search);
            await getItemsByWhere({itemname:search,start:0}).then((items)=>{
                setItems(items);
                setLoading(true)
            });
        }
    }

    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index} search={true} key={i.item.key || i.item.productid}/>
        );
    };

    return (



            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[styles.grid, styles.middle]}>
                    <View style={[styles.flexGrow]}>
                        <SearchBox handleSearch={handleSearch} autoFocus={true} placeholder="Search Item"/>
                    </View>

                </View>

                <Card style={[styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent]}>
                        {loading &&  <FlatList
                            data={items}
                            renderItem={renderitems}
                            ListEmptyComponent={<AddItem searchtext={search} />}
                            keyExtractor={item => item.itemid}
                        />}
                    </Card.Content>
                </Card>
            </View>


    )

}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
