import React, {useEffect, useState} from "react";
import {Caption, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {clone, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {ProIcon} from "../../components";
import Button from "../../components/Button";
import {addItem} from "../../libs/item-calculation";
import KeyboardScroll from "../../components/KeyboardScroll";
import {setBottomSheet} from "../../redux-store/reducer/component";
import TagsNotes from "./TagsNotes";
import Addons from "./Addons";
import {changeCartItem} from "../../redux-store/reducer/cart-data";

const {v4: uuid} = require('uuid')

const Index = ({itemDetail, index, inittags, sheetRef,edit, theme: {colors}}: any) => {


    const dispatch = useDispatch()
    let [product, setProduct] = useState({...itemDetail,itemdetail:edit?itemDetail.itemdetail:itemDetail})
    const [productQnt, setProductQnt] = useState(itemDetail.productqnt || 1);
    const [productTags, setproductTags]: any = useState(itemDetail?.itemtags || {});
    const [productNotes, setproductNotes]: any = useState(itemDetail?.notes || '');
    const [productAddons, setproductAddons]: any = useState(itemDetail.itemaddon || []);


    useEffect(() => {
        product = {
            ...product,
            itemtags: productTags,
            itemaddon:productAddons,
            productqnt:productQnt,
            notes:productNotes
        }
        setProduct(product)
    }, [productTags,productAddons,productQnt,productNotes])

    if(!Boolean(product?.itemdetail)){
        return <></>
    }


    const {pricing, description, itemname, groupname} = product;

    const selectItem = async () => {
        if(edit){
            dispatch(changeCartItem({
                itemIndex: index, item: clone(product)
            }));
            setProduct(product);
        }
        else {
            addItem(product)
        }
        await dispatch(setBottomSheet({visible: false}))
    }



    const updateQnt = (action: any) => {
        if (action === 'add') {
            setProductQnt(productQnt + 1)
        } else if (action === 'remove') {
            setProductQnt(productQnt - 1)
        }
    }


    const pricingtype = pricing?.type;
    const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;


    return (

        <View style={[styles.p_5,styles.w_100,styles.h_100]}>

            <KeyboardScroll>

                <View style={[styles.px_5]}>
                    <Caption>{groupname}</Caption>
                    <View style={[styles.grid, styles.justifyContent]}>
                        <Text style={[styles.bold]}>{itemname}</Text>
                        <Text style={[styles.bold]}>{toCurrency(baseprice)}</Text>
                    </View>

                    <Text>{description}</Text>
                </View>


                <Addons product={product} edit={edit} setproductAddons={setproductAddons}/>


                <TagsNotes  setproductTags={setproductTags} setproductNotes={setproductNotes} edit={edit}   product={product}   />


            </KeyboardScroll>

            <View style={{marginBottom: 15}}>

                <View style={[styles.grid, styles.middle, styles.justifyContent]}>

                    <View style={{width: 120}}>
                        <>
                            <View style={[styles.grid, styles.middle, {
                                borderRadius: 5,
                                backgroundColor: styles.accent.color
                            }]}>
                                {<TouchableOpacity style={[styles.py_3]} onPress={() => {
                                    productQnt > 1 && updateQnt('remove')
                                }}>
                                    <ProIcon name={'minus'} color={colors.secondary} size={15}/>
                                </TouchableOpacity>}
                                <Paragraph
                                    style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, {color: colors.secondary}]}>{parseInt(productQnt)}</Paragraph>
                                {<TouchableOpacity style={[styles.py_3]} onPress={() => {
                                    updateQnt('add')
                                }}>
                                    <ProIcon name={'plus'} color={colors.secondary} size={15}/>
                                </TouchableOpacity>}
                            </View></>
                    </View>

                    <View>
                          <View>
                            <Button
                                onPress={() => {
                                    selectItem().then()
                                }}>{!edit ? '+ Add Item': 'Update'}
                            </Button>
                        </View>
                    </View>

                </View>

            </View>

        </View>

    )
}


const mapStateToProps = (state: any) => ({
    itemDetail: state.itemDetail,
})

export default connect(mapStateToProps)(withTheme(Index));

//({toCurrency(baseprice * productQnt)})
