import React, {memo} from "react";
import {toCurrency} from "../../libs/function";
import {ActivityIndicator, View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";


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
                   loading
               }: any) => {

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


            {Boolean(extrachargeboforetaxDisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Extra Charges On
                    ({toCurrency(!loading ? vouchersubtotaldisplay - (voucherinlinediscountdisplay + extrachargeboforetaxDisplay) : '0')})</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}>{toCurrency(extrachargeboforetaxDisplay)}</Paragraph>
                </View>
            </View>}

            <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Subtotal</Paragraph></View>
                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold]}> {toCurrency(!loading ? vouchersubtotaldisplay - voucherinlinediscountdisplay : '0')}</Paragraph>
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
                                style={[styles.paragraph]}>{toCurrency(!loading ? tax.taxpricedisplay : '0')}</Paragraph></View>
                        </View>
                    )
                })
            }


            {Boolean(extrachargeafterdisplay) && <View style={[styles.grid, styles.justifyContent]}>
                <View><Paragraph style={[styles.paragraph]}>Extra Charges On
                    ({toCurrency(!loading ? totalwithoutroundoffdisplay - extrachargeafterdisplay : '0')})</Paragraph></View>
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
                    style={[styles.paragraph, styles.bold]}>{toCurrency(!loading ? voucherroundoffdisplay : '0')}</Paragraph></View>
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
    loading: state.component.loading
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
