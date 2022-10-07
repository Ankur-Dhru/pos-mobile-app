import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, View,Text, Dimensions} from "react-native";

import {connect} from "react-redux";

import Item from "./Item";
import {device, localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, filterArray} from "../../libs/function";
import {Paragraph} from "react-native-paper";

const {height, width} = Dimensions.get('window');
const dim = Dimensions.get('screen');


/*const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));
    useEffect(() => {
        const onChange = (result:any) => {
            setScreenData(result.screen);
        };
        Dimensions.addEventListener('change', onChange);
        return () => Dimensions.removeEventListener('change', onChange);
    });
    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
    };
};*/


const Index = (props: any) => {

    //const screenData = useScreenDimensions();

    const {selectedgroup,search} = props;

    const {groupItemsData,itemsData}:any = localredux


    const [items,setItems] = useState(groupItemsData[selectedgroup]);

    useEffect(() => {
        let finditems = groupItemsData[selectedgroup];
        setItems(finditems);
    }, [selectedgroup])


    useEffect(() => {
        let finditems;
        if (Boolean(search)) {
            finditems = filterArray(Object.values(itemsData), ['itemname', 'uniqueproductcode'], search,false)
        }
        Boolean(finditems) && setItems(finditems);
    }, [search])


    const renderItem = useCallback(({item, index}: any) => <Item item={item} index={index}  key={item.key || item.productid} />, [selectedgroup]);

    if(items?.length === 0) {
        return <></>
    }

    return (
        <>
            {device.tablet ?
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    numColumns={3}
                    getItemLayout={(data, index) => {
                        return { length: 100, offset: 100 * index, index };
                    }}
                    /*onEndReached={getMore}
                    onEndReachedThreshold={0}*/
                    ListEmptyComponent={()=>{
                        return (<View style={[]}><Paragraph style={[styles.paragraph,styles.p_6,styles.muted,{textAlign:'center'}]}>No any Items</Paragraph></View>)
                    }}
                    keyExtractor={item => item.itemid}
                />
                :
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    /*initialNumToRender={5}
                    maxToRenderPerBatch={10}*/
                    getItemLayout={(data, index) => {
                        return { length: 100, offset: 100 * index, index };
                    }}
                    ListFooterComponent={() => {
                        return <View style={{height: 100}}></View>
                    }}
                    ListEmptyComponent={()=>{
                        return (<View style={[]}><Paragraph style={[styles.paragraph,styles.p_6,styles.muted,{textAlign:'center'}]}>No any Items</Paragraph></View>)
                    }}
                />
            }
        </>
    )
}


const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(memo(Index));
