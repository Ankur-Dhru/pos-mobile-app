import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph, TextInput as TI} from "react-native-paper";

import {clone, getCurrencySign, groupBy, saveLocalSettings} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {required} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import ToggleButtons from "../../components/ToggleButton";
import {itemTotalCalculation} from "../../libs/item-calculation";


const Index = ({cartData}: any) => {

    const dispatch = useDispatch();

    const {discountdetail,orderbypax} = cartData


    const handleSubmit = async (values: any) => {


        cartData = {
            ...cartData,

            updatecart: true,

        }

        let data = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        await dispatch(setCartData(clone(data)));
        await dispatch(setUpdateCart());

        dispatch(setBottomSheet({visible: false}))

    }

    const onButtonToggle = () => {

    }



    return (<View style={[styles.w_100, styles.p_6]}>

        <Form
            onSubmit={handleSubmit}
            initialValues={{}}
            render={({handleSubmit, submitting, form, values, ...more}: any) => {

                const {all,groups,selected} = values

                return (<View style={[styles.middle]}>
                    <View style={[styles.middleForm, {maxWidth: 400}]}>


                        <ScrollView>
                            <Caption style={[styles.caption]}>Update Basic Info</Caption>
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
                                                <Paragraph style={[styles.paragraph, styles.bold]}>Update</Paragraph>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </KAccessoryView>

                    </View>

                </View>)
            }}
        >
        </Form>

    </View>)


}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


