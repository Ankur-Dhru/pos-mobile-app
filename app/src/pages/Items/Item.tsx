import React, {memo, useEffect, useState} from "react";
import {findObject, isRestaurant, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {addItem} from "../../libs/item-calculation";
import {setItemDetail} from "../../redux-store/reducer/item-detail";
import AddButton from "./AddButton";
import ProIcon from "../../components/ProIcon";
import {setBottomSheet} from "../../redux-store/reducer/component";
import ItemDetail from "./ItemDetail";
import AddonActions from "./AddonActions";
import {device} from "../../libs/static";
import Avatar from "../../components/Avatar";
import VegNonVeg from "./VegNonVeg";
//import {ReactComponent as NonVEG} from "../../assets/svg/Non_veg_symbol.svg";

const {v4: uuid} = require('uuid')

const Index = (props: any) => {


    let {item,productqnt,search} = props;

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
                    component: () => <ItemDetail parentsetProduct={setProduct}/>
                }))
            } else {
                await dispatch(setBottomSheet({
                    visible: true,
                    height: '20%',
                    component: () => <AddonActions itemDetail={item} parentsetProduct={setProduct}
                                                   selectItem={selectItem}/>
                }))
            }

        } else {
            item = {
                ...item,
                productqnt: item.productqnt || 1,
            }
            setProduct(item);
            addItem(item);
            await dispatch(setBottomSheet({
                visible: false,
            }))
        }
    }



/*    useEffect(() => {

        const find: any = findObject(invoiceitems, 'productid', item.itemid, false);

        let totalqnt = 0;
        find.map((i: any) => {
            totalqnt += i.productqnt
        })

        let tempproduct: any = product;
        if (Boolean(find)) {
            tempproduct = {
                ...product,
                ...find[0],
                productqnt: totalqnt,
            }
        }
        setProduct(tempproduct);
    }, [invoiceitems?.length])*/


    const {veg} = product;

    if (device.tablet && !search) {
        return (

            <TouchableOpacity  onPress={() =>   selectItem(product)}  style={[ styles.flexGrow,{width:110,padding:10,margin:5,backgroundColor:styles.secondary.color,borderRadius:5} ]}>
                <Paragraph style={[ styles.paragraph,styles.bold,styles.text_xs,{textAlign:'center'}]}>{product.itemname}</Paragraph>

                {hasRestaurant &&  <View style={[styles.absolute,{top:3,right:3}]}>
                    <VegNonVeg type={veg} />
                </View>}

            </TouchableOpacity>
        )
    }

/*    else if (search) {
        return (
            <>
            <TouchableOpacity onPress={() =>   selectItem(product)}   style={[styles.noshadow,styles.p_5]}>

                <View style={[styles.grid,styles.noWrap,styles.justifyContent]}>
                    <View>
                        <Paragraph style={[styles.bold, styles.paragraph]}>{product.itemname}</Paragraph>
                    </View>
                    {hasRestaurant &&  <View>
                        <Text>
                            <ProIcon name={'square-o'} align={'left'}
                                     color={veg === 'veg' ? styles.veg.color : veg === 'nonveg' ? styles.nonveg.color : styles.vegan.color}
                                     size={15} action_type={'text'}/>
                        </Text>
                    </View>}

                </View>

            </TouchableOpacity>
                <Divider/>
            </>
        )
    }*/


    const hasKot = Boolean(product?.kotid);


    return (
        <TouchableOpacity onPress={() => !Boolean(product?.productqnt) && selectItem(product)}
                          style={[styles.noshadow]}>

            <View
                style={[styles.grid,styles.p_5, styles.noWrap,styles.top, styles.justifyContentSpaceBetween, { backgroundColor:hasKot?'#fdaa2960':''}]}>
                <View   style={{width: '60%'}}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>
                        {<View style={[styles.py_3]}>
                            <Avatar label={product.itemname} value={1} fontsize={15} lineheight={30} size={35}/>
                        </View>}
                        <View style={[styles.ml_2]}>
                            <Paragraph style={[styles.bold,styles.paragraph]}>{product.itemname}</Paragraph>
                        </View>
                    </View>
                </View>
                {<View>
                    {
                        Boolean(product?.productqnt) && !hasKot &&
                        <AddButton product={product} parentsetProduct={setProduct} selectItem={selectItem}/>  /*<Button   onPress={() => { selectItem(product) }}> Add </Button>*/
                    }
                    <Paragraph style={[styles.paragraph,styles.text_xs,{textAlign:'right'}]}>{toCurrency(baseprice)}</Paragraph>
                </View>}
            </View>

            <Divider/>

        </TouchableOpacity>
    )
}



export default memo(Index);
