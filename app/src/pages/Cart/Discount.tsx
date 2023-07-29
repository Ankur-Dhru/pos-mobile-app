import React, {useState} from 'react';
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
import CheckBox from "../../components/CheckBox";
import {v4 as uuidv4} from "uuid";


const Index = ({cartData,grouplist}: any) => {

    const dispatch = useDispatch()

    const [discounttype, setDiscounttype]: any = useState(cartData?.discounttype || '%');

    const [groups,setGroups] =  useState(groupBy(cartData.invoiceitems,'itemgroupid','',{selected:false}));



    const initdata = {discount: '0',allgroup:false,groups}
    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');

    const handleSubmit = async (values: any) => {


        // cartData = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        const {groupdiscount,globaldiscount,groups}: any = values;

        cartData = {
            ...cartData,
            //globaldiscountvalue: isInclusive ? 0 :  discount,
            globaldiscountvalue: isInclusive ? 0 : globaldiscount,
            discounttype: discounttype,
            updatecart: true,
            invoiceitems: cartData.invoiceitems.map((item: any) => {
                item = {...item, productdiscountvalue:0, productdiscounttype: ''}

                if (isInclusive || (Boolean(groupdiscount) && groups[item.itemgroupid].selected)) {
                    item = {...item, productdiscountvalue:groupdiscount || globaldiscount, productdiscounttype: discounttype}
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
            render={({handleSubmit, submitting,form, values, ...more}: any) => {

                const {groups} = values

                return (
                    <View style={[styles.middle]}>
                        <View style={[styles.middleForm, {maxWidth: 400}]}>

                            <Caption style={[styles.caption]}>Global Discount</Caption>

                            <ScrollView>

                                {/*<View style={[styles.grid,styles.mb_5]}>

                                    <Field name={`allgroup`}>
                                        {props => (
                                            <><CheckBox
                                                {...props}
                                                value={props.input.value}
                                                label={'All'}
                                                onChange={(value: any) => {
                                                    Object.keys(groups).forEach((key)=>{
                                                        groups[key] = {...groups[key],selected:value}
                                                    })
                                                    props.input.onChange(value);
                                                }}
                                            /></>
                                        )}
                                    </Field>

                                    {
                                        Object.keys(groups).map((key,index)=>{
                                            return(
                                                <View key={key}>
                                                    <Field name={`groups[${key}].selected`}>
                                                        {props => (
                                                            <><CheckBox
                                                                {...props}
                                                                key={uuidv4()}
                                                                value={props.input.value}
                                                                label={grouplist[key].itemgroupname}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            /></>
                                                        )}
                                                    </Field>
                                                </View>
                                            )
                                        })
                                    }

                                </View>*/}

                                {!isInclusive && <ToggleButtons
                                    width={'50%'}
                                    default={cartData.discounttype}
                                    btns={discountType}
                                    onValueChange={onButtonToggle}
                                />}

                                <View style={[styles.mt_5]}>
                                    <Field name="globaldiscount"  >
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
                                                form.change('groupdiscount','')
                                                props.input.onChange(value);
                                            }}
                                        />)}
                                    </Field>
                                </View>



                                <View style={[styles.p_5]}>
                                    <Paragraph style={{textAlign:'center'}}>OR</Paragraph>
                                </View>


                                <Caption style={[styles.caption,styles.mt_5,styles.pt_15]}>Discount by Group</Caption>

                                <View style={[styles.grid]}>

                                    {
                                        Object.keys(groups).map((key,index)=>{
                                            return(
                                                <View key={key}>
                                                    <Field name={`groups[${key}].selected`}>
                                                        {props => (
                                                            <><CheckBox
                                                                {...props}
                                                                key={uuidv4()}
                                                                value={props.input.value}
                                                                label={grouplist[key].itemgroupname}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            /></>
                                                        )}
                                                    </Field>
                                                </View>
                                            )
                                        })
                                    }

                                </View>

                                <View >
                                    <Field name="groupdiscount" >
                                        {props => (<InputField
                                            {...props}
                                            value={props.input.value}
                                            label={'Group Discount'}
                                            right={<TI.Affix
                                                text={'%'}/>}
                                            inputtype={'textbox'}
                                            keyboardType={'numeric'}
                                            onChange={(value: any) => {
                                                onButtonToggle('%')
                                                setDiscounttype('%');
                                                form.change('globaldiscount','')
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

                    </View>
                )
            }}
        >
        </Form>

    </View>)


}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData,
    grouplist: state.groupList
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


