import React, {memo, useCallback, useEffect, useState} from "react";

import {FlatList, View,  TouchableOpacity} from "react-native";

import {connect} from "react-redux";

import {localredux} from "../../libs/static";
import {styles} from "../../theme";
import {appLog, clone, isRestaurant, selectItem, toCurrency} from "../../libs/function";
import {Divider, Paragraph} from "react-native-paper";
import VegNonVeg from "./VegNonVeg";
import Avatar from "../../components/Avatar";
import AddButton from "./AddButton";




const hasRestaurant = isRestaurant()

const Item = memo(({item}:any) => {

    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;
    const hasKot = Boolean(item?.kotid);
    const {veg} = item;

    return (<TouchableOpacity onPress={() => {!Boolean(item?.productqnt) && selectItem(item)}}
                              style={[styles.noshadow]}>

        <View
            style={[{backgroundColor: hasKot ? styles.yellow.color : ''}]}>
            <View>
                <View style={[styles.autoGrid, styles.noWrap, styles.top,styles.p_4]}>
                    {<View>
                        <Avatar label={item.itemname} value={1} fontsize={15} lineheight={30} size={35}/>
                    </View>}
                    <View style={[styles.ml_2,{width:'62%'}]}>
                        <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>

                        <View style={[styles.grid, styles.justifyContentSpaceBetween]}>

                            {<Paragraph style={[styles.paragraph, styles.text_xs]}>
                                {toCurrency(baseprice * (item?.productqnt || 1))}
                            </Paragraph>}

                        </View>

                        {hasRestaurant && <View style={[styles.absolute, {top: 3, right: 3}]}>
                            <VegNonVeg type={veg}/>
                        </View>}

                    </View>

                    {<View  style={[styles.ml_auto]}>
                        {
                            (Boolean(item?.productqnt) && !hasKot) ? <AddButton item={item} page={'itemlist'} /> : <>
                                <View style={[styles.grid, styles.middle, {
                                    minWidth: 50,
                                    borderRadius: 5,
                                    padding:5,
                                    backgroundColor: styles.secondary.color
                                }]}>
                                    <Paragraph  style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter,styles.px_6, {color: styles.primary.color}]}> Add </Paragraph>
                                </View></>
                        }

                    </View>}

                </View>



            </View>

        </View>

        <Divider/>

    </TouchableOpacity>)
},(r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})



const Index = (props: any) => {

    const {selectedgroup,invoiceitems} = props;

    const {groupItemsData}:any = localredux

    let [items,setItems] = useState(clone(groupItemsData[selectedgroup]));

    useEffect(() => {
        let finditems = clone(groupItemsData[selectedgroup]);

        if(Boolean(items)){

            finditems = finditems.map((i: any) => {
                const find = invoiceitems.filter((ii: any) => {
                    return i.itemid === ii.itemid;
                })
                if(Boolean(find) && Boolean(find[0])) {
                    return  find[0]
                }
                return i;
            })
        }

        setItems(finditems);

    }, [selectedgroup,invoiceitems])




    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} index={index}  key={item.productid} />
    }, [selectedgroup]);

    if(items?.length === 0) {
        return <></>
    }

    return (
        <>
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
        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(Index);
