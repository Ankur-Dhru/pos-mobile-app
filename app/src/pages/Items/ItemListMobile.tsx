import React, {memo, useCallback, useEffect, useState} from "react";

import {ActivityIndicator, FlatList, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";

import {styles} from "../../theme";
import {appLog, isRestaurant, selectItem, toCurrency} from "../../libs/function";
import {Divider, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import AddButton from "./AddButton";
import {getItemsByWhere, readTable} from "../../libs/Sqlite/selectData";


const hasRestaurant = isRestaurant();
let sGroup:any = '';

const Item = memo(({item}: any) => {

    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;
    const hasKot = Boolean(item?.kotid);
    const {veg} = item;

    return (<TouchableOpacity onPress={() => {
        !Boolean(item?.productqnt) && selectItem(item)
    }} style={[styles.noshadow]}>
        <View
            style={[{backgroundColor: hasKot ? styles.yellow.color : ''}]}>
            <View>
                <View style={[styles.grid, styles.top, styles.noWrap, styles.top, styles.p_4]}>
                    {<View style={[styles.mr_2]}>
                        {hasRestaurant && <View>
                            <VegNonVeg type={veg}/>
                        </View>}
                    </View>}
                    <View>
                        <Paragraph style={[styles.paragraph, styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>

                        <Paragraph style={[styles.paragraph, styles.text_xs]}>
                            {toCurrency(baseprice)}
                        </Paragraph>
                    </View>

                    {<View style={[styles.ml_auto]}>
                        {
                            (Boolean(item?.productqnt) && !hasKot) ? <AddButton item={item} page={'itemlist'}/> : <>
                                <View style={[styles.grid, styles.middle, {
                                    minWidth: 50,
                                    borderRadius: 5,
                                    padding: 5,
                                    backgroundColor: styles.secondary.color
                                }]}>
                                    <Paragraph
                                        style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, styles.px_6, {color: styles.primary.color}]}> Add </Paragraph>
                                </View></>
                        }

                    </View>}

                </View>

            </View>

        </View>

        <Divider/>

    </TouchableOpacity>)
}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})


const Index = (props: any) => {

    const {selectedgroup, invoiceitems} = props;
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
                newitems = newitems?.map((i: any) => {
                    const find = invoiceitems.filter((ii: any) => {
                        return +i.itemid === +ii.itemid;
                    })
                    if (Boolean(find) && Boolean(find[0])) {
                        return find[0]
                    }
                    return i;
                })
                setDataSource([...dataSource,...newitems]);
            }
            setLoading(false)
        });

        sGroup = selectedgroup;

    }, [selectedgroup, invoiceitems,start])



    const onEndReached = () => {
        setStart(++start)
    }


    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index} key={item.productid}/>
    }, [selectedgroup]);

    if (dataSource?.length === 0) {
        return <></>
    }


    return (
        <>
            <FlatList
                data={dataSource}
                renderItem={renderItem}
                getItemLayout={(data, index) => {
                    return {length: 100, offset: 100 * index, index};
                }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}

                ListFooterComponent={() => {
                    return <View style={{height: 100}}>
                        {loading ? (
                            <ActivityIndicator
                                color="black"
                                style={{margin: 15}} />
                        ) : null}
                    </View>
                }}
                ListEmptyComponent={() => {
                    return (<View style={[]}><Paragraph
                        style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>No any
                        Items</Paragraph></View>)
                }}
            />
        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
