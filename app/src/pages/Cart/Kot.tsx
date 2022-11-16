import React, {memo, useState} from "react";
import {View} from "react-native";
import {Divider, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {Button} from "../../components";
import {connect, useDispatch} from "react-redux";
import CancelReason from "./CancelReason";
import {clone, printKOT} from "../../libs/function";
import store from "../../redux-store/store";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";


const Index = memo((props: any) => {

    let {kot: kt, tablename, theme: {colors}, hasLast}: any = props;

    const {departmentname, commonkotnote, staffname, kotid, tickettime, ticketitems}: any = kt;
    const dispatch = useDispatch();
    const navigation = useNavigation()

    let [kot, setKot]: any = useState(kt);
    const reprint = async (kot: any) => {
        kot.print = kot.print + 1;


        let {kots}: any = store.getState().cartData;
        const index = kots.findIndex(function (item: any) {
            return item.kotid === kot.kotid
        });
        kots = {
            ...kots,
            [index]: kot
        }

        await printKOT(kot).then();
        await dispatch(updateCartField({kots: Object.values(kots)}))

        await setKot(clone(kot))

    }


    const cancelKOTDialog = async (kot: any) => {
        navigation.navigate('CancelReason', {type: 'ticketcancelreason', kot: kot, setKot: setKot})
    }

    return (
        <View style={[{minWidth: '100%', marginBottom: 4}]}>
            <View>
                <View style={[styles.px_5, styles.py_4]}>
                    <View style={[styles.grid, styles.justifyContentSpaceBetween, styles.noWrap]}>
                        <View>
                            {Boolean(kot.cancelreason) &&
                                <View style={[styles.mb_2]}><Text style={[styles.paragraph, {color: styles.red.color}]}>Cancel
                                    : {kot.cancelreason}</Text></View>}
                            <View style={[styles.mb_2]}><Text
                                style={[styles.bold]}>#{tablename}-{kotid}</Text><Text>{tickettime}</Text></View>
                        </View>
                    </View>

                    <View style={[styles.mt_2]}>
                        {
                            ticketitems.map((item: any, index: any) => {
                                return <View key={index}>
                                    <Text>{item.productqnt} x {item.productdisplayname} {Boolean(item.cancelled) && `(Cancelled - ${item.reasonname})`}</Text>
                                </View>
                            })
                        }
                        {Boolean(commonkotnote) && <View><Text>{commonkotnote}</Text></View>}
                        <View style={[styles.mt_2]}><Text>Kitchen : {departmentname}</Text></View>
                        {Boolean(staffname) && <View><Text>Staff : {staffname}</Text></View>}
                    </View>

                    <View style={[styles.grid, styles.justifyContentSpaceBetween, styles.mt_4]}>
                        <View>
                            <Button onPress={() => {
                                reprint(kot)
                            }}> Reprint {kot.print ? '(' + (kot.print) + ')' : ''}</Button>
                        </View>
                        <View>
                            {!Boolean(kot.cancelreason) && <Button onPress={() => {
                                cancelKOTDialog(kot).then()
                            }} more={{backgroundColor: styles.bg_red.backgroundColor}}>Cancel KOT</Button>}
                        </View>
                    </View>

                </View>
                {!hasLast && <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>}
            </View>
        </View>
    );
}, (r1, r2) => {
    return r1.item === r2.item;
})

const mapStateToProps = (state: any) => ({
    kots: state.cartData.kots,
    tablename: state.cartData.tablename,
})
export default connect(mapStateToProps)(withTheme(Index));
