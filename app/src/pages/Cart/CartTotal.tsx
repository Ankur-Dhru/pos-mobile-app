import React, {memo} from "react";
import {appLog, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {ProIcon} from "../../components";

const Index = ({vouchertotaldisplay, invoiceitems, theme: {colors}}: any) => {

    const navigation = useNavigation();

    let totalqnt = 0

    invoiceitems.map((item: any) => {
        totalqnt += item.productqnt
    })



    if (!Boolean(vouchertotaldisplay)) {
        return <></>
    }



    return (
        <View style={[styles.p_4, styles.bg_white, styles.shadow]}>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('DetailView')}>
                    <View style={[styles.grid, styles.justifyContent, styles.p_5, {
                        backgroundColor: colors.primary,
                        borderRadius: 7
                    }]}>
                        <View>
                            <Text style={[styles.mb_2, styles.text_xs, {color: colors.surface}]}>{totalqnt} ITEMS</Text>
                            <Text
                                style={[{color: colors.surface}, styles.text_md]}>{toCurrency(vouchertotaldisplay)} </Text>
                        </View>
                        <View style={[styles.grid, styles.middle, styles.center]}>
                            <Paragraph style={[{color: colors.surface}, styles.text_lg]}>Next </Paragraph><Paragraph
                            style={[]}> <ProIcon color={'white'} type={'solid'} size={15} action_type={'text'}
                                                 name={'play'}/> </Paragraph>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const mapStateToProps = (state: any) => ({
    vouchertotaldisplay: state.cartData.vouchertotaldisplay,
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
