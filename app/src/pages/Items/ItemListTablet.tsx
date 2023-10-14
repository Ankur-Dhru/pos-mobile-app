import React, {memo, useCallback, useEffect, useState} from "react";

import {
    Dimensions,
    FlatList, Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import {connect, useDispatch} from "react-redux";
import {styles} from "../../theme";
import {
    appLog,
    clone,
    getItemImage,
    getPricingTemplate,
    isRestaurant, prelog,
    selectItem,
    toCurrency
} from "../../libs/function";
import {List, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import Button from "../../components/Button";
import {device, urls} from "../../libs/static";
import {getCombos} from "./ItemListMobile";
import LinearGradient from 'react-native-linear-gradient'
import AddButton from "./AddButton";
import Avatar from "../../components/Avatar";
import GroupHeading from "./GroupHeading";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {useNavigation} from "@react-navigation/native";
//import crashlytics from "@react-native-firebase/crashlytics";
import store from "../../redux-store/store";
import PaxesSelection from "./PaxesSelection";



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


export const ItemView = memo(({item,displayType,search,currentpax}:any)=>{


    let pricingTemplate = getPricingTemplate();
    const {veg} = item;
    const pricingtype = item?.pricing?.type;
    const baseprice = (Boolean(item?.pricing?.price) && Boolean(item?.pricing?.price[pricingTemplate]) && item?.pricing?.price[pricingTemplate][0][pricingtype]?.baseprice) || item?.pricing?.price['default'][0][pricingtype]?.baseprice || 0;
    const hasRestaurant = isRestaurant();
    const hasKot = Boolean(item?.kotid);
    let imagepath = getItemImage(item)


    const navigation = device.navigation

    if(displayType === 'flatlist') {
        return <View key={item.itemid || item.comboid}>
            <List.Item
                style={[styles.listitem,{paddingTop:5}]}
                title={item.itemname}
                titleStyle={[styles.bold,{textTransform: 'capitalize'}]}
                titleNumberOfLines={2}
                description={()=>{
                    return <>{Boolean(item.uniqueproductcode) &&  <View><Paragraph>{item.uniqueproductcode}</Paragraph></View>}
                        <View style={[styles.grid, styles.middle]}>

                        {hasRestaurant && !Boolean(item.comboid) && <View style={[styles.mr_1]}>
                            <VegNonVeg type={item.veg}/>
                        </View>}
                        <Paragraph style={[styles.paragraph, styles.text_xs]}>
                            {toCurrency(baseprice)}
                        </Paragraph>
                        {
                            Boolean(item.comboid) && <Paragraph  style={[styles.paragraph, styles.text_xs]}>Group</Paragraph>
                        }
                    </View>
                    </>
                }}
                onPress={() => {

                    if(Boolean(item?.trackinventory) && item.inventorytype === 'specificidentification') {
                        navigation.navigate('ScanSerialno');
                    }
                    else if((!Boolean(item?.productqnt) && !hasKot) || (currentpax !== item?.pax)) {
                        selectItem(item).then();
                    }
                    else {
                        if (search) {
                            navigation.goBack()
                        }
                    }
                }}
                /*left={() => <View style={{marginTop:5}}><Avatar label={item.itemname} value={item.itemid || item.comboid} fontsize={14} size={40}/></View>}*/
                right={() => {

                    if(item.comboid){
                        return  <List.Icon icon="chevron-right" style={{height:35,width:35,margin:0}} />
                    }

                    if(((Boolean(item?.productqnt) && !hasKot) && (currentpax === item?.pax || (!Boolean(item?.pax))))){
                        return <View>{!Boolean(+item.productdiscountvalue)  && <AddButton item={item}  />}</View>
                    }
                    else if(Boolean(imagepath)){
                        return <View style={{width:50}}><Image
                            style={[styles.imageWidth,{borderRadius:5}]}
                            source={{uri:imagepath}}
                        /></View>
                    }
                    // return  <List.Icon icon="plus" style={{height:35,width:35,margin:0}} />
                }}
            />
        </View>
    }
    else{

            return <View key={item.itemid || item.comboid} style={[styles.flexGrow,styles.relative,styles.h_100,   styles.middle, {
                width: 115,
                maxWidth:160,
                borderColor:'white',
                margin:2,
                marginBottom:2,
                minHeight:100,
                paddingBottom:3,
            }]}>
                <TouchableOpacity onPress={() => selectItem(item)} style={[styles.w_100,styles.flex,styles.h_100,{backgroundColor: styles.secondary.color,borderRadius: 5,}]}>
                {
                    !Boolean(imagepath)  ? <View style={[styles.p_4,styles.middle]}>
                        <Paragraph  style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center'}]}>
                            {item.itemname}
                        </Paragraph>
                        <Paragraph  style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center'}]}>
                            {item.uniqueproductcode}
                        </Paragraph>

                    </View> : <>
                        <View style={[styles.w_100, ]}>

                            <View>
                                <Image
                                    style={[styles.imageWidth,{borderTopLeftRadius:7,borderTopRightRadius:7}]}
                                    source={{uri:imagepath}}
                                />
                                {/*{Boolean(imagepath) ?  <Image
                                        style={[styles.imageWidth]}
                                        source={{uri:imagepath}}
                                    /> :
                                    <Image
                                        style={[styles.imageWidth,{borderRadius:7}]}
                                        source={require('../../assets/no-img.png')}
                                    />}*/}
                            </View>

                            <LinearGradient colors={['#000000', '#00000005' ]} style={[styles.w_100,{borderRadius:5,position:'absolute'}]}>
                                <View style={[styles.p_4,styles.flex, styles.w_100,styles.center, styles.middle,]}>

                                    <Paragraph  style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center',color:'white'}]}>
                                        {item.itemname}
                                    </Paragraph>
                                    <Paragraph  style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center',color:'white'}]}>
                                        {item.uniqueproductcode}
                                    </Paragraph>

                                </View>
                            </LinearGradient>

                        </View>
                    </>
                }

                    <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs,styles.p_3,styles.mt_auto,{textAlign:'center'}]}>
                        {toCurrency(baseprice)}
                    </Paragraph>

                    {hasRestaurant  && !Boolean(item?.comboid) && <View style={[styles.absolute, {top: 3, right: 3}]}>
                        <VegNonVeg type={veg}/>
                    </View>}

                </TouchableOpacity>

                {
                    Boolean(item?.productqnt) && !hasKot  && <View style={[styles.w_100,styles.absolute,{bottom:0}]}><AddButton item={item}  /></View>
                }
            </View>
        }

},(r1,r2)=>{

    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid) && (r1.currentpax === r2.currentpax) && (r1.item.pricing === r2.item.pricing));
})







