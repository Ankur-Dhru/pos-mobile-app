import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";

import {styles} from "../../theme";
import {
    appLog,
    clone,
    getItemImage,
    isRestaurant,
    objToArray,
    selectItem,
    sortByGroup,
    toCurrency
} from "../../libs/function";
import {Card, Divider, List, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import AddButton from "./AddButton";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import {AddItem,  ItemView} from "./ItemListTablet";
import {useNavigation} from "@react-navigation/native";
import GroupListMobile from "./GroupListMobile";
import CartTotal from "../Cart/CartTotal";
import Avatar from "../../components/Avatar";
import {ItemDivider, localredux, urls} from "../../libs/static";
import GroupHeading from "./GroupHeading";
import {setSelected} from "../../redux-store/reducer/selected-data";


let itemslist:any = [];


export const getCombos = (selectedgroup:any) => {
    let combogroup: any = [];
    if(Boolean(localredux.initData?.combogroup)) {

        combogroup = Object.keys(localredux.initData?.combogroup).filter((key: any) => {
            const group = localredux.initData?.combogroup[key];
            return group.categoryid === selectedgroup
        }).map((key: any) => {
            const group = localredux.initData?.combogroup[key];


            return {
                itemname: group.itemgroupname,
                comboid: key,
                categoryid: group.categoryid,
                itemid: group.categoryid
            }
        });
    }

    return combogroup
}


const Index = (props: any) => {

    const {selectedgroup, invoiceitems,gridview,grouplist} = props;

    const navigation = useNavigation()

    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);
    const [subgroup, setSubGroup]: any = useState([]);
    const [selectedsubgroup, setSelectedsubgroup]: any = useState([]);


    const [hasImage, setHasImage]: any = useState(false);


    const updateItems = (items:any) => {
        return  items?.map((i: any) => {
            const find = invoiceitems.filter((ii: any) => {
                return ((+i.itemid === +ii.itemid) && Boolean(ii.added));
            })
            if (Boolean(find) && Boolean(find[0])) {
                return find[0]
            }
            return i;
        })
    }

    useEffect(() => {
        setItems(itemslist);
    }, [invoiceitems])


    const setItems = (newitems:any) => {
        const combogroup = getCombos(selectedgroup)
        if (Boolean(newitems.length > 0)) {
            let items = updateItems(newitems)
            setDataSource([...items,...combogroup]);

            let checkimage = items.filter((item:any)=>{
                return Boolean(item?.itemimage)
            })
            setHasImage(Boolean(checkimage.length));
        } else {
            setDataSource([...combogroup]);
        }
        setLoading(true)
    }


    useEffect(() => {

        let groups: any = Object.values(grouplist).filter((group:any)=>{
            return group.itemgroupmid === selectedgroup
        })
        setSubGroup(groups)

        getItemsByWhere({itemgroupid: selectedsubgroup || selectedgroup}).then((newitems: any) => {
            itemslist = clone(newitems)
            setItems(newitems)
        });
    }, [selectedgroup,selectedsubgroup])


    const renderItem = useCallback(({item, index}: any) => {

        if(gridview) {
            if(true) {
                return <ItemView displayType={'withimage'}  item={item} index={index}
                                      key={item.productid || item.categoryid}/>
            }
            else{
                return <ItemView displayType={'withoutimage'}  item={item} index={index}
                                      key={item.productid || item.categoryid}/>
            }
        }
        else{
            return <ItemView  displayType={'flatlist'}  item={item}  index={index}
                                     key={item.productid || item.categoryid}/>
        }
    }, [selectedgroup,gridview,hasImage]);


    if (!loading) {
        return <></>
    }

    return (
        <>
            <Card style={[styles.card,styles.h_100, styles.flex,]}>

                <Card.Content style={[styles.cardContent]}>

                <GroupHeading  />

                    <View>
                        {
                            subgroup.map((group:any)=>{
                                return <TouchableOpacity onPress={()=>{
                                    setSelectedsubgroup(group.itemgroupid)
                                    // appLog('group',group)
                                }}><Paragraph>{group.itemgroupname}</Paragraph></TouchableOpacity>
                            })
                        }
                    </View>


                    <View style={[styles.h_100]} key={gridview}>
                    <FlatList
                        data={dataSource.filter((item:any)=>{
                            return !Boolean(item.groupid) && !item.isGrouped
                        })}
                        keyboardDismissMode={'on-drag'}
                        keyboardShouldPersistTaps={'always'}
                        renderItem={renderItem}
                        getItemLayout={(data, index) => {
                            return {length: 100, offset: 100 * index, index};
                        }}
                        numColumns={gridview?3:1}
                        ItemSeparatorComponent={ItemDivider}
                        /*onMomentumScrollEnd={onEndReached}
                        onEndReachedThreshold={0.5}*/

                        ListFooterComponent={() => {
                            return <View style={{height: 100}}></View>
                        }}
                        ListEmptyComponent={<View>
                            <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> Start
                                    building your item library.</Text>

                            </View>
                            <AddItem navigation={navigation}/>
                        </View>}
                    />
                    </View>

                <View style={[styles.mt_auto]}>
                    <GroupListMobile gridview={gridview}/>
                </View>

                </Card.Content>

            </Card>

            <CartTotal/>

        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    selectedgroup: state.selectedData.group?.value,
    grouplist: state.groupList,
    gridview: state.localSettings?.gridview,
})

export default connect(mapStateToProps)(Index);
