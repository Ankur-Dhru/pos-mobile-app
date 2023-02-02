import React, {memo, useEffect, useState} from "react";
import {appLog, clone, getType, toCurrency} from "../../libs/function";
import {Animated, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import AddButton from "../Items/AddButton";
import {setItemDetail} from "../../redux-store/reducer/item-detail";
import {setBottomSheet} from "../../redux-store/reducer/component";
import ItemDetail from "../Items/ItemDetail";
import {connect, useDispatch} from "react-redux";
import { localredux } from "../../libs/static";

const Index = memo((props: any) => {

    const {item, index,  theme: {colors}, isRestaurant,hasLast,length} = props;
    const{unit}:any = localredux.initData

    const editCartitem = async () => {
        if (!Boolean(item.kotid)) {

            await dispatch(setItemDetail(clone(item)));
            await dispatch(setBottomSheet({
                visible: true,
                height: '80%',
                component: () => <ItemDetail edit={true}  index={index}/>
            }))
        }
    }

    const dispatch = useDispatch()

    const haskot = Boolean(item?.kotid);

    if(!Boolean(item)){
        return <></>
    }


    return (

        <View style={[{

            marginBottom:5,
            backgroundColor: haskot ? styles.yellow.color : '',
            borderRadius: 5,
        }]}>


            <View>
                <View style={[styles.p_2,{borderRadius:5}]}>
                    <View>

                        <TouchableOpacity onPress={async () => {
                            editCartitem()
                        }}>

                            <View style={[styles.grid,]}>

                                <View style={[styles.flexGrow,styles.w_auto,{paddingLeft: 0,paddingRight:10,minWidth:200}]}>


                                    <Paragraph
                                        style={[styles.paragraph,  styles.bold,styles.ml_1, {textTransform:'capitalize'}]}
                                        numberOfLines={2}>{index + 1}) {item?.itemname || item?.productdisplayname}</Paragraph>



                                    <View style={[styles.ml_1]}>

                                        <View style={[styles.wrap, styles.py_2]}>
                                            {Boolean(item.notes) && <Text
                                                style={[styles.muted, styles.text_xs, {fontStyle: 'italic'}]}
                                                numberOfLines={1}>{item.notes} </Text>}

                                            {Boolean(item?.itemtags) && <>
                                                {
                                                    item?.itemtags.map((tags: any) => {
                                                        {
                                                            return tags?.taglist.map((list: any, key: any) => {
                                                                if (list.selected) {
                                                                    return (
                                                                        <Text
                                                                            key={key}
                                                                            style={[styles.muted, styles.text_xs, {fontStyle: 'italic'}]}
                                                                            numberOfLines={1}>{tags.taggroupname} {list.name} </Text>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            </>}
                                        </View>

                                        {!isRestaurant && <>

                                            {Boolean(item.hsn) && <Paragraph
                                                style={[styles.paragraph, styles.muted, styles.text_xs]}>{item.itemtype === 'service' ? 'SAC Code' : 'HSN Code'} : {item.hsn}</Paragraph>}
                                            {Boolean(item.sku) &&
                                                <Paragraph style={[styles.paragraph, styles.muted, styles.text_xs]}>SKU
                                                    : {item.sku}</Paragraph>}


                                            <View style={[styles.grid, styles.middle]}>

                                                {Boolean(item.serial) && <View style={[styles.w_auto]}>
                                                    <View>
                                                        {
                                                            Object.keys(item.serial).map((key: any) => {
                                                                return (
                                                                    <Paragraph>
                                                                        <Paragraph
                                                                            style={[styles.paragraph, styles.muted, styles.text_xs, styles.mr_2]}>Serial
                                                                            No
                                                                            : {getType(item.serial[key]) === 'object' ? item.serial[key].serialno : item.serial[key]}</Paragraph>
                                                                        {Boolean(item.serial[key].mfdno) && <Paragraph
                                                                            style={[styles.paragraph, styles.muted, styles.text_xs]}> MFD
                                                                            No : {item.serial[key].mfdno}</Paragraph>}
                                                                    </Paragraph>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>}


                                            </View>

                                        </>}

                                        <View>

                                            <View style={[styles.grid]}>
                                                <View>
                                                    <View style={[styles.grid]}>
                                                        <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                                            {item.productqnt} {!isRestaurant && unit[item.itemunit] && unit[item.itemunit].unitcode} x {toCurrency(item.productratedisplay || '0')}  =
                                                        </Paragraph>
                                                    </View>
                                                </View>

                                                <View style={{marginLeft:3}}>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.text_xs, styles.textRight, Boolean(item.itemdiscountvalue !== '0' && item.itemdiscountvalue) && {
                                                            textDecorationLine: 'line-through',
                                                            color: styles.red.color
                                                        }]}>
                                                         {toCurrency((item.productratedisplay * item.productqnt) || '0')}
                                                    </Paragraph>
                                                </View>
                                            </View>


                                            <View>
                                                {
                                                    item?.itemaddon?.map((addon: any, index: any) => {

                                                        const pricingtype = addon.pricing?.type;
                                                        const baseprice = addon.pricing?.price?.default[0][pricingtype]?.baseprice || 0;

                                                        return (
                                                            <View key={index}>
                                                                <View style={[styles.grid]}>
                                                                    <View style={[styles.grid]}>
                                                                        <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                                                            {addon.productqnt} {!isRestaurant && unit[addon?.itemunit] && unit[addon?.itemunit].unitcode} {addon?.itemname} x
                                                                        </Paragraph>

                                                                        <Paragraph
                                                                            style={[styles.paragraph, styles.text_xs, {paddingLeft: 5}]}>{toCurrency(baseprice || '0')} = </Paragraph>

                                                                    </View>

                                                                    <View>
                                                                        <Paragraph
                                                                            style={[styles.paragraph, styles.text_xs, styles.textRight]}>
                                                                            {toCurrency(baseprice * addon.productqnt)}
                                                                        </Paragraph>
                                                                    </View>

                                                                </View>


                                                            </View>

                                                        )
                                                    })
                                                }
                                            </View>

                                        </View>

                                    </View>

                                </View>

                                <View style={[styles.flexGrow,{paddingRight: 0,marginTop:5,minWidth:100}]}>

                                   {!haskot && <AddButton item={item}/>}

                                </View>
                            </View>




                        </TouchableOpacity>

                    </View>

                </View>

            </View>


        </View>

    );
},(r1, r2) => {
        //appLog('r2.item',r2.item)
        const c1 = {productqnt:r1.item.productqnt,productrate:r1.item.productrate,itemaddon:r1.item.itemaddon,itemtags:r1.item.itemtags,notes:r1.item.notes,kotid:r1.item.kotid}
        const c2 = {productqnt:r2.item.productqnt,productrate:r2.item.productrate,itemaddon:r2.item.itemaddon,itemtags:r2.item.itemtags,notes:r2.item.notes,kotid:r2.item.kotid}

      return (JSON.stringify(c1)===JSON.stringify(c2));
})


export default withTheme(Index);

