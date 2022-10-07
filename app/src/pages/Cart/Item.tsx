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
            margin: 4,
            marginBottom:0,
            backgroundColor: haskot ? colors.thirdary : '',
            borderRadius: 5
        }]}>


            <View>
                <View style={[styles.px_5, styles.py_4,{borderRadius:5,marginBottom:5}]}>
                    <View>

                        <TouchableOpacity onPress={async () => {
                            editCartitem()
                        }}>

                            <View style={[styles.grid,]}>

                                <View style={[styles.cell, {marginTop: 3}]}>
                                    <Text>{index + 1}</Text>
                                </View>

                                <View style={[styles.cell, styles.w_auto, {paddingLeft: 0}]}>


                                    <Paragraph
                                        style={[styles.paragraph, styles.text_xs, styles.bold, styles.ellipse]}
                                        numberOfLines={1}>{item.itemname}</Paragraph>




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
                                                        {item.productqnt} {unit[item.itemunit] && unit[item.itemunit].unitcode} x
                                                    </Paragraph>

                                                    <Paragraph
                                                        style={[styles.paragraph, styles.text_xs, {paddingLeft: 5}]}>{toCurrency(item.productratedisplay || '0')} each = </Paragraph>

                                                </View>
                                            </View>

                                            <View>
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

                                                    return (
                                                        <View key={index}>
                                                            <View style={[styles.grid, styles.justifyContentSpaceBetween]}>
                                                                <View style={[styles.grid]}>
                                                                    <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                                                        {addon.itemqnt} {unit[addon.itemqntunitid] && unit[addon.itemqntunitid].unitcode} {addon.itemname} x
                                                                    </Paragraph>

                                                                    <Paragraph
                                                                        style={[styles.paragraph, styles.text_xs, {paddingLeft: 5}]}>{toCurrency(addon.itemratedisplay || '0')} each</Paragraph>

                                                                </View>

                                                                <View style={[styles.ml_auto]}>
                                                                    <Paragraph
                                                                        style={[styles.paragraph, styles.text_xs, styles.textRight, Boolean(item.itemdiscountvalue !== '0' && item.itemdiscountvalue) && {
                                                                            textDecorationLine: 'line-through',
                                                                            color: styles.red.color
                                                                        }]}>
                                                                        {toCurrency('0')}
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
                                <View style={[{paddingRight: 0}]}>

                                   {!haskot && <AddButton item={item}/>}

                                </View>
                            </View>




                        </TouchableOpacity>

                    </View>

                </View>

                {<Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>}

            </View>


        </View>

    );
},(r1, r2) => {
      return r1.item === r2.item;
})


export default withTheme(Index);

