import React, {useState} from "react";
import {Caption, Paragraph, Text, TextInput as TI, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {clone, getCurrencySign, isRestaurant, setItemRowData, toCurrency} from "../../libs/function";
import {TouchableHighlight, TouchableOpacity, View} from "react-native";
import Button from "../../components/Button";
import KeyboardScroll from "../../components/KeyboardScroll";
import {setBottomSheet} from "../../redux-store/reducer/component";
import TagsNotes from "./TagsNotes";
import Addons from "./Addons";
import {changeCartItem, setCartItems, setUpdateCart} from "../../redux-store/reducer/cart-data";
import Qnt from "./Qnt";
import InputBox from "../../components/InputBox";
import ToggleButtons from "../../components/ToggleButton";
import InputField from "../../components/InputField";
import store from "../../redux-store/store";
import {updateCartItem} from "./AddButton";

const {v4: uuid} = require('uuid')

const Index = ({itemDetail,  inittags, sheetRef, edit, theme: {colors}}: any) => {

    const dispatch = useDispatch()
    let product = itemDetail;

    const {pricing, description, productrate,pax, itemname, groupname,productdiscounttype,productdiscountvalue} = itemDetail;


    const {cartData,cartData:{invoiceitems}} = store.getState()

    const selectItem = async () => {

        if (edit) {

            product = {
                ...product,
                itemUpdate: true,
            }

            let index =  invoiceitems.map(function(o:any) { return o.key; }).indexOf(itemDetail.key);

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



    const [discounttype, setDiscounttype]: any = useState(cartData?.discounttype || '%');
    let discount = '0';
    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');
    let discountType = [{label: 'Percentage', value: '%'}];
    if (!isInclusive) {
        discountType.push({label: 'Amount', value: 'amount'})
    }
    const onButtonToggle = (value: any) => {
        setDiscounttype(value)
    };



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


                {isRestaurant() && <View>
                    <View style={[styles.mt_5, styles.px_5]}>
                        <InputBox
                            defaultValue={pax ? pax + '' : ''}
                            label={'Pax'}
                            autoFocus={false}
                            keyboardType={'numeric'}
                            onChange={(value: any) => {
                                updateProduct({pax: ''+value})
                            }}
                        />
                    </View>
                </View>}


                <View style={[styles.mt_5, styles.px_5]}>

                    {!isInclusive && <>

                        <ToggleButtons
                        width={'50%'}
                        default={productdiscounttype}
                        btns={discountType}
                        onValueChange={onButtonToggle}
                    /></> }

                    <View style={[styles.mt_3]}>
                        <InputBox
                            defaultValue={productdiscountvalue ? productdiscountvalue + '' : ''}
                            label={'Discount'}
                            autoFocus={false}
                            keyboardType={'numeric'}
                            right={ <TI.Affix
                                text={discounttype === '%' ? '%' : getCurrencySign()}   /> }
                            onChange={(value: any) => {
                                updateProduct({productdiscounttype: discounttype, productdiscountvalue: value})
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
