import React, {useEffect, useState} from "react";
import {clone, deleteTempLocalOrder, removeItem} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {ProIcon} from "../../components";
import {connect, useDispatch} from "react-redux";
import {
    changeCartItem,
    resetCart,
    setCartData,
    setUpdateCart,
    updateCartItems
} from "../../redux-store/reducer/cart-data";
import {setBottomSheet} from "../../redux-store/reducer/component";

import CartItems from "../Cart/CartItems";
import AddonActions from "./AddonActions";
import {current, device} from "../../libs/static";


const Index = (props: any) => {


    let {invoiceitems,selectItem,bottomsheet,parentsetProduct,theme:{colors},fromcart, product:item} = props;

    const [product,setProduct] = useState(item);

    useEffect(()=>{
        setProduct(item)
    },[item.productqnt])

    useEffect(()=>{
        parentsetProduct && parentsetProduct(product)
    },[product.qnt])

    const dispatch = useDispatch();

    const updateItem = async (values: any, action: any) => {

        if (values.productqnt > 0 && action === 'add' && !bottomsheet.visible  && values.hasAddon) {
            await dispatch(setBottomSheet({
                visible: true,
                height:'20%',
                component: ()=> <AddonActions product={product} fromcart={fromcart}   parentsetProduct={setProduct} selectItem={selectItem} />
            }))
        } else if (action === 'remove' && !bottomsheet.visible && !device.tablet && !fromcart  && values.hasAddon) {
            await dispatch(setBottomSheet({
                visible: true,
                height: '50%',
                component: () => <CartItems itemid={values.productid || values.itemid} selectItem={selectItem}/>
            }))
        }
        else {

            try {
                const index = invoiceitems.findIndex(function (item: any) {
                    return item.key === values.key
                });

                let filtered = invoiceitems?.filter((item: any, key: any) => {
                    return item.key === values.key
                })

                if (action === 'add') {
                    values = {
                        ...values,
                        productqnt: values.productqnt + 1,
                    }
                } else if (action === 'remove') {
                    values = {
                        ...values,
                        productqnt: values.productqnt - 1
                    }
                }

                filtered = {
                    ...filtered,
                    ...values,
                    change: true,
                    product_qnt:values.productqnt,
                }

                if (values.productqnt === 0) {
                    removeItem(values.key).then(()=>{
                        console.log('item remove',values.key)
                    });
                } else {

                    dispatch(changeCartItem({
                        itemIndex: index, item: clone(filtered)
                    }));
                }

                setProduct(values)


            }
            catch (e){
                console.log('e',e)
            }

        }

    }




    return (
        <>
            <View style={[styles.grid, styles.middle,{width:'100%',minWidth:100,borderRadius:5,backgroundColor:styles.secondary.color}]}>
                {<TouchableOpacity style={[styles.py_3]}  onPress={() => {
                    updateItem(product, 'remove')
                }}>
                    <ProIcon name={'minus'} color={colors.secondary}  size={15}/>
                </TouchableOpacity>}
                <Paragraph
                    style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter,{color:colors.secondary}]}>{parseInt(product?.productqnt || 1)}</Paragraph>
                {<TouchableOpacity style={[styles.py_3]}  onPress={() => {
                    updateItem(product, 'add')
                }}>
                    <ProIcon name={'plus'} color={colors.secondary} size={15}/>
                </TouchableOpacity>}
            </View></>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems || [],
    bottomsheet:state.component.bottomsheet
})

export default connect(mapStateToProps)(withTheme(Index));
