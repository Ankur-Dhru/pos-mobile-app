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

    const {selectedgroup,search,invoiceitems} = props;

    const {groupItemsData,itemsData}:any = localredux


    let [items,setItems] = useState(clone(groupItemsData[selectedgroup]));

    useEffect(() => {
        let finditems = clone(groupItemsData[selectedgroup]);


        if (Boolean(search)) {
            finditems = filterArray(Object.values(clone(itemsData)), ['itemname', 'uniqueproductcode'], search,false)
        }

        if(!device.tablet) {
            if(Boolean(items)){

                finditems = finditems.map((i: any) => {
                    const find = invoiceitems.filter((ii: any) => {
                        return i.itemid === ii.itemid;
                    })
                    if(Boolean(find[0])) {
                        return  find[0]
                    }
                    return i;
                })
            }
        }

        setItems(finditems);

    }, [selectedgroup,search,invoiceitems])




    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index}  key={item.productid} />
    }, [selectedgroup]);

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
                    ListEmptyComponent={()=>{
                        return (<View style={[]}><Paragraph style={[styles.paragraph,styles.p_6,styles.muted,{textAlign:'center'}]}>No any Items</Paragraph></View>)
                    }}
                    keyExtractor={item => item.itemid}
                />
                :
                <FlatList
                    data={items}
                    renderItem={renderItem}
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
    invoiceitems: state.cartData.invoiceitems,
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(Index);
