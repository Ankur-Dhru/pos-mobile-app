import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, View,Text, Dimensions} from "react-native";

import {connect} from "react-redux";

import Item from "./Item";
import CartItem from "../Cart/Item";
import {device, localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, clone, filterArray} from "../../libs/function";
import {Paragraph} from "react-native-paper";

const {height, width} = Dimensions.get('window');
const dim = Dimensions.get('screen');


const Index = (props: any) => {

    const {selectedgroup,search} = props;

    const {groupItemsData,itemsData}:any = localredux

    appLog('selectedgroup',selectedgroup)

    let [items,setItems] = useState(groupItemsData[selectedgroup]);

    useEffect(() => {
        let finditems = groupItemsData[selectedgroup];
        setItems(finditems);
    }, [selectedgroup])

    useEffect(() => {
        let finditems;
        if (Boolean(search)) {
            finditems = filterArray(Object.values(itemsData), ['itemname', 'uniqueproductcode'], search,false)
        }
        setItems(finditems);
    }, [search])




    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index}  key={item.productid} />
    }, [selectedgroup]);

    appLog('itemlist tablet')

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
