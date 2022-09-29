import React, {memo, useEffect,  useState} from "react";

import {FlatList, View,Text, Dimensions} from "react-native";

import {connect} from "react-redux";

import Item from "./Item";
import {device, localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, filterArray} from "../../libs/function";

const {height, width} = Dimensions.get('window');
const dim = Dimensions.get('screen');


const useScreenDimensions = () => {
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
};


const Index = (props: any) => {

    //const screenData = useScreenDimensions();

    const {selectedgroup} = props;

    const {groupItemsData}:any = localredux

    const [items,setItems] = useState(groupItemsData[selectedgroup]);


    useEffect(() => {
        let finditems = groupItemsData[selectedgroup];
        setItems(finditems);
    }, [selectedgroup])


    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index}  key={i.item.key || i.item.productid} />
        );
    };

    const renderitemssquare = (i: any) => {
        return (

                <Item   item={i.item}  index={i.index}  key={i.item.key || i.item.productid}  />

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
                    numColumns={3}
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
