import React, {memo, useEffect, useState} from "react";
import {
    appLog,
    getDefaultCurrency,
    isEmpty,
    isRestaurant,

    setItemRowData,

    toCurrency
} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Divider, Paragraph} from "react-native-paper";
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

const {v4: uuid} = require('uuid')

const Index = memo((props: any) => {


    let {item} = props;

    if (!Boolean(item)) {
        item = {}
    }

    const pricingtype = item?.pricing?.type;
    const baseprice = item?.pricing?.price?.default[0][pricingtype]?.baseprice || 0;

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
        <TouchableOpacity onPress={() =>   selectItem(product)}
                          style={[styles.noshadow]}>

            <View
                style={[styles.grid, styles.p_5, styles.noWrap, styles.top, styles.justifyContentSpaceBetween, {backgroundColor: hasKot ? '#fdaa2960' : ''}]}>
                <View style={{width: '60%'}}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>
                        {<View style={[styles.py_3]}>
                            <Avatar label={product.itemname} value={1} fontsize={15} lineheight={30} size={35}/>
                        </View>}
                        <View style={[styles.ml_2]}>
                            <Paragraph style={[styles.bold, styles.paragraph]}>{product.itemname}</Paragraph>
                        </View>
                    </View>
                </View>
                {<View>
                    {
                        Boolean(product?.productqnt) && !hasKot &&
                        <AddButton product={product} />
                    }
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>{toCurrency(baseprice)}</Paragraph>
                </View>}
            </View>

            <Divider/>

        </TouchableOpacity>
    )
}, (r1, r2) => {
    return r1.item.itemid === r2.item.itemid;
})


export default Index;




