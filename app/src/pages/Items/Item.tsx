import React, {memo, useEffect, useState} from "react";
import {
    appLog,
    getDefaultCurrency,
    isEmpty,
    isRestaurant,

    setItemRowData,

    toCurrency
} from "../../libs/function";
import {Text, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {useDispatch} from "react-redux";
import {setItemDetail} from "../../redux-store/reducer/item-detail";
import AddButton from "./AddButton";
import {setAlert, setBottomSheet} from "../../redux-store/reducer/component";
import ItemDetail from "./ItemDetail";
import AddonActions from "./AddonActions";
import {device, isDevelopment, localredux} from "../../libs/static";
import Avatar from "../../components/Avatar";
import VegNonVeg from "./VegNonVeg";
import {setCartItems} from "../../redux-store/reducer/cart-data";
import {addItem, getProductData} from "../../libs/item-calculation";
import moment from "moment";
import store from "../../redux-store/store";
import Item from "../Cart/Item";
import {ProIcon} from "../../components";

const {v4: uuid} = require('uuid')

const Index = memo((props: any) => {


    let {item,theme:{colors}} = props;

    if (!Boolean(item)) {
        item = {}
    }

    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;
    const{unit}:any = localredux.initData

    const hasRestaurant = isRestaurant()


    const dispatch = useDispatch();
    const [product, setProduct] = useState(item || {});


    useEffect(() => {
        setProduct(item)
    }, [item])


    const selectItem = async (item: any) => {



        const {addongroupid, addonid} = item?.addtags || {addongroupid: [], addonid: []}


        item = {
            ...item,
            key: uuid()
        }

        let start = moment();


        if (Boolean(addongroupid.length) || Boolean(addonid.length)) {

            item = {
                ...item,
                productqnt: item.productqnt || 0,
                hasAddon: true
            }

            await dispatch(setItemDetail(item));

            if (!Boolean(item.productqnt)) {
                await dispatch(setBottomSheet({
                    visible: true,
                    height: '80%',
                    component: () => <ItemDetail/>
                }))
            } else {
                await dispatch(setBottomSheet({
                    visible: true,
                    height: '20%',
                    component: () => <AddonActions product={item}/>
                }))
            }

        } else {
            const itemRowData:any = setItemRowData(item);
            item = {
                ...item,
                ...itemRowData,
            }
            await  dispatch(setCartItems(item))
        }

        let end = moment();
        var duration = moment.duration(end.diff(start));

        if(isDevelopment) {
            dispatch(setAlert({visible: true, message: duration.asMilliseconds()}))
        }

    }

    const {veg} = product;

    if (device.tablet) {
        return (

            <TouchableOpacity onPress={() => selectItem(product)} style={[styles.flexGrow,styles.center,styles.middle, {
                width: 110,
                padding: 10,
                margin: 5,
                backgroundColor: styles.secondary.color,
                borderRadius: 5
            }]}>
                <Paragraph
                    style={[styles.paragraph, styles.bold, styles.text_xs, {textAlign: 'center'}]}>{product.itemname}</Paragraph>

                {hasRestaurant && <View style={[styles.absolute, {top: 3, right: 3}]}>
                    <VegNonVeg type={veg}/>
                </View>}

            </TouchableOpacity>
        )
    }

    const hasKot = Boolean(product?.kotid);

    return (
        <TouchableOpacity onPress={() => {selectItem(product)}}
                          style={[styles.noshadow]}>

            <View
                style={[{backgroundColor: hasKot ? '#fdaa2960' : ''}]}>
                <View>
                    <View style={[styles.autoGrid, styles.noWrap, styles.top,styles.p_4]}>
                        {<View>
                            <Avatar label={product.itemname} value={1} fontsize={15} lineheight={30} size={35}/>
                        </View>}
                        <View style={[styles.ml_2,{width:'62%'}]}>
                            <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs]}>{product.itemname}</Paragraph>
                            <View style={[styles.grid, styles.justifyContentSpaceBetween]}>

                                {<Paragraph style={[styles.paragraph, styles.text_xs]}>
                                    {toCurrency(baseprice * (product?.productqnt || 1))}
                                </Paragraph>}

                            </View>
                        </View>

                        {<View  style={[styles.ml_auto]}>
                            {
                                Boolean(product?.productqnt) && !hasKot && <AddButton item={product} page={'itemlist'} />
                            }
                            {
                                !Boolean(product?.productqnt) && <>
                                    <View style={[styles.grid, styles.middle, {
                                        minWidth: 50,
                                        borderRadius: 5,
                                        padding:5,
                                        backgroundColor: styles.secondary.color
                                    }]}>

                                        <Paragraph  style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter,styles.px_6, {color: colors.primary}]}> Add </Paragraph>

                                    </View></>
                            }
                        </View>}

                    </View>



                </View>

            </View>

            <Divider/>

        </TouchableOpacity>
    )
}, (r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})


export default withTheme(Index);




