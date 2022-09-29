import React, {useEffect, useRef, useState} from "react";
import {clone, toCurrency, updateComponent} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {device} from "../../libs/static";
import {ProIcon} from "../../components";
import Discount from "./Discount";


const Index = ({cartData}: any) => {

    const dispatch = useDispatch()

    const {vouchersubtotaldisplay, vouchertotaldisplay, globaltax, voucherroundoffdisplay}: any = cartData;
    const [summary,setSummary]:any = useState(false);

    const [globaldiscount, setGlobalDiscount] = useState(cartData?.globaldiscountvalue);
    const [adjustment, setAdjustment] = useState(cartData?.adjustmentamount);
    const [discountType, setDiscountType] = useState(cartData?.discounttype);

    useEffect(() => {
        if (!Boolean(cartData?.globaldiscountvalue)) {
            setGlobalDiscount("")
        }
    }, [cartData?.globaldiscountvalue])

    useEffect(() => {
        if (!Boolean(adjustment) && Boolean(cartData?.adjustmentamount)) {
            setAdjustment(cartData?.adjustmentamount)
        }
        if (!Boolean(cartData?.adjustmentamount)) {
            setAdjustment("")
        }
    }, [cartData?.adjustmentamount])


    useEffect(() => onBlurHandler(), [discountType])

    const onBlurHandler = () => {
        dispatch(setCartData({
            adjustmentamount: adjustment,
            updatecart: true
        }));
    }

    const onBlurDiscount = () => {

        dispatch(setCartData({
            globaldiscountvalue: cartData?.vouchertaxtype === "inclusive" ? 0 : globaldiscount,
            adjustmentamount: adjustment,
            discounttype: discountType,
            updatecart: true,
            invoiceitems: cartData.invoiceitems.map((item: any) => {
                if (cartData?.vouchertaxtype === "inclusive") {
                    item = {...item, productdiscountvalue: globaldiscount, productdiscounttype: discountType}
                }
                return {...item, change: true}
            })
        }));
    }



    return (<Card   onPress={()=>{setSummary(!summary)}} style={[styles.mt_3]}>
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
                    globaltax.map((tax: any, key: any) => {
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
    cartData: state.cartData || {}
})

export default connect(mapStateToProps)(withTheme(Index));
