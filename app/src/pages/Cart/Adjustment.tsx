import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../src/theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph, TextInput as TI} from "react-native-paper";

import {clone, getCurrencySign} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {composeValidators, localredux, maxValue, mustBeNumber, required} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";

import {itemTotalCalculation} from "../../libs/item-calculation";


const Index = ({cartData}: any) => {

    const dispatch = useDispatch()

    const {adjustmentlimit}:any = localredux?.authData;



    const initdata = {adjustmentamount: cartData?.adjustmentamount || '0'}
    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');

    const handleSubmit = async (values: any) => {


        // cartData = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        const {adjustmentamount}: any = values;

        cartData = {
            ...cartData,
            adjustmentamount: adjustmentamount,
            updatecart: true,
        }

        let data = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        await dispatch(setCartData(clone(data)));
        await dispatch(setUpdateCart());

        dispatch(setBottomSheet({visible: false}))

    }



    return (
        <View style={[styles.w_100, styles.p_6]}>

            <Form
                onSubmit={handleSubmit}
                initialValues={initdata}
                render={({handleSubmit, submitting, values,form, ...more}: any) => (
                    <View style={[styles.middle]}>
                        <View style={[styles.middleForm, {maxWidth: 400}]}>

                            <Caption style={[styles.caption]}>Adjustment</Caption>

                            <ScrollView>

                                <View style={[styles.mt_5]}>
                                    <Field name="adjustmentamount"  validate={composeValidators(required, maxValue(+adjustmentlimit))}>
                                        {props => (
                                            <InputField
                                                {...props}
                                                value={props.input.value}
                                                label={'Adjustment'}
                                                autoFocus={true}

                                                right={<TI.Affix
                                                    text={getCurrencySign()}/>}
                                                inputtype={'textbox'}
                                                keyboardType={'numeric'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                }}
                                            />
                                        )}
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

                    </View>
                )}
            >

            </Form>

        </View>
    )


}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


