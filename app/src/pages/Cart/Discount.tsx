import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph, TextInput as TI} from "react-native-paper";

import {clone, getCurrencySign} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {required} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import ToggleButtons from "../../components/ToggleButton";
import {itemTotalCalculation} from "../../libs/item-calculation";


const Index = ({cartData}: any) => {

    const dispatch = useDispatch()

    const [discounttype, setDiscounttype]: any = useState(cartData?.discounttype || '%');

    let discount = '0';


    const initdata = {discount: discount}
    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');

    const handleSubmit = async (values: any) => {


        // cartData = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        const {discount}: any = values;

        cartData = {
            ...cartData,
            globaldiscountvalue: isInclusive ? 0 : discount,
            discounttype: discounttype,
            updatecart: true,
            invoiceitems: cartData.invoiceitems.map((item: any) => {
                if (isInclusive) {
                    item = {...item, productdiscountvalue: discount, productdiscounttype: discounttype}
                }
                return {...item, change: true}
            })
        }

        let data = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        await dispatch(setCartData(clone(data)));
        await dispatch(setUpdateCart());

        dispatch(setBottomSheet({visible: false}))

    }

    let discountType = [{label: 'Percentage', value: '%'}];
    if (!isInclusive) {
        discountType.push({label: 'Amount', value: 'amount'})
    }


    const onButtonToggle = (value: any) => {
        setDiscounttype(value)
    };

    return (<View style={[styles.w_100, styles.p_6]}>

        <Form
            onSubmit={handleSubmit}
            initialValues={initdata}
            render={({handleSubmit, submitting, values, ...more}: any) => (<View style={[styles.middle]}>
                <View style={[styles.middleForm, {maxWidth: 400}]}>

                    <Caption style={[styles.caption]}>Discount</Caption>

                    <ScrollView>

                        {!isInclusive && <ToggleButtons
                            width={'50%'}
                            default={cartData.discounttype}
                            btns={discountType}
                            onValueChange={onButtonToggle}
                        />}

                        <View style={[styles.mt_5]}>
                            <Field name="discount" validate={required}>
                                {props => (<InputField
                                    {...props}
                                    value={props.input.value}
                                    label={'Discount'}
                                    autoFocus={true}
                                    onSubmitEditing={() => handleSubmit(values)}
                                    right={<TI.Affix
                                        text={discounttype === '%' ? '%' : getCurrencySign()}/>}
                                    inputtype={'textbox'}
                                    keyboardType={'numeric'}
                                    onChange={(value: any) => {
                                        props.input.onChange(value);
                                    }}
                                />)}
                            </Field>
                        </View>

                    </ScrollView>


                    <KAccessoryView>
                        <View style={[styles.submitbutton]}>
                            <View>

                                <TouchableOpacity
                                    onPress={() => {
                                        handleSubmit(values)
                                    }}
                                    style={[{
                                        backgroundColor: styles.secondary.color,
                                        borderRadius: 7,
                                        height: 50,
                                        marginTop: 20
                                    }]}>
                                    <View
                                        style={[styles.grid, styles.noWrap, styles.middle, styles.center, styles.w_100, styles.h_100]}>
                                        <View>
                                            <Paragraph style={[styles.paragraph, styles.bold]}>Apply</Paragraph>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </KAccessoryView>

                </View>

            </View>)}
        >

        </Form>

    </View>)


}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


