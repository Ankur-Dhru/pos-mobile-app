import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph, TextInput as TI} from "react-native-paper";

import {
    AppToaster,
    checkCriteria,
    clone,
    errorAlert, findItem, findItemNew, getComboFlagData,
    getCurrencySign,
    getDefaultCurrency, getDiscountValueAndTYpe,
    groupBy,
    isEmpty, isInward,
    prelog, resetDiscount,
    saveLocalSettings
} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart, updateCartField} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {COUPON_TYPE, ITEM_TYPE, localredux, required} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import ToggleButtons from "../../components/ToggleButton";
import {getProductData, itemTotalCalculation} from "../../libs/item-calculation";
import moment from "moment/moment";
import {v4} from "uuid";
import {Button} from "../../components";


const Index = ({cartData, grouplist}: any) => {

    const dispatch = useDispatch();

    const {discountdetail,orderbypax,invoiceitems,combocoupon,vouchertotaldiscountamountdisplay} = cartData
    let coupons = cartData?.coupons || []
    coupons = [...coupons]
    let [couponList,setCouponList] = useState(coupons || [])
    let [discounteditems,setDiscounteditems]:any = useState();

    let groupsby = groupBy(cartData.invoiceitems, 'itemgroupid', '', {productdiscounttype:'%',productdiscountvalue:'0'});
    if(discountdetail?.groups){
        Object.keys(groupsby).map((key:any)=>{
            groupsby[key] = {
                ...groupsby[key],
                ...discountdetail?.groups[key]
            }
        })
    }

    const [morecoupon,setMorecoupon] = useState(!Boolean(coupons.length))
    let [discount,setDiscount] = useState({coupontype:'',all:{coupon:'',productdiscounttype:discountdetail?.all?.productdiscounttype || '%',productdiscountvalue:discountdetail?.all?.productdiscountvalue || '0'},groups:  groupsby,selected: discountdetail?.selected || 'all'})




    useEffect(()=>{
       Boolean(discountdetail) && setDiscount(discountdetail)
    },[discountdetail])




    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');

    const handleSubmit = async (values: any) => {

            await removeDiscount().then()


            const {groups, all, selected}: any = values;

            cartData = {
                ...cartData, //globaldiscountvalue: isInclusive ? 0 :  discount,
                globaldiscountvalue: isInclusive ? 0 : selected === 'all' ? all.productdiscountvalue : 0,
                discounttype: selected === 'all' ? all.productdiscounttype : '%',
                updatecart: true,
                discountdetail: values,
                coupons: couponList,
                combocoupon: Boolean(discounteditems?.length),
                invoiceitems: Boolean(discounteditems?.length)? discounteditems : cartData.invoiceitems.map((item: any) => {
                    item = {...item, productdiscountvalue: 0, productdiscounttype: ''}

                    if (isInclusive || (Boolean(selected === 'groups') && Boolean(groups[item.itemgroupid].productdiscountvalue))) {
                        item = {
                            ...item,
                            productdiscountvalue: selected === 'all' ? all.productdiscountvalue : groups[item.itemgroupid].productdiscountvalue,
                            productdiscounttype: selected === 'all' ? all.productdiscounttype : '%',
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



    const removeDiscount = async () => {
        setDiscount(discount)
        setMorecoupon(true)
        setCouponList([])
        resetDiscount().then()
    }


    const getMatchedCriteriaData = (foundCoupon: any, invoiceitems: any) => {
        return new Promise((resolve) => {

            let buyitems = foundCoupon?.data?.buyitems;
            let getitems = foundCoupon?.data?.getitems;

            let buyCriteriaMatched = checkCriteria(buyitems, invoiceitems, foundCoupon, 'buy');

            let getCriteriaMatched = checkCriteria(getitems, invoiceitems, foundCoupon, 'get');

            if(Boolean(foundCoupon?.data?.onbuyitem) && isEmpty(getitems) && buyCriteriaMatched) {
                getCriteriaMatched = true;
            }

            resolve({ buyCriteriaMatched, getCriteriaMatched, foundCoupon });
        });

    };

    const getMatchedCriteriaDataGroup = (foundCoupon: any, invoiceitems: any) => {
        const couponsData = localredux?.initData?.coupon;
        return new Promise(async(resolve) => {

            const combos           = foundCoupon?.data?.combogroups;
            let buyCriteriaMatched = false, getCriteriaMatched = false;
            for(const campaingid of combos) {
                if(!buyCriteriaMatched || !getCriteriaMatched) {
                    const subfoundCoupon: any = Object.values(couponsData).find((singleCoupon: any) => singleCoupon?.campaignid == campaingid);
                    let result: any           = await getMatchedCriteriaData(subfoundCoupon, invoiceitems);
                    buyCriteriaMatched        = result?.buyCriteriaMatched;
                    getCriteriaMatched        = result?.getCriteriaMatched;
                    if(buyCriteriaMatched && getCriteriaMatched) {
                        foundCoupon = subfoundCoupon;
                    }
                }
            }

            resolve({ buyCriteriaMatched, getCriteriaMatched, foundCoupon });
        });

    };



    const getGroupComboFlagData = (foundCoupon: any, invoiceitems: any) => {
        const couponsData = localredux?.initData?.coupon;
        return new Promise(async(resolve) => {
            let cloneInvoiceItems = clone(invoiceitems);
            const combos          = foundCoupon?.data?.combogroups;
            let buyOfferMatched   = false, getOfferMatched = false;
            for(const campaingid of combos) {
                if(!buyOfferMatched || !getOfferMatched) {
                    const subfoundCoupon: any = Object.values(couponsData).find((singleCoupon: any) => singleCoupon?.campaignid == campaingid);
                    if(!isEmpty(subfoundCoupon)) {
                        const result: any = await getComboFlagData(subfoundCoupon, cloneInvoiceItems);
                        buyOfferMatched   = result?.buyOfferMatched;
                        getOfferMatched   = result?.getOfferMatched;

                        if(buyOfferMatched && getOfferMatched) {
                            foundCoupon       = subfoundCoupon;
                            cloneInvoiceItems = result.invoiceitems;
                        }

                    }
                }
            }

            resolve({
                buyOfferMatched,
                getOfferMatched,
                invoiceitems: cloneInvoiceItems,
                foundCoupon
            });

        });

    };

    const couponCodeProcess = async(coupon?:any) => {


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
            let foundCoupon: any = Object.values(couponsData).find((singleCoupon: any) => singleCoupon?.coupon == coupon);
            if(isEmpty(foundCoupon)) {
                AppToaster({
                    message: `No Coupon Found`
                });
            } else {

                let alreadyUsed = couponList?.some((c: any) => c?.name == coupon);

                if(alreadyUsed) {
                    AppToaster({
                        message: `${coupon} already used.`
                    });
                }
                else {
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
                        if([
                            COUPON_TYPE.COMBO,
                            COUPON_TYPE.GROUP
                        ].some((type: string) => type == foundCoupon?.campaigndetail?.campaigntype)) {

                            if(discount?.coupontype === 'regular'){
                                AppToaster({
                                    message: `Already regular coupon applied`
                                });
                            }
                            else{

                                let pricingTemplate = cartData?.client?.clientconfig?.pricingtemplate;
                                let companyCurrency:any = getDefaultCurrency();
                                let isInwards       = isInward(cartData?.vouchertype);

                                let cloneInvoiceItems = clone(cartData?.invoiceitems);

                                let invoiceitems: any = [];
                                cloneInvoiceItems.forEach((item: any) => {
                                    [...Array(+item.productqnt)].forEach(() => {
                                        invoiceitems.push({
                                            ...item, productqnt: 1, key: v4(), comboflag: false,
                                            couponApplied      : false
                                        });
                                    });
                                });


                                let counter = 0;
                                let validMatched = true;
                                let appliedOnce = false
                                let comboCoupon = foundCoupon
                                let newInvoiceItems: any = [];

                                do {
                                    counter++;
                                    if(counter == 10) {
                                        validMatched = false;
                                    }

                                    let data: any;

                                    if(comboCoupon?.campaigndetail?.campaigntype == COUPON_TYPE.GROUP) {
                                        data        = await getGroupComboFlagData(comboCoupon, invoiceitems);
                                        foundCoupon = data?.foundCoupon;
                                    } else {
                                        data = await getComboFlagData(comboCoupon, invoiceitems);
                                    }


                                    if(data?.buyOfferMatched && data?.getOfferMatched) {
                                        invoiceitems = data.invoiceitems;

                                        appliedOnce = true;



                                        let leftQuantity     = foundCoupon?.data?.minbuy;
                                        let buyitems         = foundCoupon?.data?.buyitems;
                                        let getitems         = foundCoupon?.data?.getitems;
                                        let applyOnBuyItems  = Boolean(foundCoupon?.data?.onbuyitem);
                                        let position: number = 0;

                                        invoiceitems.forEach((iItem: any) => {

                                            if(!isEmpty(newInvoiceItems)) {
                                                let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                                                let lastItem = allitems[allitems.length - 1];
                                                position     = lastItem?.position;
                                            }

                                            position = position + 1;

                                            if(Boolean(iItem?.comboflag) && !Boolean(iItem?.couponApplied)) {

                                                let foundItem = findItemNew(buyitems, iItem);

                                                let subSoundItem = undefined;
                                                if(foundItem?.type == ITEM_TYPE.CATEGORY && !isEmpty(foundItem?.subitems)) {
                                                    subSoundItem = foundItem?.subitems.find((sitem: any) => sitem?.itemid == iItem?.productid);
                                                }

                                                if(applyOnBuyItems) {

                                                    if(!isEmpty(foundItem) &&
                                                        leftQuantity > 0 &&
                                                        (Boolean((+foundItem?.discountvalue) > 0) || Boolean((+subSoundItem?.discountvalue) > 0))) {

                                                        if(leftQuantity >= iItem?.productqnt) {

                                                            leftQuantity = leftQuantity - (+iItem?.productqnt);

                                                            const {
                                                                discountvalue,
                                                                discountType
                                                            } = getDiscountValueAndTYpe(Boolean((+subSoundItem?.discountvalue) > 0) ? subSoundItem : foundItem, iItem, isInclusive);

                                                            newInvoiceItems = [
                                                                ...newInvoiceItems,
                                                                {
                                                                    ...iItem,
                                                                    productdiscountvalue: discountvalue,
                                                                    productdiscounttype : discountType,
                                                                    itemUpdate          : true,
                                                                    position,
                                                                    itemindex           : 1 + newInvoiceItems?.length,
                                                                    couponApplied       : true
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
                                                            } = getDiscountValueAndTYpe(Boolean((+subSoundItem?.discountvalue) > 0) ? subSoundItem : foundItem, iItem, isInclusive);

                                                            newInvoiceItems = [
                                                                ...newInvoiceItems,
                                                                {
                                                                    ...iItem,
                                                                    productqnt          : leftQuantity,
                                                                    productdiscountvalue: discountvalue,
                                                                    productdiscounttype : discountType,
                                                                    itemUpdate          : true,
                                                                    position,
                                                                    itemindex           : 1 + newInvoiceItems?.length,
                                                                    couponApplied       : true
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
                                                } else {
                                                    if(!isEmpty(foundItem) || !isEmpty(subSoundItem)) {
                                                        newInvoiceItems = [
                                                            ...newInvoiceItems,
                                                            {
                                                                ...iItem,
                                                                itemUpdate   : true,
                                                                position,
                                                                itemindex    : 1 + newInvoiceItems?.length,
                                                                couponApplied: true
                                                            }
                                                        ];
                                                    } else {
                                                        newInvoiceItems = [
                                                            ...newInvoiceItems,
                                                            {
                                                                ...iItem,
                                                                itemUpdate: true,
                                                                position,
                                                                itemindex : 1 + newInvoiceItems?.length
                                                            }
                                                        ];
                                                    }

                                                }


                                            } else {
                                                newInvoiceItems = [
                                                    ...newInvoiceItems,
                                                    {
                                                        ...iItem,
                                                        itemUpdate: true,
                                                        position,
                                                        itemindex : 1 + newInvoiceItems?.length
                                                    }
                                                ];
                                            }
                                        });

                                        invoiceitems = clone(newInvoiceItems);


                                        newInvoiceItems = [];

                                        if(!isEmpty(getitems)) {

                                            let leftQuantity     = foundCoupon?.data?.anygetqnt;
                                            let position: number = 0;

                                            invoiceitems.forEach((iItem: any) => {
                                                if(!isEmpty(newInvoiceItems)) {
                                                    let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                                                    let lastItem = allitems[allitems.length - 1];
                                                    position     = lastItem?.position;
                                                }
                                                position = position + 1;
                                                if(Boolean(iItem?.comboflag) && !Boolean(iItem?.couponApplied)) {
                                                    let foundItem = findItemNew(getitems, iItem);
                                                    if(!isEmpty(foundItem) && leftQuantity > 0 && (+foundItem?.discountvalue) > 0) {
                                                        if(leftQuantity >= iItem?.productqnt) {
                                                            leftQuantity = leftQuantity - (+iItem?.productqnt);


                                                            const {
                                                                discountvalue,
                                                                discountType
                                                            } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                                            newInvoiceItems = [
                                                                ...newInvoiceItems,
                                                                {
                                                                    ...iItem,
                                                                    productdiscountvalue: discountvalue,
                                                                    productdiscounttype : discountType,
                                                                    itemUpdate          : true,
                                                                    position,
                                                                    itemindex           : 1 + newInvoiceItems?.length,
                                                                    couponApplied       : true
                                                                }
                                                            ];

                                                        } else {
                                                            let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                                            let key: any      = v4();
                                                            let oldPrice      = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);

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
                                                                    itemindex           : 1 + newInvoiceItems?.length,
                                                                    couponApplied       : true
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
                                                } else {
                                                    newInvoiceItems = [
                                                        ...newInvoiceItems,
                                                        {
                                                            ...iItem,
                                                            itemUpdate: true,
                                                            position,
                                                            itemindex : 1 + newInvoiceItems?.length
                                                        }
                                                    ];
                                                }

                                            });
                                        } else {
                                            newInvoiceItems = invoiceitems;
                                        }


                                        invoiceitems = clone(newInvoiceItems);



                                    } else {
                                        validMatched = false;
                                    }


                                } while(validMatched);


                                if(appliedOnce) {
                                    couponList.push({ name: coupon });
                                    setCouponList(clone(couponList));
                                } else {
                                    AppToaster({
                                        message: `Coupon not applicable`
                                    });
                                }

                                discount = {
                                    ...discount,
                                    coupontype:'combo',
                                    all:{...discount.all,coupon:'',productdiscountvalue:'0'}
                                }
                                setDiscount(discount)
                                setDiscounteditems(newInvoiceItems)
                                setMorecoupon(false)

                                dispatch(setCartData({ invoiceitems: newInvoiceItems, updatecart: true, combocoupon: true }));











                                    /*discount = {
                                        ...discount,
                                        coupontype:'combo',
                                        all:{...discount.all,coupon:'',productdiscountvalue:'0'}
                                    }
                                    setDiscount(discount)
                                    setDiscounteditems(newInvoiceItems)
                                    setMorecoupon(false)*/



                            }


                        } else {
                            const {
                                amount,
                                discounttype,
                                mintotal,
                                clientrequired,
                                usewithother
                            }         = foundCoupon;
                            let cpn         = couponList,
                                isInclusive = cartData?.vouchertaxtype == 'inclusive';

                            let checkApplied       = cpn.some((c: any) => c.discounttype != discounttype),
                                belowTotal         = (+mintotal) > (+cartData?.vouchertotaldisplay),
                                inValidFixDiscount = isInclusive && discounttype == 'fixed',
                                isClientRequired   = Boolean(+clientrequired) && Boolean(+cartData?.clientid == 1),
                                isNotUseWithOther  = !Boolean(usewithother) && !isEmpty(cpn);

                            if((!isEmpty(cpn) && (checkApplied || isNotUseWithOther)) || belowTotal || inValidFixDiscount || isClientRequired) {
                                let message = `Something went wrong`;
                                if(discount?.coupontype === 'combo'){
                                    message = `Already combo coupon applied`;
                                }
                                else if(checkApplied || isNotUseWithOther) {
                                    message = `${coupon} not applied.`;
                                } else if(inValidFixDiscount) {
                                    message = `Fix amount coupon not valid for inclusive tax`;
                                } else if(belowTotal) {
                                    message = `Coupon applied on more than ${mintotal} amount`;
                                } else if(isClientRequired) {
                                    message = 'Please select client for apply this coupon';
                                }

                                AppToaster({ message });
                            } else {
                                cpn.push({ name: coupon, ...foundCoupon });
                                let passamount = 0;
                                cpn.forEach((c: any) => {
                                    passamount += (+c.amount);
                                });

                                setCouponList(clone(cpn));

                                discount = {
                                    ...discount,
                                    coupontype:'regular',
                                    all:{...discount.all,productdiscountvalue:passamount+'',productdiscounttype :  discounttype === 'percentage'?'%':discounttype,coupon:''}
                                }

                                setDiscount(discount)
                                setMorecoupon(false)

                            }
                        }

                    } else {
                        AppToaster({
                            message: `Coupon not applied`
                        });
                    }
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

                               <View>
                                        {(!Boolean(couponList.length) || morecoupon) && !Boolean(+values.all.productdiscountvalue)  && <View style={[styles.mt_5,styles.grid,styles.justifyContent,styles.top]}>
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

                                            <View style={[styles.ml_2,{paddingTop:7}]}>
                                                <Button  more={{
                                                    height: 55,
                                                    borderRadius: 5,

                                                }}  onPress={()=>{
                                                   Boolean(values.all?.coupon) && couponCodeProcess(values.all.coupon)
                                                }}>
                                                    Add
                                                </Button>
                                            </View>

                                        </View>}

                                        <View>

                                            {Boolean(couponList?.length) && <View style={[styles.border,styles.px_5,styles.mt_5,styles.mb_5,{borderRadius:10}]}>
                                                <Caption style={[styles.py_3]}>Applied Coupon(s)</Caption>
                                                {
                                                    couponList.map((coupon:any,index:any)=>{
                                                        return <View key={index} style={[styles.justifyContent,styles.py_5]}>
                                                            <Paragraph>{coupon.name}</Paragraph>
                                                            <Paragraph>{coupon.amount} {coupon.discounttype === 'percentage'?'%':getDefaultCurrency()}</Paragraph>
                                                            {/*<TouchableOpacity onPress={()=>{
                                                                removeDiscount(index)
                                                            }}><Paragraph style={[styles.red]}>X</Paragraph></TouchableOpacity>*/}
                                                        </View>
                                                    })
                                                }

                                            </View>}


                                        </View>


                                    </View>

                                {Boolean(couponList?.length) && <View style={[styles.flex,styles.justifyContent]}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            removeDiscount().then()
                                        }}
                                        style={[{
                                            backgroundColor: styles.red.color,
                                            borderRadius: 5,
                                        }]}>
                                        <Paragraph style={[styles.paragraph,styles.px_5,styles.py_3, styles.bold,{color:'white'}]}>Clear Coupon</Paragraph>
                                    </TouchableOpacity>

                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setMorecoupon(true)
                                            }}
                                            style={[{
                                                backgroundColor: styles.secondary.color,
                                                borderRadius: 5,
                                            }]}>
                                            <Paragraph style={[styles.paragraph,styles.px_5,styles.py_3, styles.bold]}>Add More Coupon</Paragraph>
                                        </TouchableOpacity>
                                    </View>

                                </View>}

                                <View style={[{display: (Boolean(all.coupon) || couponList.length) ?'none':'flex'}]}>

                                    <View style={[styles.mt_5]}>

                                        {!Boolean(+discount.all.productdiscountvalue) &&  <>
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
                                        </>}


                                        <View>

                                            {Boolean(+discount.all.productdiscountvalue) && <><View style={[styles.border,styles.px_5,styles.mt_5,styles.mb_5,{borderRadius:10}]}>
                                                <Caption style={[styles.py_3]}>Applied Discount</Caption>
                                                <View   style={[styles.justifyContent,styles.py_5]}>
                                                    <Paragraph>{values.all.productdiscountvalue}</Paragraph>
                                                    <Paragraph>{values.all.productdiscounttype}</Paragraph>
                                                </View>
                                            </View>
                                                <View style={[styles.flex,styles.justifyContent]}>

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            discount = {
                                                                ...discount,
                                                                coupontype:'',
                                                                all:{...discount.all,coupon:'',productdiscountvalue:'0'}
                                                            }
                                                            setDiscount(discount)
                                                            removeDiscount().then()
                                                        }}
                                                        style={[{
                                                            backgroundColor: styles.red.color,
                                                            borderRadius: 5,
                                                        }]}>
                                                        <Paragraph style={[styles.paragraph,styles.px_5,styles.py_3, styles.bold,{color:'white'}]}>Reset Discount</Paragraph>
                                                    </TouchableOpacity>

                                                </View>
                                            </>}


                                        </View>


                                    </View>




                                </View></>}

                            {selected === 'groups' &&   <>

                                <View>

                                    {Object.keys(groups).map((key, index) => {
                                        return (
                                            <View style={[styles.grid, styles.justifyContent,styles.mt_5, styles.w_100,styles.borderBottom]} key={key}>

                                                <View style={{width:'50%'}}>
                                                    <Paragraph>{grouplist[key]?.itemgroupname}</Paragraph>
                                                </View>


                                                <View style={{width: '50%'}}>
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
                                            backgroundColor: styles.primary.color,
                                            borderRadius: 7,
                                            height: 50,
                                            marginTop: 20,

                                        }]}>
                                        <View
                                            style={[styles.grid, styles.noWrap, styles.middle, styles.center, styles.w_100, styles.h_100]}>
                                            <View>
                                                <Paragraph style={[styles.paragraph, styles.bold,{color:'white'}]}>Apply</Paragraph>
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
    cartData: state.cartData,
    grouplist: state.groupList
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


