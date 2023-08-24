import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Caption, Paragraph, TextInput as TI} from "react-native-paper";

import {
    AppToaster,
    clone,
    findItemNew,
    getComboFlagData,
    getCurrencySign,
    getDefaultCurrency,
    getDiscountValueAndTYpe,
    groupBy,
    isEmpty,
    isInward, prelog,
    resetDiscount
} from "../../libs/function";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setCartData, setUpdateCart, updateCartField} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {COUPON_TYPE, ITEM_TYPE, localredux} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import ToggleButtons from "../../components/ToggleButton";
import {getProductData, itemTotalCalculation} from "../../libs/item-calculation";
import moment from "moment/moment";
import {v4} from "uuid";


const Index = ({cartData, grouplist}: any) => {

    const dispatch = useDispatch();

    const {discountdetail, orderbypax, invoiceitems,  vouchertotaldiscountamountdisplay} = cartData

    const [couponList, setCouponList] = useState([...cartData?.coupons] || []);
    const [morecoupon,setMorecoupon] = useState(false)
    const [discounteditems, setDiscounteditems]: any = useState(invoiceitems);

    let groupsby = groupBy(invoiceitems, 'itemgroupid', '', {
        productdiscounttype: '%',
        productdiscountvalue: '0'
    });

    if (discountdetail?.groups) {
        Object.keys(groupsby).map((key: any) => {
            groupsby[key] = {
                ...groupsby[key], ...discountdetail?.groups[key]
            }
        })
    }


    const [discount, setDiscount] = useState({
        total: {
            productdiscounttype: discountdetail?.total?.productdiscounttype || '%',
            productdiscountvalue: discountdetail?.total?.productdiscountvalue || '0'
        },
        groups: clone(groupsby),
        coupons:{coupon: '',coupontype: ''},
        selected: discountdetail?.selected || 'total'
    })



    useEffect(() => {
        Boolean(discountdetail) && setDiscount(discountdetail)
    }, [discountdetail])


    const isInclusive = Boolean(cartData.vouchertaxtype === 'inclusive');

    const handleSubmit = async (values: any) => {


        //await removeDiscount().then()


        await couponCodeProcess(values).then(async ({values, callbackitems,appliedcoupons}) => {

            const {total, selected}: any = values;

            if(Boolean(callbackitems?.length)) {

                cartData = {
                    ...cartData, //globaldiscountvalue: isInclusive ? 0 :  discount,
                    globaldiscountvalue: isInclusive ? 0 : selected === 'total' ? total?.productdiscountvalue : 0,
                    discounttype: selected === 'total' ? total?.productdiscounttype : '%',
                    updatecart: true,
                    discountdetail: values,
                    coupons: appliedcoupons,
                    invoiceitems: callbackitems
                }

                let data = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);


                await dispatch(setCartData(clone(data)));
                await dispatch(setUpdateCart());

                dispatch(setBottomSheet({visible: false}))
            }

        })


    }


    let discountType = [{label: 'Percentage', value: '%'}];
    if (!isInclusive && !orderbypax) {
        discountType.push({label: 'Amount', value: 'amount'})
    }


    if (!Boolean(discount)) {
        return <></>
    }


    const removeDiscount = async () => {
        await setDiscount(discount)
        await setCouponList([])
        await resetDiscount().then()
    }

    const clearDiscount = async (values:any) => {
        await setDiscount(values)
        await handleSubmit(values)

    }


    const getGroupComboFlagData = (foundCoupon: any, invoiceitems: any) => {
        const couponsData = localredux?.initData?.coupon;
        return new Promise(async (resolve) => {
            let cloneInvoiceItems = clone(invoiceitems);
            const combos = foundCoupon?.data?.combogroups;
            let buyOfferMatched = false, getOfferMatched = false;
            for (const campaingid of combos) {
                if (!buyOfferMatched || !getOfferMatched) {
                    const subfoundCoupon: any = Object.values(couponsData).find((singleCoupon: any) => singleCoupon?.campaignid == campaingid);
                    if (!isEmpty(subfoundCoupon)) {
                        const result: any = await getComboFlagData(subfoundCoupon, cloneInvoiceItems);
                        buyOfferMatched = result?.buyOfferMatched;
                        getOfferMatched = result?.getOfferMatched;

                        if (buyOfferMatched && getOfferMatched) {
                            foundCoupon = subfoundCoupon;
                            cloneInvoiceItems = result.invoiceitems;
                        }

                    }
                }
            }

            resolve({
                buyOfferMatched, getOfferMatched, invoiceitems: cloneInvoiceItems, foundCoupon
            });

        });

    };

    const couponCodeProcess = async (values?: any) => {

        const {total,coupons:{coupon},selected,groups} = values;

        return new Promise<any>(async (resolve) => {

            let callbackitems = []
            let appliedcoupons = []

            if (Boolean(selected === 'coupons') && Boolean(coupon)) {

                const couponsData = localredux?.initData?.coupon;

                if (isEmpty(couponsData)) {
                    AppToaster({
                        message: `No Coupon Added`
                    });
                } else {

                    let foundCoupon: any = Object.values(couponsData).find((singleCoupon: any) => singleCoupon?.coupon == coupon);
                    if (isEmpty(foundCoupon)) {
                        AppToaster({
                            message: `No Coupon Found`
                        });
                    } else {

                        let alreadyUsed = couponList?.some((c: any) => c?.name == coupon);

                        if (alreadyUsed) {
                            AppToaster({
                                message: `${coupon} already used.`
                            });
                        } else {

                            const currentDateStart = moment().startOf('day'), currentDateEnd = moment().endOf('day'),
                                startDate = moment(foundCoupon?.startdate).startOf('day'),
                                endDate = moment(foundCoupon?.enddate).endOf('day');

                            let couponStart = currentDateStart.diff(startDate, 'day');
                            let couponEnd = currentDateEnd.diff(endDate, 'day');


                            if (couponStart >= 0 && couponEnd <= 0) {
                                if ([COUPON_TYPE.COMBO, COUPON_TYPE.GROUP].some((type: string) => type == foundCoupon?.campaigndetail?.campaigntype)) {

                                    if (discount?.coupons?.coupontype === 'regular') {
                                        AppToaster({
                                            message: `Already regular coupon applied`
                                        });
                                    } else {

                                        let pricingTemplate = cartData?.client?.clientconfig?.pricingtemplate;
                                        let companyCurrency: any = getDefaultCurrency();
                                        let isInwards = isInward(cartData?.vouchertype);

                                        let cloneInvoiceItems = clone(cartData?.invoiceitems);

                                        let invoiceitems: any = [];
                                        cloneInvoiceItems.forEach((item: any) => {
                                            [...Array(+item.productqnt)].forEach(() => {
                                                invoiceitems.push({
                                                    ...item,
                                                    productqnt: 1,
                                                    key: v4(),
                                                    comboflag: false,
                                                    couponApplied: false
                                                });
                                            });
                                        });


                                        let counter = 0;
                                        let validMatched = true;
                                        let appliedOnce = false
                                        let comboCoupon = foundCoupon


                                        do {
                                            counter++;

                                            if (counter == 5) {
                                                validMatched = false;
                                            }

                                            let data: any;

                                            if (comboCoupon?.campaigndetail?.campaigntype == COUPON_TYPE.GROUP) {
                                                data = await getGroupComboFlagData(comboCoupon, invoiceitems);
                                                foundCoupon = data?.foundCoupon;
                                            } else {
                                                data = await getComboFlagData(comboCoupon, invoiceitems);
                                            }


                                            if (data?.buyOfferMatched && data?.getOfferMatched) {
                                                invoiceitems = data.invoiceitems;
                                                let newInvoiceItems: any = [];
                                                appliedOnce = true;


                                                let leftQuantity = foundCoupon?.data?.minbuy;
                                                let buyitems = foundCoupon?.data?.buyitems;
                                                let getitems = foundCoupon?.data?.getitems;
                                                let applyOnBuyItems = Boolean(foundCoupon?.data?.onbuyitem);
                                                let position: number = 0;

                                                invoiceitems.forEach((iItem: any) => {

                                                    if (!isEmpty(newInvoiceItems)) {
                                                        let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                                                        let lastItem = allitems[allitems.length - 1];
                                                        position = lastItem?.position;
                                                    }

                                                    position = position + 1;

                                                    if (Boolean(iItem?.comboflag) && !Boolean(iItem?.couponApplied)) {

                                                        let foundItem = findItemNew(buyitems, iItem);

                                                        let subSoundItem = undefined;
                                                        if (foundItem?.type == ITEM_TYPE.CATEGORY && !isEmpty(foundItem?.subitems)) {
                                                            subSoundItem = foundItem?.subitems.find((sitem: any) => sitem?.itemid == iItem?.productid);
                                                        }

                                                        if (applyOnBuyItems) {

                                                            if (!isEmpty(foundItem) && leftQuantity > 0 && (Boolean((+foundItem?.discountvalue) > 0) || Boolean((+subSoundItem?.discountvalue) > 0))) {

                                                                if (leftQuantity >= iItem?.productqnt) {

                                                                    leftQuantity = leftQuantity - (+iItem?.productqnt);

                                                                    const {
                                                                        discountvalue, discountType
                                                                    } = getDiscountValueAndTYpe(Boolean((+subSoundItem?.discountvalue) > 0) ? subSoundItem : foundItem, iItem, isInclusive);

                                                                    newInvoiceItems = [...newInvoiceItems, {
                                                                        ...iItem,
                                                                        productdiscountvalue: discountvalue,
                                                                        productdiscounttype: discountType,
                                                                        itemUpdate: true,
                                                                        position,
                                                                        itemindex: 1 + newInvoiceItems?.length,
                                                                        couponApplied: true
                                                                    }];

                                                                } else {
                                                                    let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                                                    let key: any = v4();
                                                                    let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);
                                                                    position = position + 1;

                                                                    const {
                                                                        discountvalue, discountType
                                                                    } = getDiscountValueAndTYpe(Boolean((+subSoundItem?.discountvalue) > 0) ? subSoundItem : foundItem, iItem, isInclusive);

                                                                    newInvoiceItems = [...newInvoiceItems, {
                                                                        ...iItem,
                                                                        productqnt: leftQuantity,
                                                                        productdiscountvalue: discountvalue,
                                                                        productdiscounttype: discountType,
                                                                        itemUpdate: true,
                                                                        position,
                                                                        itemindex: 1 + newInvoiceItems?.length,
                                                                        couponApplied: true
                                                                    }, {
                                                                        ...iItem,
                                                                        productqnt: setproductqnt, ...oldPrice,
                                                                        itemUpdate: true,
                                                                        key,
                                                                        position: position + 1,
                                                                        itemindex: 2 + newInvoiceItems?.length
                                                                    }];
                                                                    leftQuantity = 0;
                                                                }
                                                            } else {
                                                                let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);
                                                                newInvoiceItems = [...newInvoiceItems, {
                                                                    ...iItem, ...oldPrice,
                                                                    itemUpdate: true,
                                                                    position,
                                                                    itemindex: 1 + newInvoiceItems?.length
                                                                }];
                                                            }
                                                        } else {
                                                            if (!isEmpty(foundItem) || !isEmpty(subSoundItem)) {
                                                                newInvoiceItems = [...newInvoiceItems, {
                                                                    ...iItem,
                                                                    itemUpdate: true,
                                                                    position,
                                                                    itemindex: 1 + newInvoiceItems?.length,
                                                                    couponApplied: true
                                                                }];
                                                            } else {
                                                                newInvoiceItems = [...newInvoiceItems, {
                                                                    ...iItem,
                                                                    itemUpdate: true,
                                                                    position,
                                                                    itemindex: 1 + newInvoiceItems?.length
                                                                }];
                                                            }

                                                        }


                                                    } else {
                                                        newInvoiceItems = [...newInvoiceItems, {
                                                            ...iItem,
                                                            itemUpdate: true,
                                                            position,
                                                            itemindex: 1 + newInvoiceItems?.length
                                                        }];
                                                    }
                                                });

                                                invoiceitems = clone(newInvoiceItems);

                                                newInvoiceItems = [];

                                                if (!isEmpty(getitems)) {

                                                    let leftQuantity = foundCoupon?.data?.anygetqnt;
                                                    let position: number = 0;

                                                    invoiceitems.forEach((iItem: any) => {
                                                        if (!isEmpty(newInvoiceItems)) {
                                                            let allitems = clone(newInvoiceItems?.filter((item: any) => !Boolean(item?.combokey)));
                                                            let lastItem = allitems[allitems.length - 1];
                                                            position = lastItem?.position;
                                                        }
                                                        position = position + 1;
                                                        if (Boolean(iItem?.comboflag) && !Boolean(iItem?.couponApplied)) {
                                                            let foundItem = findItemNew(getitems, iItem);
                                                            if (!isEmpty(foundItem) && leftQuantity > 0 && (+foundItem?.discountvalue) > 0) {
                                                                if (leftQuantity >= iItem?.productqnt) {
                                                                    leftQuantity = leftQuantity - (+iItem?.productqnt);


                                                                    const {
                                                                        discountvalue, discountType
                                                                    } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                                                    newInvoiceItems = [...newInvoiceItems, {
                                                                        ...iItem,
                                                                        productdiscountvalue: discountvalue,
                                                                        productdiscounttype: discountType,
                                                                        itemUpdate: true,
                                                                        change:true,
                                                                        position,
                                                                        itemindex: 1 + newInvoiceItems?.length,
                                                                        couponApplied: true
                                                                    }];

                                                                } else {
                                                                    let setproductqnt = (+iItem?.productqnt) - leftQuantity;
                                                                    let key: any = v4();
                                                                    let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);

                                                                    const {
                                                                        discountvalue, discountType
                                                                    } = getDiscountValueAndTYpe(foundItem, iItem, isInclusive);

                                                                    newInvoiceItems = [...newInvoiceItems, {
                                                                        ...iItem,
                                                                        productqnt: leftQuantity,
                                                                        productdiscountvalue: discountvalue,
                                                                        productdiscounttype: discountType,
                                                                        itemUpdate: true,
                                                                        position,
                                                                        itemindex: 1 + newInvoiceItems?.length,
                                                                        couponApplied: true
                                                                    }, {
                                                                        ...iItem,
                                                                        productqnt: setproductqnt, ...oldPrice,
                                                                        itemUpdate: true,
                                                                        key,
                                                                        position: position + 1,
                                                                        itemindex: 2 + newInvoiceItems?.length
                                                                    }];
                                                                    leftQuantity = 0;
                                                                }

                                                            } else {
                                                                let oldPrice = getProductData(iItem?.itemdetail, cartData?.currency, companyCurrency, undefined, undefined, isInwards, pricingTemplate);
                                                                newInvoiceItems = [...newInvoiceItems, {
                                                                    ...iItem, ...oldPrice,
                                                                    itemUpdate: true,
                                                                    position,
                                                                    itemindex: 1 + newInvoiceItems?.length
                                                                }];
                                                            }
                                                        } else {
                                                            newInvoiceItems = [...newInvoiceItems, {
                                                                ...iItem,
                                                                itemUpdate: true,
                                                                position,
                                                                itemindex: 1 + newInvoiceItems?.length
                                                            }];
                                                        }

                                                    });
                                                } else {
                                                    newInvoiceItems = invoiceitems;
                                                }

                                                invoiceitems = clone(newInvoiceItems);
                                                callbackitems = invoiceitems


                                            } else {
                                                validMatched = false;
                                            }


                                        } while (validMatched);


                                        if (appliedOnce) {
                                            couponList.push({name: coupon});
                                            appliedcoupons = couponList
                                            //setCouponList(clone(couponList));
                                        } else {
                                            AppToaster({
                                                message: `Coupon not applicable`
                                            });
                                        }

                                        values = {
                                            ...values,
                                            total: {...values.total,   productdiscountvalue: '0'},
                                            coupons:{coupontype: 'combo',coupon: ''}
                                        }


                                        dispatch(updateCartField({combocoupon: true,updatecart:true}));


                                    }


                                } else {
                                    const {
                                        amount, discounttype, mintotal, clientrequired, usewithother
                                    } = foundCoupon;
                                    let cpn = couponList, isInclusive = cartData?.vouchertaxtype == 'inclusive';

                                    let checkApplied = cpn.some((c: any) => c.discounttype != discounttype),
                                        belowTotal = (+mintotal) > (+cartData?.vouchertotaldisplay),
                                        inValidFixDiscount = isInclusive && discounttype == 'fixed',
                                        isClientRequired = Boolean(+clientrequired) && Boolean(+cartData?.clientid == 1),
                                        isNotUseWithOther = !Boolean(usewithother) && !isEmpty(cpn);

                                    if ((!isEmpty(cpn) && (checkApplied || isNotUseWithOther)) || belowTotal || inValidFixDiscount || isClientRequired) {
                                        let message = `Something went wrong`;
                                        if (discount?.coupons?.coupontype === 'combo') {
                                            message = `Already combo coupon applied`;
                                        } else if (checkApplied || isNotUseWithOther) {
                                            message = `${coupon} not applied.`;
                                        } else if (inValidFixDiscount) {
                                            message = `Fix amount coupon not valid for inclusive tax`;
                                        } else if (belowTotal) {
                                            message = `Coupon applied on more than ${mintotal} amount`;
                                        } else if (isClientRequired) {
                                            message = 'Please select client for apply this coupon';
                                        }

                                        AppToaster({message});
                                    } else {
                                        cpn.push({name: coupon, ...foundCoupon});
                                        let passamount = 0;
                                        cpn.forEach((c: any) => {
                                            passamount += (+c.amount);
                                        });

                                        //setCouponList(clone(cpn));
                                        appliedcoupons = clone(cpn)

                                        values = {
                                            ...values,
                                            total: {
                                                ...values.all,
                                                productdiscountvalue: passamount + '',
                                                productdiscounttype: discounttype === 'percentage' ? '%' : discounttype,
                                            },
                                            coupons:{coupontype: 'regular',coupon: ''}
                                        }

                                        dispatch(updateCartField({combocoupon: false,updatecart:true}));

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
            } else {

                callbackitems = discounteditems.map((item: any) => {
                    item = {...item, productdiscountvalue: 0}

                    if (isInclusive || (Boolean(selected === 'groups') && Boolean(groups[item.itemgroupid].productdiscountvalue))) {
                        item = {
                            ...item,
                            productdiscountvalue: selected === 'total' ? total.productdiscountvalue : groups[item.itemgroupid].productdiscountvalue,
                            productdiscounttype: selected === 'total' ? total.productdiscounttype : '%',
                        }
                    }
                    return {...item, change: true,itemUpdate:true}
                })
            }

            resolve({values, callbackitems,appliedcoupons})

        })


    };


    return (<View style={[styles.w_100, styles.p_6]}>

        <Form
            onSubmit={handleSubmit}
            initialValues={discount}
            render={({handleSubmit, submitting, form, values, ...more}: any) => {

                const {total, groups,coupons, selected} = values


                return (<View style={[styles.middle]}>
                    <View style={[styles.middleForm, {maxWidth: 400}]}>


                        <ScrollView>

                            <Caption style={[styles.caption]}>Discount</Caption>


                            <ToggleButtons
                                width={'33.3%'}
                                default={selected}
                                disabled={Boolean(vouchertotaldiscountamountdisplay)}
                                btns={[{label: 'On Total', value: 'total'},{label: 'Coupon', value: 'coupons'}, {label: 'By Group', value: 'groups'}]}
                                onValueChange={(value: any) => setDiscount({...values, selected: value})}
                            />

                            {(selected === 'total') && <View>

                                    <View style={[styles.mt_5]}>

                                        {!Boolean(vouchertotaldiscountamountdisplay) && <>

                                            <View>
                                                {discountType.length > 1 && <ToggleButtons
                                                    width={'50%'}
                                                    default={total?.productdiscounttype}
                                                    btns={discountType}
                                                    onValueChange={(value: any) => {
                                                        setDiscount({...values, total: {productdiscounttype: value}})
                                                    }}
                                                />}
                                            </View>


                                            <View>
                                                <Field name="total.productdiscountvalue">
                                                    {props => (<InputField
                                                        {...props}
                                                        value={props.input.value}
                                                        label={`Discount`}
                                                        autoFocus={false}
                                                        right={<TI.Affix
                                                            text={total.productdiscounttype === '%' ? '%' : getCurrencySign()}/>}
                                                        inputtype={'textbox'}
                                                        keyboardType={'numeric'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />)}
                                                </Field>
                                            </View>


                                        </>}


                                        <View>

                                            {Boolean(vouchertotaldiscountamountdisplay) && <><View
                                                style={[styles.border, styles.px_5, styles.mt_5, styles.mb_5, {borderRadius: 10}]}>
                                                <Caption style={[styles.py_3]}>Applied Discount</Caption>
                                                <View style={[styles.justifyContent, styles.py_5]}>
                                                    <Paragraph>{total.productdiscountvalue}</Paragraph>
                                                    <Paragraph>{total.productdiscounttype}</Paragraph>
                                                </View>
                                            </View>

                                            </>}


                                        </View>


                                    </View>


                                </View>}

                            {(selected === 'coupons') && <View>
                                    {(!Boolean(couponList?.length) || morecoupon)   &&
                                        <View style={[styles.mt_5]}>
                                            <View>
                                                <Field name="coupons.coupon">
                                                    {props => (<InputField
                                                        {...props}
                                                        value={props.input.value}
                                                        label={`Coupon Code`}
                                                        autoFocus={false}
                                                        autoCapitalize='none'
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />)}
                                                </Field>
                                            </View>


                                        </View>}

                                    {Boolean(couponList?.length) && <View>
                                        <View
                                            style={[styles.border, styles.px_5, styles.mt_5, styles.mb_5, {borderRadius: 10}]}>
                                            <Caption style={[styles.py_3]}>Applied Coupon(s)</Caption>
                                            {couponList.map((coupon: any, index: any) => {
                                                return <View key={index} style={[styles.justifyContent, styles.py_5]}>
                                                    <Paragraph>{coupon.name}</Paragraph>
                                                    <Paragraph>{coupon.amount} {coupon.discounttype === 'percentage' ? '%' : getDefaultCurrency()}</Paragraph>

                                                </View>
                                            })}
                                        </View>


                                        <TouchableOpacity
                                            onPress={() => {
                                                setMorecoupon(true)
                                            }}
                                            style={[{
                                                height:30
                                            }]}>
                                            <View
                                                style={[ styles.middle, styles.right, styles.w_100, styles.h_100]}>
                                                <View>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.bold]}>Add More coupon</Paragraph>
                                                </View>
                                            </View>
                                        </TouchableOpacity>


                                    </View>}

                                </View>}

                            {selected === 'groups' && <View>

                                    {Object.keys(groups).map((key, index) => {
                                        return (<View
                                            style={[styles.grid, styles.justifyContent, styles.mt_5, styles.w_100, styles.borderBottom]}
                                            key={key}>

                                            <View style={{width: '50%'}}>
                                                <Paragraph>{grouplist[key]?.itemgroupname}</Paragraph>
                                            </View>


                                            <View style={{width: '50%'}}>
                                                <View>
                                                    <Field name={`groups[${key}].productdiscountvalue`}>
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


                                </View>}


                        </ScrollView>


                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>

                                {Boolean(vouchertotaldiscountamountdisplay) && <View>
                                    <TouchableOpacity
                                        onPress={async () => {
                                            Object.keys(groupsby).map((key: any) => {
                                                groupsby[key] = {
                                                    ...groupsby[key], ...discountdetail?.groups[key],productdiscountvalue:''
                                                }
                                            })
                                            values = {
                                                ...values,
                                                total: {...total,   productdiscountvalue: 0},
                                                coupons:{coupontype: '',coupon: ''},
                                                groups:groupsby,
                                            }
                                            await setCouponList([])
                                            clearDiscount(values).then()
                                        }}
                                        style={[{
                                            backgroundColor: styles.secondary.color,
                                            borderRadius: 7,
                                            height: 50,
                                            marginTop: 20,

                                        }]}>
                                        <View
                                            style={[styles.grid, styles.noWrap, styles.middle, styles.center, styles.w_100, styles.h_100]}>
                                            <View>
                                                <Paragraph style={[styles.paragraph, styles.bold, {color: 'black'}]}>Clear
                                                    Discount</Paragraph>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>}

                                {(!Boolean(vouchertotaldiscountamountdisplay) || morecoupon) &&  <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}
                                            style={[{
                                                backgroundColor: styles.primary.color,
                                                borderRadius: 7,
                                                height: 50,
                                                marginTop: 10,

                                            }]}>
                                            <View
                                                style={[styles.grid, styles.noWrap, styles.middle, styles.center, styles.w_100, styles.h_100]}>
                                                <View>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.bold, {color: 'white'}]}>Apply</Paragraph>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </View>}




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


