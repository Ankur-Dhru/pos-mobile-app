import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, View, TouchableOpacity, ActivityIndicator} from "react-native";

import {connect} from "react-redux";

import {localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, isRestaurant, selectItem} from "../../libs/function";
import {Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import {getItemsByWhere, readTable} from "../../libs/Sqlite/selectData";


const hasRestaurant = isRestaurant()
let sGroup:any = '';

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


    let [start,setStart]:any = useState(0);

    const [loading,setLoading]:any = useState(false);

    const [dataSource, setDataSource]:any = useState([]);

    useEffect(() => {
        setLoading(true)
        if(sGroup!==selectedgroup){
            setDataSource([])
            setStart(0)
        }
        getItemsByWhere({itemgroupid: selectedgroup,start:start}).then((newitems:any) => {
            if (Boolean(newitems.length > 0)) {
                setDataSource([...dataSource,...newitems]);
            }
            setLoading(false)
        });
        sGroup = selectedgroup;
    }, [selectedgroup,start])



    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index}  key={item.productid} />
    }, [selectedgroup]);

    const onEndReached = () => {
        setStart(++start)
    }

    if(!Boolean(dataSource?.length)) {
        return <></>
    }

    return (
        <>
            <FlatList
                data={dataSource}
                renderItem={renderItem}
                numColumns={3}
                getItemLayout={(data, index) => {
                    return { length: 100, offset: 100 * index, index };
                }}
                ListFooterComponent={() => {
                    return <View style={{height: 100}}>
                        {loading ? (
                            <ActivityIndicator
                                color="black"
                                style={{margin: 15}} />
                        ) : null}
                    </View>
                }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
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
