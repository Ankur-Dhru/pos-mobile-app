import React, {memo, useCallback, useEffect, useState} from "react";

import {Dimensions, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";

import {connect, useDispatch} from "react-redux";
import {styles} from "../../theme";
import {appLog, isRestaurant, selectItem, toCurrency} from "../../libs/function";
import {Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import Button from "../../components/Button";
import {localredux, urls} from "../../libs/static";
import {getCombos} from "./ItemListMobile";



export const AddItem = ({navigation,search}: any) => {

    if(Boolean(urls.localserver)){
        return <></>
    }

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
    const hasRestaurant = isRestaurant();


    return (<TouchableOpacity onPress={() => selectItem(item)} style={[styles.flexGrow, styles.center, styles.middle,  {
        width: 110,
        padding: 10,
        borderColor:'white',
        margin:2,
        marginBottom:1,
        backgroundColor: styles.secondary.color,
        borderRadius: 5
    }]}>
        <Paragraph  style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center'}]}>
            {item.itemname}
        </Paragraph>
        {hasRestaurant  && !Boolean(item?.comboid) && <View style={[styles.absolute, {top: 3, right: 3}]}>
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


    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return (dim.height >= dim.width) ? 'portrait' : 'landscape';
    };


    const [oriantation,setOrientation] = useState(isPortrait())

    useEffect(()=>{
        Dimensions.addEventListener('change', () => {
            setOrientation(isPortrait())
        });
    },[])


    const getItems = async (refresh = false) => {

        try {

            const combogroup = getCombos(selectedgroup)

            if (Boolean(selectedgroup)) {
                await getItemsByWhere({itemgroupid: selectedgroup}).then((newitems: any) => {
                    setDataSource(newitems.concat(combogroup));
                });
            }
            setLoading(true)
        }
        catch (e) {
            appLog(e)
        }
    }

    useEffect(() => {
        getItems().then()
    }, [selectedgroup]) //start


    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index} key={item.productid || item.categoryid}/>
    }, [selectedgroup]);


    if (!loading) {
        return <></>
    }



    return (
        <View key={oriantation}>


            <FlatList
                data={dataSource.filter((item:any)=>{
                    return !Boolean(item.groupid) && !item.isGrouped
                })}

                renderItem={renderItem}
                keyboardDismissMode={'on-drag'}
                keyboardShouldPersistTaps={'always'}
                numColumns={oriantation === 'landscape'?3:2}
                getItemLayout={(data, index) => {
                    return {length: 100, offset: 100 * index, index};
                }}
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

                    </View>
                    <AddItem navigation={navigation}/>
                </View>}
                keyExtractor={item => item.itemid}

            />

        </View>
    )
}


const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(memo(Index));
