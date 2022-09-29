import React, {memo, useEffect, useState} from "react";
import {clone, getType, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import AddButton from "../Items/AddButton";
import {setItemDetail} from "../../redux-store/reducer/item-detail";
import {setBottomSheet} from "../../redux-store/reducer/component";
import ItemDetail from "../Items/ItemDetail";
import {connect, useDispatch} from "react-redux";
import { localredux } from "../../libs/static";


const Index = (props: any) => {

    const {item, index,  theme: {colors}, isRestaurant,hasLast} = props;
    const{unit}:any = localredux.initData

    const [product, setProduct]: any = useState(item)

    useEffect(() => {
        setProduct(item)
    }, [item])

    const editCartitem = async () => {
        if (!Boolean(product.kotid)) {
            await dispatch(setItemDetail(clone(product)));
            await dispatch(setBottomSheet({
                visible: true,
                height: '80%',
                component: () => <ItemDetail edit={true} parentsetProduct={setProduct} index={index}/>
            }))
        }
    }

    const dispatch = useDispatch()

    const haskot = Boolean(product.kotid);

    console.log('cart item render',index)


    return (

        <View style={[{
            margin: 4,
            marginBottom:0,
            backgroundColor: haskot ? colors.thirdary : '',
            borderRadius: 5
        }]}>

            <View>
                <View style={[styles.px_5, styles.py_4,(hasLast && !haskot) && {backgroundColor:colors.forthary,borderRadius:5,marginBottom:5}]}>
                    <View>

                        <TouchableOpacity onPress={async () => {
                            editCartitem()
                        }}>

                            <View style={[styles.grid,]}>

                                <View style={[styles.cell, {marginTop: 4}]}>
                                    <Text>{index + 1}</Text>
                                </View>

                                <View style={[styles.cell, styles.w_auto, {paddingLeft: 0}]}>


                                    <Paragraph
                                        style={[styles.paragraph, styles.text_sm, styles.bold, styles.ellipse]}
                                        numberOfLines={1}>{product.itemname || product.productdisplayname}</Paragraph>


                                    {!isRestaurant && <View style={[styles.grid]}>
                                        <Text style={[styles.badge, styles.text_xxs, {
                                            padding: 3,
                                            textAlignVertical: 'top',
                                            textTransform: 'uppercase',
                                            backgroundColor: product.itemtype === 'service' ? 'orange' : 'green'
                                        }]}>
                                            {product.itemtype}
                                        </Text>
                                    </View>}


                                    <View style={[styles.wrap, styles.py_2]}>
                                        {Boolean(product.notes) && <Text
                                            style={[styles.muted, styles.text_xs, {fontStyle: 'italic'}]}
                                            numberOfLines={1}>{product.notes} </Text>}

                                        {Boolean(product?.itemtags) && <>
                                            {
                                                product?.itemtags.map((tags: any) => {
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

                                        {Boolean(product.hsn) && <Paragraph
                                            style={[styles.paragraph, styles.muted, styles.text_xs]}>{product.itemtype === 'service' ? 'SAC Code' : 'HSN Code'} : {product.hsn}</Paragraph>}
                                        {Boolean(product.sku) &&
                                            <Paragraph style={[styles.paragraph, styles.muted, styles.text_xs]}>SKU
                                                : {product.sku}</Paragraph>}


                                        <View style={[styles.grid, styles.middle]}>

                                            {Boolean(product.serial) && <View style={[styles.w_auto]}>
                                                <View>
                                                    {
                                                        Object.keys(product.serial).map((key: any) => {
                                                            return (
                                                                <Paragraph>
                                                                    <Paragraph
                                                                        style={[styles.paragraph, styles.muted, styles.text_xs, styles.mr_2]}>Serial
                                                                        No
                                                                        : {getType(product.serial[key]) === 'object' ? product.serial[key].serialno : product.serial[key]}</Paragraph>
                                                                    {Boolean(product.serial[key].mfdno) && <Paragraph
                                                                        style={[styles.paragraph, styles.muted, styles.text_xs]}> MFD
                                                                        No : {product.serial[key].mfdno}</Paragraph>}
                                                                </Paragraph>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>}


                                        </View>

                                    </>}

                                </View>
                                <View style={[{paddingRight: 0}]}>

                                    {!haskot && <AddButton product={product} fromcart={true} selectItem={setProduct}/>}

                                </View>
                            </View>

                            <View style={{marginLeft: 18}}>

                                <View style={[styles.grid, styles.justifyContentSpaceBetween]}>
                                    <View>
                                        <View style={[styles.grid]}>
                                            <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                                {product.productqnt} {unit[product.productqntunitid] && unit[product.productqntunitid].unitcode} x
                                            </Paragraph>

                                            <Paragraph
                                                style={[styles.paragraph, styles.text_xs, {paddingLeft: 5}]}>{toCurrency(product.productratedisplay || '0')} each</Paragraph>


                                            {/*{!isRestaurant && <Paragraph style={[styles.paragraph, styles.text_xs, styles.textRight]}>
                                                ({tax[product.producttaxgroupid]?.taxgroupname})
                                            </Paragraph>
                                            }*/}
                                        </View>
                                    </View>

                                    <View style={[styles.ml_auto]}>
                                        <Paragraph
                                            style={[styles.paragraph, styles.text_sm, styles.textRight, Boolean(product.productdiscountvalue !== '0' && product.productdiscountvalue) && {
                                                textDecorationLine: 'line-through',
                                                color: styles.red.color
                                            }]}>
                                            {toCurrency(product.item_total_amount_display || '0')}
                                        </Paragraph>
                                    </View>
                                </View>


                                <View>
                                    {
                                        product?.itemaddon?.map((addon: any, index: any) => {

                                            return (
                                                <View key={index}>
                                                    <View style={[styles.grid, styles.justifyContentSpaceBetween]}>
                                                        <View style={[styles.grid]}>
                                                            <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                                                {addon.productqnt} {unit[addon.productqntunitid] && unit[addon.productqntunitid].unitcode} {addon.itemname} x
                                                            </Paragraph>

                                                            <Paragraph
                                                                style={[styles.paragraph, styles.text_xs, {paddingLeft: 5}]}>{toCurrency(addon.productratedisplay || '0')} each</Paragraph>

                                                        </View>

                                                        <View style={[styles.ml_auto]}>
                                                            <Paragraph
                                                                style={[styles.paragraph, styles.text_sm, styles.textRight, Boolean(product.productdiscountvalue !== '0' && product.productdiscountvalue) && {
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


                        </TouchableOpacity>

                    </View>

                </View>

                {!hasLast &&  <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>}

            </View>


        </View>

    );


}


export default withTheme(memo(Index));

