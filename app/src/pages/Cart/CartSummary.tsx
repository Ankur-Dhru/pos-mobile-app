import React, {useEffect, useRef, useState} from "react";
import {appLog, clone, saveLocalSettings, toCurrency, updateComponent, voucherData} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {device, VOUCHER} from "../../libs/static";
import {ProIcon} from "../../components";
import Discount from "./Discount";
import SwitchC from "../../components/Switch";


const Index = ({cartData,localSettings}: any) => {

    const {vouchersubtotaldisplay, vouchertotaldisplay, globaltax,globaldiscountvalue,adjustmentamount,vouchertaxtype,discounttype,invoiceitems, voucherroundoffdisplay} = cartData

    const dispatch = useDispatch()

    const [summary,setSummary]:any = useState(false);

    const [globaldiscount, setGlobalDiscount] = useState(globaldiscountvalue);
    const [adjustment, setAdjustment] = useState(adjustmentamount);
    const [discountType, setDiscountType] = useState(discounttype);

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

    const setTotal = () => {
        if(!summary){
            let data = itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
            dispatch(setCartData(clone(data)));
            dispatch(setUpdateCart());
        }
        setSummary(!summary)
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


    return (<Card   onPress={()=>{setTotal()}} style={[styles.mt_3]}>
        <Card.Content >

            <View><Paragraph style={[styles.absolute,{top:0,left:'50%',marginLeft:-10}]}><ProIcon name={summary?'chevron-down':'chevron-up'} action_type={'text'} size={15}/></Paragraph></View>

            <View style={{display:summary?'flex':'none'}}>



                <View style={[styles.grid, styles.justifyContent]}>
                    <View><Paragraph style={[styles.paragraph]}>Subtotal</Paragraph></View>
                    <View><Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(vouchersubtotaldisplay)}</Paragraph></View>
                </View>

                {/*<View>
                    <Discount/>
                </View>*/}

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

            </View>


            <View style={[styles.grid, styles.justifyContent]}>
                <View style={{width:'40%'}}><Paragraph style={[styles.paragraph,styles.bold]}>Total </Paragraph></View>
                <View  style={{width:'40%'}}><Paragraph
                    style={[styles.paragraph, styles.bold, styles.text_lg, styles.green,{textAlign:'right'}]}>{toCurrency(vouchertotaldisplay || '0')} </Paragraph></View>
            </View>
        </Card.Content>
    </Card>)
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData,
    localSettings:state.localSettings
})

export default connect(mapStateToProps)(withTheme(Index));
