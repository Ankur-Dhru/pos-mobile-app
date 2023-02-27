import React, {memo} from "react";
import {toCurrency} from "../../libs/function";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {setBottomSheet} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import Discount from "./Discount";


const Index = ({vouchersubtotaldisplay, globaltax, voucherroundoffdisplay,voucherglobaldiscountdisplay, loading}: any) => {





    const dispatch = useDispatch()

    /*const setDiscount = () => {
        dispatch(setBottomSheet({
            visible: true,
            height: '50%',
            component: () => <Discount/>
        }))
    }*/

    /*
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


        useEffect(() => onBlurHandler(), [discountType])*/


    /*    const onBlurHandler = () => {
            dispatch(setCartData({
                adjustmentamount: adjustment,
                updatecart: true
            }));
        }*/


    /*    const onBlurDiscount = () => {

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
        }*/

    /*const toggleSwitch = (value:any) => {
        saveLocalSettings('realtimetotalcalculation',value).then()
    }*/

    /*  if(loader){
          return <View style={{height:200}}><ActivityIndicator  color={'#016EFE'} size='large' animating={true}   /></View>
      }*/


    if (loading) {
        return <View style={{marginTop: 20}}>
            <View style={[styles.grid, styles.justifyContent, styles.mb_2]}>
                <View style={[styles.bg_white, styles.flexGrow, styles.w_auto, {height: 20, borderRadius: 5}]}></View>
                <View style={[styles.bg_white, styles.flexGrow, styles.w_auto, {
                    height: 20,
                    marginLeft: 10,
                    borderRadius: 5
                }]}></View>
            </View>
            <View style={[styles.grid, styles.justifyContent, styles.mb_2]}>
                <View style={[styles.bg_white, styles.flexGrow, styles.w_auto, {height: 20, borderRadius: 5}]}></View>
                <View style={[styles.bg_white, styles.flexGrow, styles.w_auto, {
                    height: 20,
                    marginLeft: 10,
                    borderRadius: 5
                }]}></View>
            </View>
            <View style={[styles.grid, styles.justifyContent, styles.mb_2]}>
                <View style={[styles.bg_white, styles.flexGrow, styles.w_auto, {height: 20, borderRadius: 5}]}></View>
                <View style={[styles.bg_white, styles.flexGrow, styles.w_auto, {
                    height: 20,
                    marginLeft: 10,
                    borderRadius: 5
                }]}></View>
            </View>
        </View>
    }


    return (<View>


        {loading && <View style={[styles.absolute, {left: '50%', marginLeft: -22, top: -7}]}><ActivityIndicator
            style={styles.m_1} color={'#016EFE'} size='large' animating={true}/></View>}

        <View style={{opacity: loading ? 0.3 : 1}}>

            <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Subtotal</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(!loading ? vouchersubtotaldisplay : '0')}</Paragraph>
                </View>
            </View>

            {/*<View>*/}
            {/*    <Discount/>*/}
            {/*</View>*/}


            <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Discount</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(voucherglobaldiscountdisplay || '0')}</Paragraph>
                </View>
            </View>


            {
                globaltax?.map((tax: any, key: any) => {
                    if (!Boolean(tax.taxpercentage)) {
                        return <></>
                    }
                    return (
                        <View style={[styles.grid, styles.justifyContent]} key={key}>
                            <View><Paragraph style={[styles.paragraph]}>{tax.taxname} ({tax.taxpercentage}%)</Paragraph></View>
                            <View><Paragraph
                                style={[styles.paragraph]}>{toCurrency(!loading ? tax.taxpricedisplay : '0')}</Paragraph></View>
                        </View>
                    )
                })
            }

            {Boolean(voucherroundoffdisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Roundoff</Paragraph></View>
                <View><Paragraph
                    style={[styles.paragraph, styles.bold]}>{toCurrency(!loading ? voucherroundoffdisplay : '0')}</Paragraph></View>
            </View>}

        </View>

    </View>)
}

const mapStateToProps = (state: any) => ({
    vouchersubtotaldisplay: state.cartData.vouchersubtotaldisplay,
    globaltax: state.cartData.globaltax,
    voucherroundoffdisplay: state.cartData.voucherroundoffdisplay,
    voucherglobaldiscountdisplay:state.cartData.voucherglobaldiscountdisplay,
    loading: state.component.loading
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
