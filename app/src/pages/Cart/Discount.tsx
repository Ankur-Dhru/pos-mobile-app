import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph, TextInput as TI} from "react-native-paper";

import {
    AppToaster,
    checkCriteria,
    clone,
    errorAlert, findItem,
    getCurrencySign,
    getDefaultCurrency, getDiscountValueAndTYpe,
    groupBy,
    isEmpty, isInward,
    prelog,
    saveLocalSettings
} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {COUPON_TYPE, localredux, required} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import ToggleButtons from "../../components/ToggleButton";
import {getProductData, itemTotalCalculation} from "../../libs/item-calculation";
import moment from "moment/moment";
import {v4} from "uuid";
import {Button} from "../../components";


const Index = ({cartData, grouplist}: any) => {

    const dispatch = useDispatch();

    const {discountdetail,coupons,orderbypax} = cartData
    let [couponList,setCouponList]:any = useState(coupons || [])

    let groupsby = groupBy(cartData.invoiceitems, 'itemgroupid', '', {productdiscounttype:'%',productdiscountvalue:'0'});
    if(discountdetail?.groups){
        Object.keys(groupsby).map((key:any)=>{
            groupsby[key] = {
                ...groupsby[key],
                ...discountdetail?.groups[key]
            }
        })
    }

    let [discount,setDiscount] = useState({all:{coupon:'PREWZCRPOS',productdiscounttype:discountdetail?.all?.productdiscounttype || '%',productdiscountvalue:discountdetail?.all?.productdiscountvalue || '0'},groups:  groupsby,selected: discountdetail?.selected || 'all'})




    useEffect(()=>{
       Boolean(discountdetail) && setDiscount(discountdetail)
    },[discountdetail])


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
            coupons:couponList,
            invoiceitems: cartData.invoiceitems.map((item: any) => {
                item = {...item, productdiscountvalue: 0, productdiscounttype: ''}

                if (isInclusive || (Boolean(selected === 'groups') && Boolean(groups[item.itemgroupid].productdiscountvalue))) {
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



    let discountType = [{label: 'Percentage', value: '%'}];
    if (!isInclusive && !orderbypax) {
        discountType.push({label: 'Amount', value: 'amount'})
    }


    if(!Boolean(discount)){
        return <></>
    }

    const removeDiscount = (index:any) => {
        let array = couponList || [];
        if(Boolean(array?.length)) {
            array?.splice(index, 1)
            setCouponList(clone(array))
            if (array?.length == 0) {
                discount = {
                    ...discount,
                    all: {...discount.all, productdiscountvalue: '0'}
                }
                setDiscount(discount)
            }
        }


    }


    const couponCodeProcess = (coupon:any) => {

        const couponsData = localredux?.initData?.coupon;
        /**
         * Check coupon list
         * if empty
         *    show error
         * else
         *    Work
         */
        if(isEmpty(couponsData)) {
            AppToaster({
                message: `No Coupon Added`
            });
        } else {
            /**
             * find coupon from list
             * if empty
             *    show error
             * else
             *    Work
             */

            const foundCoupon: any = Object.values(couponsData).find((singleCoupon: any) => singleCoupon?.coupon == coupon);
            if(isEmpty(foundCoupon)) {
                AppToaster({
                    message: `No Coupon Found`
                });
            } else {
                /**
                 * check start date and end date for coupon
                 * if between date
                 *    work
                 * else
                 *    show error
                 */
                const currentDateStart = moment().startOf('day'),
                    currentDateEnd   = moment().endOf('day'),
                    startDate        = moment(foundCoupon?.startdate).startOf('day'),
                    endDate          = moment(foundCoupon?.enddate).endOf('day');

                let couponStart = currentDateStart.diff(startDate, 'day');
                let couponEnd   = currentDateEnd.diff(endDate, 'day');

                if(couponStart >= 0 && couponEnd <= 0) {

                    if(foundCoupon?.campaigndetail?.campaigntype == COUPON_TYPE.COMBO) {
                        let pricingTemplate    = cartData?.client?.clientconfig?.pricingtemplate;
                        let companyCurrency:any    = getDefaultCurrency();
                        let isInwards          =  isInward(cartData?.vouchertype);
                        let applyOnBuyItems    = Boolean(foundCoupon?.data?.onbuyitem);
                        let toalBuyQuantity    = foundCoupon?.data?.minbuy;
                        let buyitems           = foundCoupon?.data?.buyitems;
                        let invoiceitems       = cartData?.invoiceitems;
                        let buyCriteriaMatched = checkCriteria(buyitems, invoiceitems, foundCoupon, 'buy');

                        if(buyCriteriaMatched) {
                            if(applyOnBuyItems) {

                                couponList.push({ name: coupon });
                                setCouponList(clone(couponList));

                                let newInvoiceItems: any = [];
                                let leftQuantity         = toalBuyQuantity;


                                let position: number = 0;
                                invoiceitems.forEach((iItem: any) => {
                                    let foundItem = findItem(buyitems, iItem);
                                    if(!isEmpty(newInvoiceItems)) {
                                        let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                                        let lastItem = allitems[allitems.length - 1];
                                        position     = lastItem?.position;

                                    }
                                    if(!isEmpty(foundItem) && leftQuantity > 0) {
                                        console.log('leftQuantity', leftQuantity);
                                        if(leftQuantity >= iItem?.productqnt) {
                                            leftQuantity    = leftQuantity - (+iItem?.productqnt);
                                            position        = position + 1;
                                            const {
                                                discountvalue,
                                                discountType
                                            }         = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);
                                            newInvoiceItems = [
                                                ...newInvoiceItems,
                                                {
                                                    ...iItem,
                                                    productdiscountvalue: discountvalue,
                                                    productdiscounttype : discountType,
                                                    itemUpdate          : true,
                                                    position,
                                                    itemindex           : 1 + newInvoiceItems?.length
                                                }
                                            ];
                                        } else {
                                            let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                            let key: any      = v4();
                                            let oldPrice      = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);
                                            position          = position + 1;

                                            const {
                                                discountvalue,
                                                discountType
                                            } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                            newInvoiceItems = [
                                                ...newInvoiceItems,
                                                {
                                                    ...iItem,
                                                    productqnt          : leftQuantity,
                                                    productdiscountvalue: discountvalue,
                                                    productdiscounttype : discountType,
                                                    itemUpdate          : true,
                                                    position,
                                                    itemindex           : 1 + newInvoiceItems?.length
                                                },
                                                {
                                                    ...iItem,
                                                    productqnt: setproductqnt,
                                                    ...oldPrice,
                                                    itemUpdate: true,
                                                    key,
                                                    position  : position + 1,
                                                    itemindex : 2 + newInvoiceItems?.length
                                                }
                                            ];
                                            leftQuantity    = 0;
                                        }
                                    } else {

                                        let oldPrice    = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);
                                        position        = position + 1;
                                        newInvoiceItems = [
                                            ...newInvoiceItems,
                                            { ...iItem, ...oldPrice, itemUpdate: true, position, itemindex: 1 + newInvoiceItems?.length }
                                        ];
                                    }
                                });

                                dispatch(setCartData({ invoiceitems: newInvoiceItems, updatecart: true, combocoupon:true }));
                            } else {
                                let getitems           = foundCoupon?.data?.getitems;
                                let getCriteriaMatched = checkCriteria(getitems, invoiceitems, foundCoupon, 'get');
                                if(getCriteriaMatched) {
                                    couponList.push({ name: coupon });
                                    setCouponList(clone(couponList));

                                    let newInvoiceItems: any = [];
                                    let leftQuantity         = foundCoupon?.data?.anygetqnt;
                                    let position: number     = 0;

                                    invoiceitems.forEach((iItem: any) => {
                                        let foundItem = findItem(getitems, iItem);
                                        if(!isEmpty(newInvoiceItems)) {
                                            let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                                            let lastItem = allitems[allitems.length - 1];
                                            position     = lastItem?.position;
                                        }
                                        if(!isEmpty(foundItem) && leftQuantity > 0) {

                                            if(leftQuantity >= iItem?.productqnt) {
                                                leftQuantity = leftQuantity - (+iItem?.productqnt);

                                                const {
                                                    discountvalue,
                                                    discountType
                                                } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                                position        = position + 1;
                                                newInvoiceItems = [
                                                    ...newInvoiceItems,
                                                    {
                                                        ...iItem,
                                                        productdiscountvalue: discountvalue,
                                                        productdiscounttype : discountType,
                                                        itemUpdate          : true,
                                                        position,
                                                        itemindex           : 1 + newInvoiceItems?.length
                                                    }
                                                ];
                                            }

                                        } else {

                                            let oldPrice    = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);
                                            position        = position + 1;
                                            newInvoiceItems = [
                                                ...newInvoiceItems,
                                                {
                                                    ...iItem, ...oldPrice,
                                                    itemUpdate: true,
                                                    position,
                                                    itemindex : 1 + newInvoiceItems?.length
                                                }
                                            ];
                                        }
                                    });
                                    dispatch(setCartData({ invoiceitems: newInvoiceItems, updatecart: true , combocoupon:true}));
                                } else {
                                    AppToaster({
                                        message: `Coupon not applicable 1`
                                    });
                                }
                            }
                        } else {
                            AppToaster({
                                message: `Coupon not applicable 2`
                            });
                        }
                    }
                    else {
                        let {
                            amount,

                            discounttype,
                            mintotal,
                            clientrequired,
                            usewithother
                        }         = foundCoupon;

                        discounttype = discounttype === 'percentage' ? '%' : '$'

                        let cpn         = [...couponList] || [],
                            isInclusive = cartData?.vouchertaxtype == 'inclusive';

                        let checkApplied       = cpn.some((c: any) => c.discounttype != (discounttype)),
                            belowTotal         = (+mintotal) > (+cartData?.vouchertotaldisplay),
                            inValidFixDiscount = isInclusive && (discounttype) == 'fixed',
                            isClientRequired   = Boolean(+clientrequired) && Boolean(+cartData?.clientid == 1),
                            isNotUseWithOther  = !Boolean(usewithother) && !isEmpty(cpn);

                        if((!isEmpty(cpn) && (checkApplied || isNotUseWithOther)) || belowTotal || inValidFixDiscount || isClientRequired) {
                            let message = `Something went wrong`;
                            if(checkApplied || isNotUseWithOther) {
                                message = `${coupon} not applied 1.`;
                            } else if(inValidFixDiscount) {
                                message = `Fix amount coupon not valid for inclusive tax`;
                            } else if(belowTotal) {
                                message = `Coupon applied on more than ${mintotal} amount`;
                            } else if(isClientRequired) {
                                message = 'Please select client for apply this coupon';
                            }

                            AppToaster({message});
                        } else {
                            cpn.push({name: coupon, ...foundCoupon});
                            let passamount = 0;
                            cpn.forEach((c: any) => {
                                passamount += (+c.amount);
                            });

                            setCouponList(clone(cpn));

                            discount = {
                                ...discount,
                                all:{...discount.all,productdiscountvalue:passamount+'',productdiscounttype :  discounttype,coupon:''}
                            }

                            setDiscount(discount)

                        }
                    }

                } else {
                    AppToaster({
                        message: `Coupon not applied 2`
                    });
                }
            }
        }
    };




    return (<View style={[styles.w_100, styles.p_6]}>

        <Form
            onSubmit={handleSubmit}
            initialValues={discount}
            render={({handleSubmit, submitting, form, values, ...more}: any) => {

                const {all,groups,selected} = values

                return (<View style={[styles.middle]}>
                    <View style={[styles.middleForm, {maxWidth: 400}]}>



                        <ScrollView>

                            <Caption style={[styles.caption]}>Discount</Caption>


                            <ToggleButtons
                                width={'50%'}
                                default={discount?.selected}
                                btns={[{label: 'On Total', value: 'all'}, {label: 'By Group', value: 'groups'}]}
                                onValueChange={(value:any)=>setDiscount({...values,selected: value})}
                            />

                            {(selected === 'all') && <>


                                {<>

                                    <View style={[styles.px_5]}>

                                        <View style={[styles.mt_5,styles.grid,styles.justifyContent,styles.center]}>
                                            <View style={[styles.w_auto]}>
                                                <Field name="all.coupon">
                                                    {props => (<InputField
                                                        {...props}
                                                        value={props.input.value}
                                                        label={`Coupon Code`}
                                                        autoFocus={false}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />)}
                                                </Field>
                                            </View>

                                            <View style={[styles.ml_2]}>
                                                <Button   onPress={()=>{
                                                   Boolean(values.all?.coupon) && couponCodeProcess(values.all.coupon)
                                                }}>
                                                    Add
                                                </Button>
                                            </View>

                                        </View>

                                        <View>
                                            {
                                                couponList.map((coupon:any,index:any)=>{
                                                    return <View key={index} style={[styles.justifyContent]}>
                                                        <Paragraph>{coupon.name}</Paragraph>
                                                        <Paragraph>{coupon.amount} {coupon.discounttype === 'percentage'?'%':getDefaultCurrency()}</Paragraph>
                                                        <TouchableOpacity onPress={()=>{
                                                            removeDiscount(index)
                                                        }}><Paragraph style={[styles.red]}>X</Paragraph></TouchableOpacity>
                                                    </View>
                                                })
                                            }
                                        </View>


                                    </View>


                                </>}


                                <View style={[styles.mt_5,{display: (Boolean(all.coupon) || couponList.length) ?'none':'flex'}]}>

                                    <View style={[styles.px_5]}>

                                        <View>
                                            <Field name="all.productdiscountvalue">
                                                {props => (<InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={`Discount`}
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
                                            {discountType.length > 1 && <ToggleButtons
                                                width={'50%'}
                                                default={discount?.all?.productdiscounttype}
                                                btns={discountType}
                                                onValueChange={(value:any)=>{
                                                    setDiscount({...values,all:{productdiscounttype:value}})
                                                }}
                                            />}
                                        </View>



                                    </View>
                                </View>
                            </> }



                            {selected === 'groups' &&   <>

                                <View style={[styles.px_5]}>

                                    {Object.keys(groups).map((key, index) => {
                                        return (
                                            <View style={[styles.grid, styles.justifyContent,styles.mt_5, styles.w_100,styles.borderBottom]} key={key}>

                                                <View>
                                                    <Paragraph>{grouplist[key]?.itemgroupname}</Paragraph>
                                                </View>


                                                <View style={{width: 150}}>
                                                    <View>
                                                        <Field  name={`groups[${key}].productdiscountvalue`}>
                                                            {props => (<InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={`Discount`}
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


