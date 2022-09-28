import React, {memo, useEffect,  useState} from "react";

import {FlatList, View,Text} from "react-native";

import {connect} from "react-redux";

import Item from "./Item";
import {device, localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, filterArray} from "../../libs/function";
import ActivityIndicator from "../../components/ActivityIndicator";

const Index = (props: any) => {


    const {selectedgroup} = props;

    const {groupItemsData,itemsData}:any = localredux

    const [items,setItems] = useState(groupItemsData[selectedgroup]);


    useEffect(() => {
        let finditems = groupItemsData[selectedgroup];
        /*if (Boolean(search)) {
            finditems = filterArray(Object.values(itemsData), ['itemname', 'uniqueproductcode'], search,false)
        }*/
        setItems(finditems);
    }, [selectedgroup])


    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index}  key={i.item.key || i.item.productid} />
        );
    };

    const renderitemssquare = (i: any) => {
        return (
            <View style={[styles.flexGrow, {width: 100}]}>
                <Item   item={i.item}  index={i.index}   />
            </View>
        );
    };



    if(items?.length === 0) {
        return <></>
    }

    return (
        <>
            {device.tablet ?
                <FlatList
                    data={items}
                    renderItem={renderitemssquare}
                    numColumns={2}
                    /*onEndReached={getMore}
                    onEndReachedThreshold={0}*/
                    keyExtractor={item => item.itemid}
                />
                :
                <FlatList
                    data={items}
                    renderItem={renderitems}
                    /*initialNumToRender={5}
                    maxToRenderPerBatch={10}*/
                    ListFooterComponent={() => {
                        return <View style={{height: 100}}></View>
                    }}
                />
            }
        </>
    )
}


const mapStateToProps = (state: any) => ({
    //invoiceitems: state.cartData?.invoiceitems || [],
    selectedgroup: state.selectedData.group
})

export default connect(mapStateToProps)(memo(Index));
