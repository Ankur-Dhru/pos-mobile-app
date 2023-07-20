import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph} from "react-native-paper";

import {clone, findObject, getPricingTemplate, removeItem, selectItem} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import KAccessoryView from "../../components/KAccessoryView";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import CheckBox from "../../components/CheckBox";
import store from "../../redux-store/store";
import {itemTotalCalculation} from "../../libs/item-calculation";


const Index = () => {

    const dispatch = useDispatch()
    const [chargesitems, setChargesitems] = useState([])

    const {cartData:{invoiceitems}} = store.getState()

    useEffect(() => {
        getItemsByWhere({treatby: true}).then((items: any) => {
            if (Boolean(items.length)) {
                let checkitems = []
                checkitems = items.map((item:any)=>{
                   const find = findObject(invoiceitems,'itemid',item.itemid,true);
                    return {...item,selected:Boolean(find)}
                })
                setChargesitems(checkitems)
            }
        })
    }, [])

    const initdata = {items: chargesitems}

    const handleSubmit = async (values: any) => {

        const vouchertotaldisplay =  clone(store.getState().cartData.vouchertotaldisplay);

        if(Boolean(vouchertotaldisplay)) {

            values?.items.filter((item: any) => {
                const find = findObject(invoiceitems, 'itemid', item.itemid, true);
                removeItem(find?.key).then(() => {
                });
                return item.selected
            }).map((item: any) => {
                selectItem(item)
            })

            await dispatch(setUpdateCart());


            setTimeout(async () => {
                const cartdata: any = clone(store.getState().cartData);

                let data = await itemTotalCalculation(cartdata, undefined, undefined, undefined, undefined, 2, 2, false, false);
                await dispatch(setCartData(clone(data)));

                dispatch(setBottomSheet({visible: false}));


            }, 1000)
        }


    }

    let pricingTemplate = getPricingTemplate();

    return (
        <View style={[styles.w_100, styles.p_6]}>

            <Form
                onSubmit={handleSubmit}
                initialValues={initdata}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View style={[styles.middle]}>
                        <View style={[styles.middleForm, {maxWidth: 400}]}>

                            <Caption style={[styles.caption]}>Extra Charges</Caption>

                            <ScrollView>

                                <View style={[styles.mt_2]}>
                                    {
                                        values?.items?.filter((item: any) => {
                                            return true
                                        })?.map((item: any, index: any) => {

                                            const pricingtype = item?.pricing?.type;
                                            const baseprice = (Boolean(item?.pricing?.price) && Boolean(item?.pricing?.price[pricingTemplate]) && item?.pricing?.price[pricingTemplate][0][pricingtype]?.baseprice) || item?.pricing?.price['default'][0][pricingtype]?.baseprice || 0;

                                            return <View key={index}>
                                                <Field name={`items[${index}].selected`}>
                                                    {props => (
                                                        <><CheckBox
                                                            disabled={item.cancelled}
                                                            value={props.input.value}
                                                            label={`${item.itemname} - ${item?.data_json?.chargetype} ${baseprice}`}
                                                            onChange={(value: any) => {
                                                                more.form.change(`items[${index}].selected`, value);
                                                            }}
                                                        /></>
                                                    )}
                                                </Field>

                                            </View>
                                        })
                                    }
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

})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


