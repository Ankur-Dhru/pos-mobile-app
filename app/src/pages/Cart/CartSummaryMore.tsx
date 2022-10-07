import React, {memo, useEffect, useRef, useState} from "react";
import {appLog, clone, saveLocalSettings, toCurrency, updateComponent, voucherData} from "../../libs/function";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {device, VOUCHER} from "../../libs/static";
import {ProIcon} from "../../components";
import Discount from "./Discount";
import SwitchC from "../../components/Switch";


const Index =  ({cartData}: any) => {

    const {vouchersubtotaldisplay, globaltax,globaldiscountvalue,adjustmentamount,vouchertaxtype,discounttype,invoiceitems, voucherroundoffdisplay} = cartData

    const dispatch = useDispatch()

    const [globaldiscount, setGlobalDiscount] = useState(globaldiscountvalue);
    const [adjustment, setAdjustment] = useState(adjustmentamount);
    const [discountType, setDiscountType] = useState(discounttype);


    useEffect(()=>{
        calculation()
    },[])

    const calculation = async() => {
        let data = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
        await dispatch(setCartData(clone(data)));
        await dispatch(setUpdateCart());
    }

    useEffect(() => {
        if (!Boolean(globaldiscountvalue)) {
            setGlobalDiscount("")
        }
    }, [globaldiscountvalue])

    useEffect(() => {
        if (!Boolean(adjustment) && Boolean(adjustmentamount)) {
            setAdjustment(adjustmentamount)
        }
        if (!Boolean(adjustmentamount)) {
            setAdjustment("")
        }
    }, [adjustmentamount])


    useEffect(() => onBlurHandler(), [discountType])



    const onBlurHandler = () => {
        dispatch(setCartData({
            adjustmentamount: adjustment,
            updatecart: true
        }));
    }



    const onBlurDiscount = () => {

        dispatch(setCartData({
            globaldiscountvalue: vouchertaxtype === "inclusive" ? 0 : globaldiscount,
            adjustmentamount: adjustment,
            discounttype: discountType,
            updatecart: true,
            invoiceitems: invoiceitems.map((item: any) => {
                if (vouchertaxtype === "inclusive") {
                    item = {...item, productdiscountvalue: globaldiscount, productdiscounttype: discountType}
                }
                return {...item, change: true}
            })
        }));
    }

    /*const toggleSwitch = (value:any) => {
        saveLocalSettings('realtimetotalcalculation',value).then()
    }*/

  /*  if(loader){
        return <View style={{height:200}}><ActivityIndicator  color={'#016EFE'} size='large' animating={true}   /></View>
    }*/

    appLog('summary more')

    return (<View>



                <View style={[styles.grid, styles.justifyContent]}>
                    <View><Paragraph style={[styles.paragraph]}>Subtotal</Paragraph></View>
                    <View><Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(vouchersubtotaldisplay)}</Paragraph></View>
                </View>

                {/*<View>*/}
                {/*    <Discount/>*/}
                {/*</View>*/}

                {
                    globaltax?.map((tax: any, key: any) => {
                        return (
                            <View style={[styles.grid, styles.justifyContent]} key={key}>
                                <View><Paragraph style={[styles.paragraph]}>{tax.taxname}</Paragraph></View>
                                <View><Paragraph
                                    style={[styles.paragraph]}>{toCurrency(tax.taxpricedisplay)}</Paragraph></View>
                            </View>
                        )
                    })
                }

                {Boolean(voucherroundoffdisplay) && <View style={[styles.grid, styles.justifyContent]}>
                    <View><Paragraph style={[styles.paragraph]}>Roundoff</Paragraph></View>
                    <View><Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(voucherroundoffdisplay)}</Paragraph></View>
                </View>}

            </View>)
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));