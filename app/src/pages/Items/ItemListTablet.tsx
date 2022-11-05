import React, {memo, useCallback, useEffect, useState} from "react";

import {ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";
import {styles} from "../../theme";
import {appLog, isRestaurant, selectItem} from "../../libs/function";
import {List, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import Button from "../../components/Button";
import {setModal} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import AddEditItem from "./AddEditItem";
import AddEditCategory from "./AddEditCategory";


const hasRestaurant = isRestaurant()
let sGroup: any = '';

export const AddItem = (props:any) => {

    return (
        <View style={[]}>

            <View style={[styles.grid, styles.center]}>
                <Button
                    secondbutton={true}
                    onPress={async () => {
                        store.dispatch(setModal({
                            visible: true,
                            hidecancel: true,
                            width: 300,
                            component: () => <AddEditItem item={{}} searchtext={props.searchtext}  />
                        }))
                    }}> + Create Item
                </Button>
            </View>
        </View>
    )
}


const Item = memo(({item}: any) => {
    const {veg} = item;
    return (<TouchableOpacity onPress={() => selectItem(item)} style={[styles.flexGrow, styles.center, styles.middle, {
        width: 110,
        padding: 10,
        margin: 5,
        backgroundColor: styles.secondary.color,
        borderRadius: 5
    }]}>
        <Paragraph
            style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center'}]}>{item.itemname}</Paragraph>
        {hasRestaurant && <View style={[styles.absolute, {top: 3, right: 3}]}>
            <VegNonVeg type={veg}/>
        </View>}
    </TouchableOpacity>)
}, (r1, r2) => {
    return (r1.item.itemid === r2.item.itemid);
})


const Index = (props: any) => {

    const {selectedgroup} = props;

    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);

    const getItems = async (refresh=false) => {
        if(Boolean(selectedgroup)){
            await getItemsByWhere({itemgroupid: selectedgroup}).then((newitems: any) => {
                setDataSource(newitems);
            });
        }
        setLoading(true)
    }

    useEffect(() => {
        /*if (sGroup !== selectedgroup) {
            setDataSource([])
            setStart(0)
        }
        sGroup = selectedgroup;*/
        getItems().then()

    }, [selectedgroup]) //start




    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index} key={item.productid}/>
    }, [selectedgroup]);

    const onEndReached = () => {
       // setStart(++start)
    }

    if(!loading){
        return <></>
    }


    return (
        <>
            <FlatList
                data={dataSource}
                renderItem={renderItem}
                numColumns={3}
                getItemLayout={(data, index) => {
                    return {length: 100, offset: 100 * index, index};
                }}
                ListFooterComponent={() => {
                    return dataSource.length !== 0 ? <View>
                        <TouchableOpacity onPress={async () => {
                            store.dispatch(setModal({
                                visible: true,
                                hidecancel: true,
                                width: 300,
                                component: () => <AddEditItem item={{}}  />
                            }))
                        }}>
                            <Paragraph  style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>+ Add Item</Paragraph>
                        </TouchableOpacity>
                    </View> : <></>
                }}
                /*onMomentumScrollEnd={onEndReached}
                onEndReachedThreshold={0.5}*/
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => getItems(true)}
                    />
                }
                ListEmptyComponent={<>
                    <Paragraph style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}> Start building your item library.</Paragraph>
                    <Paragraph style={[styles.paragraph, styles.p_6,styles.text_xs,styles.muted, {textAlign: 'center'}]}> Tap Create Item to begin.</Paragraph>
                    <AddItem />
                    </>}
                keyExtractor={item => item.itemid}
            />

        </>
    )
}


const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(memo(Index));
