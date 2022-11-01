import {localredux} from "../../libs/static";
import React, {memo, useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {SearchBox} from "../../components";

import {filterArray, selectItem} from "../../libs/function";

import AddButton from "./AddButton";
import {connect, useDispatch} from "react-redux";
import {setModal} from "../../redux-store/reducer/component";
import {readTable} from "../../libs/Sqlite/selectData";
import {TABLE} from "../../libs/Sqlite/config";


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


    useEffect(()=>{
        if(localredux.itemsData.length === 0) {
            getItems().then()
        }
    },[])

    const getItems = async () => {
        await readTable(TABLE.ITEM).then((items)=>{
            localredux.itemsData = items
        });
    }

    const {itemsData} = localredux

    const handleSearch = (search:any) => {
        if (Boolean(search) && search.length>3) {
            let finditems = filterArray(itemsData, ['itemname', 'uniqueproductcode'], search,false);
            setItems(finditems);
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
                    <FlatList
                        data={items}
                        renderItem={renderitems}
                        keyExtractor={item => item.itemid}
                    />
                </Card.Content>
            </Card>
        </View>


    )

}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
