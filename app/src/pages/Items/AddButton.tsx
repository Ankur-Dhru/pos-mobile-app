import React from "react";
import {appLog, removeItem} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {ProIcon} from "../../components";
import {connect, useDispatch} from "react-redux";
import {changeCartItem,} from "../../redux-store/reducer/cart-data";
import {setBottomSheet} from "../../redux-store/reducer/component";

import CartItems from "../Cart/CartItems";
import AddonActions from "./AddonActions";
import {device} from "../../libs/static";
import store from "../../redux-store/store";


const Index = (props: any) => {


    let {bottomsheet, theme: {colors}, fromcart, item,setProduct,page} = props;


    const dispatch = useDispatch();

    const updateItem = async (values: any, action: any) => {

        if (values.productqnt > 0 && action === 'add' && !bottomsheet.visible && values?.hasAddon) {
            await dispatch(setBottomSheet({
                visible: true,
                height: '20%',
                component: () => <AddonActions product={values}/>
            }))
        }/* else if (action === 'remove' && !bottomsheet.visible && !device.tablet && !fromcart && values?.hasAddon) {
            await dispatch(setBottomSheet({
                visible: true,
                height: '50%',
                component: () => <CartItems itemid={values.productid || values.itemid}/>
            }))
        }*/ else {

            await updateCartItem(values, action)
        }

    }


    return (
        <>
            <View style={[styles.grid, styles.middle, {
                width: '100%',
                minWidth: 100,
                borderRadius: 5,
                backgroundColor: styles.accent.color
            }]}>
                {<TouchableOpacity style={[styles.py_3]} onPress={() => {
                    updateItem(item, 'remove').then(r => {
                    })
                }}>
                    <ProIcon name={'minus'} color={colors.secondary} size={15}/>
                </TouchableOpacity>}
                <Paragraph
                    style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, {color: colors.secondary}]}>{parseInt(item?.productqnt || 1)}</Paragraph>
                {<TouchableOpacity style={[styles.py_3]} onPress={() => {
                    updateItem(item, 'add').then(r => {
                    })
                }}>
                    <ProIcon name={'plus'} color={colors.secondary} size={15}/>
                </TouchableOpacity>}
            </View></>
    )
}


const mapStateToProps = (state: any) => ({
    bottomsheet: state.component.bottomsheet
})

export default connect(mapStateToProps)(withTheme(Index));


export const updateCartItem = async (values: any, action: any) => {

    let invoiceitems: any = store.getState().cartData?.invoiceitems || {}

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


        let finditem = {
            ...filtered[0],
            ...values,
            change: true,
            product_qnt: values.productqnt,
        }

        if (values.productqnt === 0) {
            removeItem(values.key).then(() => {

            });
        } else {
            store.dispatch(changeCartItem({
                itemIndex: index, item: finditem
            }));

        }



    } catch (e) {
        appLog('e', e)
    }
}
