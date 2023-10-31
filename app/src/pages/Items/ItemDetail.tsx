import React, {useState} from "react";
import {Caption, Text, TextInput as TI, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {clone, getCurrencySign, isRestaurant, prelog, setItemRowData, toCurrency} from "../../libs/function";
import {View} from "react-native";
import Button from "../../components/Button";
import KeyboardScroll from "../../components/KeyboardScroll";
import {setBottomSheet} from "../../redux-store/reducer/component";
import TagsNotes from "./TagsNotes";
import Addons from "./Addons";
import {changeCartItem, setCartItems} from "../../redux-store/reducer/cart-data";
import Qnt from "./Qnt";
import InputBox from "../../components/InputBox";
import ToggleButtons from "../../components/ToggleButton";
import store from "../../redux-store/store";
import {Container} from "../../components";
import {useNavigation} from "@react-navigation/native";
import InputField from "../../components/InputField";

const {v4: uuid} = require('uuid')

const Index = (props: any) => {

    const {itemDetail, inittags, sheetRef, theme: {colors},orderbypax,addtags} = props
    const edit = props.route?.params?.edit

    const dispatch = useDispatch();
    let navigation = ''
    if(edit) {
        navigation = useNavigation()
    }


    const [validate,setValidate]:any = useState(Boolean(addtags));
    let [product,setProduct]:any = useState(itemDetail);


    const {
        pricing,
        description,
        productrate,
        pax,
        itemname,
        groupname,
        productdiscounttype,
        productdiscountvalue
    } = itemDetail;


    let {cartData, cartData: {invoiceitems}} = store.getState()
    const totaloax = cartData?.pax;

    const selectItem = async () => {

        if (edit) {

            product = {
                ...product,
                itemUpdate: true,
            }

            let index = invoiceitems.map(function (o: any) {
                return o.key;
            }).indexOf(itemDetail.key);

            dispatch(changeCartItem({itemIndex: index, item: clone(product)}));

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

        if(!edit) {
            await dispatch(setBottomSheet({visible: false}))
        }
        else{
            navigation?.goBack();
        }

    }

    const updateProduct = (field: any) => {
        product = {
            ...product,
            ...field
        }
        setProduct(product)
    }


    const [discounttype, setDiscounttype]: any = useState(cartData?.discounttype || '%');
    let discount = '0';
    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');
    let discountType = [{label: '%', value: '%'}];
    if (!isInclusive) {
        discountType.push({label: getCurrencySign(), value: 'amount'})
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

        <View style={[ styles.w_100, styles.h_100,styles.bg_white]}>



            <KeyboardScroll>

                <View style={[styles.px_5]}>
                    <Text>{groupname}</Text>
                    <View style={[styles.grid, styles.justifyContent]}>
                        <Caption style={[styles.caption]}>{itemname}</Caption>
                        <Text style={[styles.bold]}>{toCurrency(baseprice)}</Text>
                    </View>

                    <Text>{description}</Text>
                </View>


                <View style={[styles.px_5]}>
                    <View>
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


                {isRestaurant() && orderbypax && <View style={[styles.px_5]}>
                    <View >

                        <InputField
                            editmode={true}
                            label={'Pax Number'}
                            mode={'flat'}
                            list={Array.from(Array(totaloax), (e, i) => {
                                return {label:i+1,value:i+1}
                            })}
                            value={pax ? pax + '' : ''}
                            selectedValue={pax ? pax + '' : ''}
                            displaytype={'pagelist'}
                            inputtype={'dropdown'}
                            listtype={'other'}

                            onChange={(value: any) => {
                                updateProduct({pax: ''+value})
                            }}>
                        </InputField>

                        {/*<InputBox
                            defaultValue={pax ? pax + '' : ''}
                            label={'Pax'}
                            autoFocus={false}
                            keyboardType={'numeric'}
                            onChange={(value: any) => {
                                updateProduct({pax: '' + value})
                            }}
                        />*/}
                    </View>
                </View>}


                {edit &&  <View style={[styles.px_5]}>

                    <View >
                        <InputBox
                            defaultValue={productdiscountvalue ? productdiscountvalue + '' : ''}
                            label={'Discount'}
                            autoFocus={false}
                            keyboardType={'numeric'}
                           /* right={<TI.Affix
                                text={discounttype === '%' ? '%' : getCurrencySign()}/>}*/
                            onChange={(value: any) => {
                                updateProduct({productdiscounttype: discounttype, productdiscountvalue: value})
                            }}
                        />

                        {!isInclusive && <View style={{width:100,position:'absolute',right:10,top:15}}>
                            <ToggleButtons
                                width={'50%'}
                                default={productdiscounttype}
                                btns={discountType}
                                onValueChange={onButtonToggle}
                            /></View>}

                    </View>

                </View>}


                <Addons updateProduct={updateProduct} selectedaddon={clone(itemDetail.itemaddon)}  setValidate={setValidate}/>
                <TagsNotes updateProduct={updateProduct}/>

                <View style={{height:50}}></View>

            </KeyboardScroll>

            <View style={[styles.p_5]}>

                <View style={[styles.grid, styles.middle, styles.justifyContent]}>

                    <Qnt updateProduct={updateProduct} />

                    <View>
                        <View>
                            <Button
                                onPress={() => {
                                    if(validate) {
                                        selectItem().then()
                                    }
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
    addtags: state.itemDetail.addtags,
    orderbypax: state.cartData.orderbypax,
})

export default connect(mapStateToProps)(withTheme(Index));

//({toCurrency(baseprice * productQnt)})
