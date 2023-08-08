import React, {useCallback, useEffect, useState} from "react";

import {FlatList, Text, View} from "react-native";

import {connect} from "react-redux";

import {styles} from "../../theme";
import {clone, prelog} from "../../libs/function";
import {Card} from "react-native-paper";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import {AddItem, ItemView} from "./ItemListTablet";
import {useNavigation} from "@react-navigation/native";
import GroupListMobile from "./GroupListMobile";
import CartTotal from "../Cart/CartTotal";
import {ItemDivider, localredux} from "../../libs/static";
import GroupHeading from "./GroupHeading";
import PaxesSelection from "./PaxesSelection";


let itemslist: any = [];


export const getCombos = (selectedgroup: any) => {
    let combogroup: any = [];
    if (Boolean(localredux.initData?.combogroup)) {

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

    const {selectedgroup, invoiceitems, gridView,currentpax} = props;

    const navigation = useNavigation()

    const [loading, setLoading]: any = useState(false);

    const [dataSource, setDataSource]: any = useState([]);


    const [hasImage, setHasImage]: any = useState(false);


    const updateItems = (items: any) => {
        return items?.map((i: any) => {
            const find = invoiceitems.filter((item:any)=>{
                return item?.pax === currentpax || !Boolean(item?.pax)
            }).filter((ii: any) => {
                return ((+i.itemid === +ii.itemid) && Boolean(ii.added));
            })
            if (Boolean(find) && Boolean(find[0])) {
                return find[0]
            }
            return i;
        })
    }

    useEffect(() => {
        updateItems(itemslist);
    }, [currentpax])

    useEffect(() => {
        setItems(itemslist);
    }, [invoiceitems])


    const setItems = (newitems: any) => {

        const lastgroup = selectedgroup[selectedgroup.length - 1];

        const combogroup = getCombos(lastgroup)

        if (Boolean(newitems?.length > 0)) {
            let items = updateItems(newitems)

            setDataSource([...items, ...combogroup]);

            let checkimage = items.filter((item: any) => {
                return Boolean(item?.itemimage)
            })
            setHasImage(Boolean(checkimage.length));
        } else {
            setDataSource([...combogroup]);
        }
        setLoading(true)
    }


    useEffect(() => {

        const lastgroup = selectedgroup[selectedgroup.length - 1];

        getItemsByWhere({itemgroupid: lastgroup}).then((newitems: any) => {
            itemslist = clone(newitems)
            setItems(newitems)
        });
    }, [selectedgroup,currentpax])


    const renderItem = useCallback(({item, index}: any) => {

        if (gridView) {
            if (true) {
                return <ItemView displayType={'withimage'} item={item} currentpax={currentpax} index={index}
                                 key={item.productid || item.categoryid}/>
            } else {
                return <ItemView displayType={'withoutimage'} item={item} currentpax={currentpax} index={index}
                                 key={item.productid || item.categoryid}/>
            }
        } else {
            return <ItemView displayType={'flatlist'} item={item} index={index} currentpax={currentpax}
                             key={item.productid || item.categoryid}/>
        }
    }, [selectedgroup, gridView, hasImage,currentpax]);


    if (!loading) {
        return <></>
    }


    return (
        <>
            <Card style={[styles.card, styles.h_100, styles.flex,]}>

                <Card.Content style={[styles.cardContent]}>

                    <GroupHeading/>

                    <PaxesSelection/>


                    <View style={[styles.h_100]} key={gridView}>
                        <FlatList
                            data={dataSource.filter((item: any) => {
                                return !Boolean(item.groupid) && !item.isGrouped
                            })}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            getItemLayout={(data, index) => {
                                return {length: 100, offset: 100 * index, index};
                            }}
                            numColumns={gridView ? 3 : 1}
                            ItemSeparatorComponent={ItemDivider}
                            /*onMomentumScrollEnd={onEndReached}
                            onEndReachedThreshold={0.5}*/

                            ListFooterComponent={() => {
                                return <View style={{height: 200}}></View>
                            }}
                            ListEmptyComponent={<View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> Start
                                        building your item library.</Text>

                                </View>
                                <AddItem navigation={navigation} search={true}/>
                            </View>}
                        />
                    </View>

                    <View style={[styles.mt_auto]}>
                        <GroupListMobile gridview={gridView}/>
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
    currentpax:state.cartData.currentpax

})

export default connect(mapStateToProps)(Index);
