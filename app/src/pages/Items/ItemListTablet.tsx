import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, RefreshControl, Text, TouchableOpacity, View} from "react-native";

import {connect, useDispatch} from "react-redux";
import {styles} from "../../theme";
import {isRestaurant, selectItem, toCurrency} from "../../libs/function";
import {Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import Button from "../../components/Button";



export const AddItem = ({navigation,search}: any) => {

    const dispatch = useDispatch()

    return (
        <View style={[]}>

            <View style={[styles.grid, styles.center]}>
                <Button
                    more={{color:'white'}}
                    secondbutton={true}
                    onPress={async () => {
                        navigation.navigate("AddEditItemNavigator",{search:search});
                    }}> + Create Item
                </Button>
            </View>
        </View>
    )
}


const Item = memo(({item}: any) => {
    const {veg} = item;
    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;
    const hasRestaurant = isRestaurant()

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
        <Paragraph style={[styles.paragraph, styles.text_xs]}>
            {toCurrency(baseprice)}
        </Paragraph>
    </TouchableOpacity>)
}, (r1, r2) => {
    return (r1.item.itemid === r2.item.itemid);
})


const Index = (props: any) => {

    const {selectedgroup, navigation} = props;


    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);

    const getItems = async (refresh = false) => {
        if (Boolean(selectedgroup)) {
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

    if (!loading) {
        return <></>
    }


    return (
        <>
            <FlatList
                data={dataSource}
                renderItem={renderItem}
                keyboardDismissMode={'on-drag'}
                keyboardShouldPersistTaps={'always'}
                numColumns={3}
                getItemLayout={(data, index) => {
                    return {length: 100, offset: 100 * index, index};
                }}
                /*ListFooterComponent={() => {
                    return dataSource.length !== 0 ? <View>
                        <TouchableOpacity onPress={async () => {
                            navigation.navigate('AddEditItem')

                        }}>
                            <Paragraph  style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>+ Add Item</Paragraph>
                        </TouchableOpacity>
                    </View> : <></>
                }}*/
                /*onMomentumScrollEnd={onEndReached}
                onEndReachedThreshold={0.5}*/
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => getItems(true)}
                    />
                }
                ListEmptyComponent={<View>
                    <View style={[styles.p_6]}>
                        <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> Start
                            building your item library.</Text>
                        <Text style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> Tap
                            Create Item to begin.</Text>
                    </View>
                    <AddItem navigation={navigation}/>
                </View>}
                keyExtractor={item => item.itemid}
            />

        </>
    )
}


const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(memo(Index));
