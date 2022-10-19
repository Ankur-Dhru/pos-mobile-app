import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, View, TouchableOpacity} from "react-native";

import {connect} from "react-redux";

import {localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, isRestaurant, selectItem} from "../../libs/function";
import {Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";


const hasRestaurant = isRestaurant()

const Item = memo(({item}:any) => {
    const {veg} = item;
    return (<TouchableOpacity onPress={() => selectItem(item)} style={[styles.flexGrow,styles.center,styles.middle, {
        width: 110,
        padding: 10,
        margin: 5,
        backgroundColor: styles.secondary.color,
        borderRadius: 5
    }]}>
        <Paragraph  style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center'}]}>{item.itemname}</Paragraph>
        {hasRestaurant && <View style={[styles.absolute, {top: 3, right: 3}]}>
            <VegNonVeg type={veg}/>
        </View>}
    </TouchableOpacity>)
},(r1, r2) => {
    return (r1.item.itemid === r2.item.itemid);
})


const Index = (props: any) => {

    const {selectedgroup} = props;

    const {groupItemsData,itemsData}:any = localredux;

    let [items,setItems] = useState(groupItemsData[selectedgroup]);

    useEffect(() => {
        setItems(groupItemsData[selectedgroup]);
    }, [selectedgroup])

    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index}  key={item.productid} />
    }, [selectedgroup]);

    if(items?.length === 0) {
        return <></>
    }

    return (
        <>
            <FlatList
                data={items}
                renderItem={renderItem}
                numColumns={3}
                getItemLayout={(data, index) => {
                    return { length: 100, offset: 100 * index, index };
                }}
                ListEmptyComponent={()=>{
                    return (<View style={[]}><Paragraph style={[styles.paragraph,styles.p_6,styles.muted,{textAlign:'center'}]}>No any Items</Paragraph></View>)
                }}
                keyExtractor={item => item.itemid}
            />
        </>
    )
}


const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(memo(Index));
