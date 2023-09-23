import React, {memo, useEffect, useState} from "react";
import {clone, toCurrency} from "../../libs/function";
import {ActivityIndicator, View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {contentLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";


const Index = ({
                   vouchersubtotaldisplay,
                   globaltax,
                   adjustmentamount,
                   voucherroundoffdisplay,
                   vouchertotaldiscountamountdisplay,
                   voucherinlinediscountdisplay,
                   extrachargeboforetaxDisplay,
                   totalwithoutroundoffdisplay,
                   extrachargeafterdisplay,
                   //loading
               }: any) => {

    const [loading,setLoading] = useState(true)

    const dispatch = useDispatch()

    useEffect(()=>{
        setTimeout(async () => {

            const cartdata:any = clone(store.getState().cartData);
            const vouchertotaldisplay:any = clone(store.getState().cartData.vouchertotaldisplay);

            if(Boolean(vouchertotaldisplay)) {

                let data = await itemTotalCalculation(cartdata, undefined, undefined, undefined, undefined, 2, 2, false, false);
                await dispatch(setCartData(clone(data)));
                await dispatch(setUpdateCart());

            }
            setLoading(false)

        })
    },[])

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




        <View>


            {Boolean(extrachargeboforetaxDisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Extra Charges On
                    ({toCurrency(vouchersubtotaldisplay - (voucherinlinediscountdisplay + extrachargeboforetaxDisplay))})</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(extrachargeboforetaxDisplay)}</Paragraph>
                </View>
            </View>}

            <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Subtotal</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}> {toCurrency(vouchersubtotaldisplay - voucherinlinediscountdisplay)}</Paragraph>
                </View>
            </View>

            {/*<View>*/}
            {/*    <Discount/>*/}
            {/*</View>*/}


            {Boolean(vouchertotaldiscountamountdisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Discount</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(vouchertotaldiscountamountdisplay || '0')}</Paragraph>
                </View>
            </View>}


            {
                globaltax?.map((tax: any, key: any) => {
                    if (!Boolean(tax.taxpercentage)) {
                        return <></>
                    }
                    return (
                        <View style={[styles.grid, styles.justifyContent]} key={key}>
                            <View><Paragraph style={[styles.paragraph]}>{tax.taxname} ({tax.taxpercentage}%)</Paragraph></View>
                            <View><Paragraph
                                style={[styles.paragraph]}>{toCurrency(tax.taxpricedisplay)}</Paragraph></View>
                        </View>
                    )
                })
            }


            {Boolean(extrachargeafterdisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Extra Charges On
                    ({toCurrency(totalwithoutroundoffdisplay - extrachargeafterdisplay)})</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(extrachargeafterdisplay)}</Paragraph>
                </View>
            </View>}


            {Boolean(adjustmentamount) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Adjustment</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(adjustmentamount || '0')}</Paragraph>
                </View>
            </View>}

            {Boolean(voucherroundoffdisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Roundoff</Paragraph></View>
                <View><Paragraph
                    style={[styles.paragraph, styles.bold]}>{toCurrency(voucherroundoffdisplay)}</Paragraph></View>
            </View>}

        </View>

    </View>)
}

const mapStateToProps = (state: any) => ({
    vouchersubtotaldisplay: state.cartData.vouchersubtotaldisplay,
    extrachargeboforetaxDisplay: state.cartData.extrachargeboforetaxDisplay,
    totalwithoutroundoffdisplay: state.cartData.totalwithoutroundoffdisplay,
    extrachargeafterdisplay: state.cartData.extrachargeafterdisplay,
    globaltax: state.cartData.globaltax,
    adjustmentamount: state.cartData.adjustmentamount,
    voucherroundoffdisplay: state.cartData.voucherroundoffdisplay,
    voucherglobaldiscountdisplay: state.cartData.voucherglobaldiscountdisplay,
    voucherinlinediscountdisplay: state.cartData.voucherinlinediscountdisplay,
    vouchertotaldiscountamountdisplay: state.cartData.vouchertotaldiscountamountdisplay,
    //loading: state.component.loading
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
