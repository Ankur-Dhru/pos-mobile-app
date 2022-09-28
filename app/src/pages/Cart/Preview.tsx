import apiService from "../../libs/api-service";
import {ACTIONS, METHOD, STATUS} from "../../libs/static";
import React, {useState} from "react";
import {isDebug, toCurrency} from "../../libs/function";
import {View} from "react-native";
import {Button, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";


const Index = ({cartData}:any) => {

    const {vouchersubtotaldisplay,vouchertotaldisplay,globaltax,voucherroundoffdisplay}:any = cartData


    return <View style={[styles.px_6,styles.mt_5]}>
        <View style={[styles.grid,styles.justifyContent]}>
            <View><Paragraph style={[styles.paragraph]}>Subtotal</Paragraph></View>
            <View><Paragraph style={[styles.paragraph,styles.bold]}>{toCurrency(vouchersubtotaldisplay)}</Paragraph></View>
        </View>

        {
            globaltax.map((tax:any)=>{
                return (
                    <View style={[styles.grid,styles.justifyContent]}>
                        <View><Paragraph style={[styles.paragraph]}>{tax.taxname}</Paragraph></View>
                        <View><Paragraph style={[styles.paragraph]}>{toCurrency(tax.taxpricedisplay)}</Paragraph></View>
                    </View>
                )
            })
        }

        {Boolean(voucherroundoffdisplay) && <View style={[styles.grid,styles.justifyContent]}>
            <View><Paragraph style={[styles.paragraph]}>Roundoff</Paragraph></View>
            <View><Paragraph style={[styles.paragraph,styles.bold]}>{toCurrency(voucherroundoffdisplay)}</Paragraph></View>
        </View>}


        <View style={[styles.grid,styles.justifyContent]}>
            <View><Paragraph style={[styles.paragraph]}>Total</Paragraph></View>
            <View><Paragraph style={[styles.paragraph,styles.bold,styles.text_lg,styles.green]}>{toCurrency(vouchertotaldisplay)}</Paragraph></View>
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData || {}
})

export default connect(mapStateToProps)(withTheme(Index));
