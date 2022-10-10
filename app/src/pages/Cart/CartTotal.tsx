import React, {memo, useEffect} from "react";
import {appLog, clone, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {ProIcon} from "../../components";

const Index = ({cartData,localSettings,  theme: {colors}}: any) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (cartData?.updatecart) {
            let data = itemTotalCalculation(cartData, undefined, undefined, undefined, undefined, 2, 2, false, false);
            dispatch(setCartData(clone(data)));
            dispatch(setUpdateCart());
        }
    }, [cartData?.updatecart]);



    let totalqnt = 0
    const {invoiceitems, vouchertotaldisplay} = cartData;

    invoiceitems.map((item: any) => {
        totalqnt += item.productqnt
    })

    if (!Boolean(vouchertotaldisplay)) {
        return <></>
    }


    return(
        <View style={[styles.p_4, styles.bg_white,styles.shadow]}>
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('DetailView')}>
                <View style={[styles.grid, styles.justifyContent, styles.p_5, {
                    backgroundColor: colors.primary,
                    borderRadius:7
                }]}>
                    <View>
                        <Text style={[styles.mb_2,styles.text_xs,{color: colors.surface}]}>{totalqnt} ITEMS</Text>
                        <Text style={[{color: colors.surface},styles.text_md]}>{toCurrency(vouchertotaldisplay)} </Text>
                    </View>
                    <View style={[styles.grid,styles.middle,styles.center]}>
                        <Paragraph style={[{color: colors.surface},styles.text_lg]}>Next </Paragraph><Paragraph style={[]}> <ProIcon color={'white'} type={'solid'} size={15} action_type={'text'} name={'play'}/> </Paragraph>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    </View>
    )
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData,
    localSettings:state.localSettings
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