const Index = (props: any) => {

    const {selectedgroup, navigation,currentpax} = props;


    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);
    const [hasImage, setHasImage]: any = useState(false);



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
        //crashlytics().log('getItems');
        try {

            const lastgroup = selectedgroup[selectedgroup.length - 1];


            const combogroup = getCombos(lastgroup)

            if (Boolean(lastgroup)) {
                await getItemsByWhere({itemgroupid: lastgroup}).then((newitems: any) => {
                    const items = newitems.concat(combogroup);
                    let checkimage = items.filter((item:any)=>{
                        return Boolean(item?.itemimage)
                    })

                    setHasImage(Boolean(checkimage.length));
                    setDataSource(items);
                });
            }
            setLoading(true)
        }
        catch (e) {
            appLog(e)
        }
    }

    useEffect(() => {
        //crashlytics().log('selectedgroup change');
        getItems().then()
    }, [selectedgroup]) //start


    const renderItem = useCallback(({item, index}: any) => {
        if(true) {
            return <ItemView displayType={'withimage'}  item={item} currentpax={currentpax}  index={index}
                                  key={item.productid || item.categoryid}/>
        }
        else{
            return <ItemView displayType={'withoutimage'}  item={item} currentpax={currentpax}  index={index}
                                  key={item.productid || item.categoryid}/>
        }
    }, [selectedgroup,hasImage,currentpax]);


    if (!loading) {
        return <></>
    }


    return (
        <View style={[styles.flex,styles.h_100]}>

            <GroupHeading  />
            <PaxesSelection/>

        <View key={oriantation}  style={[styles.flex,styles.h_100]}>


            <FlatList
                data={dataSource.filter((item:any)=>{
                    return !Boolean(item.groupid) && !item.isGrouped
                })}

                renderItem={renderItem}
                keyboardDismissMode={'on-drag'}
                keyboardShouldPersistTaps={'always'}
                numColumns={oriantation === 'landscape'?4:2}
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
                    <AddItem navigation={navigation} search={true}/>
                </View>}
                keyExtractor={item => item.itemid}

            />

        </View>
        </View>
    )
}


const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
    currentpax:state.cartData.currentpax,
    disabledpax: state.localSettings?.disabledpax,
})

export default connect(mapStateToProps)(memo(Index));
