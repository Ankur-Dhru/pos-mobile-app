import React from "react";
import {Caption, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {clone, setItemRowData, toCurrency} from "../../libs/function";
import {View} from "react-native";
import Button from "../../components/Button";
import KeyboardScroll from "../../components/KeyboardScroll";
import {setBottomSheet} from "../../redux-store/reducer/component";
import TagsNotes from "./TagsNotes";
import Addons from "./Addons";
import {changeCartItem, setCartItems} from "../../redux-store/reducer/cart-data";
import Qnt from "./Qnt";
import InputBox from "../../components/InputBox";

const {v4: uuid} = require('uuid')

const Index = ({itemDetail, index, inittags, sheetRef, edit, theme: {colors}}: any) => {

    const dispatch = useDispatch()
    let product = itemDetail;

    const {pricing, description, productrate, itemname, groupname} = itemDetail;

    const selectItem = async () => {

        if (edit) {
            product = {
                ...product,
                itemUpdate: true,
            }
            dispatch(changeCartItem({
                itemIndex: index, item: clone(product)
            }));
        } else {
            const itemRowData: any = setItemRowData(product);
            product = {
                ...product,
                ...itemRowData,
            }
            if (product?.itemaddon) {
                product.itemaddon = product?.itemaddon.map((addon: any) => {
                    return {
                        ...addon,
                        ...setItemRowData(addon)
                    }
                })
            }
            await dispatch(setCartItems(product))
        }
        await dispatch(setBottomSheet({visible: false}))

    }

    const updateProduct = (field: any) => {
        product = {
            ...product,
            ...field
        }
    }


    /*    const updateRate = (value:any) => {

            let invoiceitems: any = store.getState().cartData?.invoiceitems || {}

            let filtered = invoiceitems?.filter((item: any, key: any) => {
                return item.key === itemDetail.key
            })

            let finditem = {
                ...filtered[0],
                ...itemDetail,
                change: true,
                productrate: value,
                productdisplayrate: value,
            }

            store.dispatch(changeCartItem({itemIndex: index, item: finditem,itemUpdate:true}));

        }*/


    const pricingtype = pricing?.type;
    const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;

    return (

        <View style={[styles.p_5, styles.w_100, styles.h_100]}>

            <KeyboardScroll>

                <View style={[styles.px_5]}>
                    <Caption>{groupname}</Caption>
                    <View style={[styles.grid, styles.justifyContent]}>
                        <Text style={[styles.bold]}>{itemname}</Text>
                        <Text style={[styles.bold]}>{toCurrency(baseprice)}</Text>
                    </View>

                    <Text>{description}</Text>
                </View>


                <View>
                    <View style={[styles.mt_5, styles.px_5]}>
                        <InputBox
                            defaultValue={productrate ? productrate + '' : ''}
                            label={'Price'}
                            autoFocus={false}
                            onChange={(value: any) => {
                                updateProduct({productrate: value, productratedisplay: value})
                            }}
                        />


                    </View>
                </View>


                <Addons updateProduct={updateProduct}/>
                <TagsNotes updateProduct={updateProduct}/>


            </KeyboardScroll>

            <View style={{marginTop: 15}}>

                <View style={[styles.grid, styles.middle, styles.justifyContent]}>

                    <Qnt updateProduct={updateProduct}/>

                    <View>
                        <View>
                            <Button
                                onPress={() => {
                                    selectItem().then()
                                }}>{!edit ? '+ Add Item' : 'Update'}
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
