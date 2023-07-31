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


const Index = ({cartData, grouplist}: any) => {

    const dispatch = useDispatch();

    const {discountdetail} = cartData

    let groupsby = groupBy(cartData.invoiceitems, 'itemgroupid', '', {selected: false,productdiscounttype:'%',productdiscountvalue:'0'});
    if(discountdetail?.groups){
        Object.keys(groupsby).map((key:any)=>{
            groupsby[key] = {
                ...groupsby[key],
                ...discountdetail?.groups[key]
            }
        })
    }

    const [discount,setDiscount] = useState({all:{productdiscounttype:discountdetail?.all?.productdiscounttype || '%',productdiscountvalue:discountdetail?.all?.productdiscountvalue || '0'},groups:  groupsby,selected: discountdetail?.selected || 'all'})



    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');

    const handleSubmit = async (values: any) => {


        // cartData = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        const {groups,all,selected}: any = values;


        cartData = {
            ...cartData, //globaldiscountvalue: isInclusive ? 0 :  discount,
            globaldiscountvalue: isInclusive ? 0 : selected === 'all'? all.productdiscountvalue :  0,
            discounttype: selected === 'all'? all.productdiscounttype : '%',
            updatecart: true,
            discountdetail:values,
            invoiceitems: cartData.invoiceitems.map((item: any) => {
                item = {...item, productdiscountvalue: 0, productdiscounttype: ''}

                if (isInclusive || (Boolean(selected === 'groups') && groups[item.itemgroupid].selected)) {
                    item = {
                        ...item,
                        productdiscountvalue: selected === 'all'? all.productdiscountvalue :  groups[item.itemgroupid].productdiscountvalue,
                        productdiscounttype: selected === 'all'? all.productdiscounttype : '%',
                    }
                }
                return {...item, change: true}
            })
        }

        let data = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        await dispatch(setCartData(clone(data)));
        await dispatch(setUpdateCart());

        dispatch(setBottomSheet({visible: false}))

    }

    const onButtonToggle = () => {

    }

    let discountType = [{label: 'Percentage', value: '%'}];
    if (!isInclusive) {
        discountType.push({label: 'Amount', value: 'amount'})
    }


    return (<View style={[styles.w_100, styles.p_6]}>

        <Form
            onSubmit={handleSubmit}
            initialValues={discount}
            render={({handleSubmit, submitting, form, values, ...more}: any) => {

                const {all,groups,selected} = values

                return (<View style={[styles.middle]}>
                    <View style={[styles.middleForm, {maxWidth: 400}]}>


                        <ScrollView>

                            <Caption style={[styles.caption]}>Discount To</Caption>

                            <ToggleButtons
                                width={'50%'}
                                default={discount.selected}
                                btns={[{label: 'All', value: 'all'}, {label: 'Selected Groups', value: 'groups'}]}
                                onValueChange={(value:any)=>setDiscount({...values,selected: value})}
                            />

                            {selected === 'all' ? <>



                                <View style={[styles.mt_5]}>

                                    <View style={[styles.px_5]}>

                                        <View>
                                            <Field name="all.productdiscountvalue">
                                                {props => (<InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={`Discount (${all.productdiscounttype === '%' ? '%' : getCurrencySign()})`}
                                                    autoFocus={false}
                                                    onSubmitEditing={() => handleSubmit(values)}
                                                    right={<TI.Affix
                                                        text={all.productdiscounttype === '%' ? '%' : getCurrencySign()}/>}
                                                    inputtype={'textbox'}
                                                    keyboardType={'numeric'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />)}
                                            </Field>
                                        </View>

                                        <View>
                                            {!isInclusive && <ToggleButtons
                                                width={'50%'}
                                                default={discount.all.productdiscounttype}
                                                btns={discountType}
                                                onValueChange={(value:any)=>{
                                                    setDiscount({...values,all:{productdiscounttype:value}})
                                                }}
                                            />}
                                        </View>


                                    </View>
                                </View>
                            </> : <>

                                <View style={[styles.px_5]}>

                                    {Object.keys(groups).map((key, index) => {
                                        return (
                                            <View style={[styles.grid, styles.justifyContent,styles.mt_5, styles.w_100]} key={key}>

                                                <View>
                                                    <Field name={`groups[${key}].selected`}>
                                                        {props => (<><CheckBox
                                                            {...props}
                                                            key={uuidv4()}
                                                            value={props.input.value}
                                                            label={grouplist[key]?.itemgroupname}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        /></>)}
                                                    </Field>
                                                </View>


                                                <View style={{width: 150}}>
                                                    <View>
                                                        <Field  name={`groups[${key}].productdiscountvalue`}>
                                                            {props => (<InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={`Discount (%)`}
                                                                right={<TI.Affix
                                                                    text={'%'}/>}
                                                                inputtype={'textbox'}
                                                                keyboardType={'numeric'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />)}
                                                        </Field>
                                                    </View>
                                                </View>


                                            </View>)
                                    })}


                                </View>


                            </>}

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

                </View>)
            }}
        >
        </Form>

    </View>)


}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData, grouplist: state.groupList
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


