import React, {Component, useState} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../src/theme";

import {Button, InputBox, ProIcon} from "../../../src/components";
import {connect, useDispatch} from "react-redux";
import {Paragraph, TextInput, TextInput as TI, Title, Divider, withTheme} from "react-native-paper";

import {clone, getCurrencySign, toCurrency} from "../../../src/libs/function";
import {setDialog} from "../../redux-store/reducer/component";
import CancelReason from "./CancelReason";





const Index = ({cartData}: any) => {

    const dispatch = useDispatch()

    const [discount,setDiscount]:any = useState(Boolean(cartData?.voucherglobaldiscountdisplay));
    const [discountamount,setDiscountamount]:any = useState(0);
    const [adjustmentamount,setAdjustmentamount]:any = useState(0);
    const [discounttype,setDiscounttype]:any = useState(cartData.discounttype);
    const [globaldiscountvalue,setGlobaldiscountvalue]:any = useState(cartData.globaldiscountvalue);


    const DiscountForm = () => {
        return (
            <View >

                <View>

                    <View style={[styles.grid,styles.middle]}>

                        <View>

                            <TextInput
                                style={[styles.input]}
                                mode={'flat'}
                                value={globaldiscountvalue}
                                defaultValue={globaldiscountvalue}
                                left={<TI.Affix text={cartData.discounttype === '%' ? '' : getCurrencySign()}/>}
                                outlineColor="transparent"
                                dense={true}
                                keyboardType={'numeric'}
                                autoFocus={false}

                                onChangeText={(value:any) => {
                                    setDiscounttype(value)
                                }}

                            />


                        </View>

                        <View>

                            <TouchableOpacity onPress={() => {
                                setDiscounttype(discounttype === '%' ? getCurrencySign() : '%')
                            }}>
                                <View style={[styles.grid,styles.middle]}>
                                    <Paragraph  style={[styles.paragraph,styles.text_sm]}>
                                        {cartData.discounttype === '%' ? '%' : getCurrencySign()}
                                    </Paragraph>
                                </View>
                            </TouchableOpacity>

                        </View>



                    </View>

                    <View><Paragraph  style={[styles.textRight, styles.head]}>{toCurrency(cartData.voucherglobaldiscountdisplay || '0')}</Paragraph></View>

                </View>

            </View>
        )
    }

    const openDiscountDialog = () => {
        dispatch(setDialog({title:'Discount',visible:true,hidecancel:true,component: ()=><DiscountForm  />}))
    }

        return (
            <View>
                {(cartData.vouchertransitionaldiscount) ? <View style={[]}>
                    {!discount && <View><TouchableOpacity  style={[styles.fieldspace]}  onPress={()=>  openDiscountDialog() }>
                        <Title  style={[styles.textRight,styles.text_sm,styles.uppercase,styles.green]} >
                            + Discount
                        </Title>
                    </TouchableOpacity></View> }



                </View> : <View style={[]}>
                    {Boolean(cartData.voucherglobaldiscountdisplay) && <View><View style={[styles.grid,styles.middle,styles.fieldspace,{marginTop:12}]}>
                        <View style={[styles.cell,styles.w_auto]}>
                            <Paragraph  style={[styles.paragraph,styles.text_sm,styles.uppercase]} >
                                 Discount
                            </Paragraph>
                        </View>
                        <View style={[styles.cell,{paddingRight:0}]}><Paragraph
                            style={[styles.textRight, styles.head]}>{toCurrency(cartData.voucherglobaldiscountdisplay || '0')}</Paragraph></View>
                    </View></View>}
                </View> }

            </View>
        )


}





const mapStateToProps = (state: any) => ({
    cartData:state.cartData
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


