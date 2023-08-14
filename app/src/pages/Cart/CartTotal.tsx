import React, {memo} from "react";
import {appLog, prelog, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {ProIcon} from "../../components";

const Index = ({vouchertotaldisplay, invoiceitems, theme: {colors}}: any) => {

    const navigation = useNavigation();

    let totalqnt = 0

    invoiceitems.filter((item:any)=>{
        return item?.treatitem !== 'charges'
    }).map((item: any) => {
        totalqnt += +item.productqnt
    })

    if (!Boolean(totalqnt)) {
        return <></>
    }

    return (
        <View style={[styles.p_3]}>
            <TouchableOpacity onPress={() => navigation.navigate('DetailViewNavigator')}>
                <View style={[styles.grid, styles.justifyContent, styles.p_5,styles.mt_4, {
                    backgroundColor: colors.primary,
                    borderRadius: 7
                }]}>
                    <View>
                        <Text style={[styles.mb_2, styles.text_xs, {color: colors.surface}]}>{parseFloat(totalqnt?.toFixed(3))} ITEMS</Text>
                        <Text style={[{color: colors.surface}, styles.text_md]}>{toCurrency(vouchertotaldisplay)} </Text>
                    </View>
                    <View style={[styles.grid, styles.middle, styles.center]}>
                        <Paragraph style={[{color: colors.surface}, styles.text_lg]}>Next </Paragraph>
                        <Paragraph style={[]}> <ProIcon color={'white'} type={'solid'} size={15} action_type={'text'}  name={'play'}/> </Paragraph>
                    </View>
                </View>
            </TouchableOpacity>



        </View>
    )
}

const mapStateToProps = (state: any) => ({
    vouchertotaldisplay: state.cartData.vouchertotaldisplay,
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
