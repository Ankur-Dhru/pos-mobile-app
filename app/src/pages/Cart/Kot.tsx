import React, {memo, useState} from "react";
import {View} from "react-native";
import {Divider, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {Button} from "../../components";
import {setDialog} from "../../redux-store/reducer/component";
import {connect, useDispatch} from "react-redux";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import CancelReason from "./CancelReason";
import { appLog } from "../../libs/function";


const Index = memo((props: any) => {

    let {kot: kt, kots,   theme: {colors},hasLast}: any = props;
    const {departmentname, table, commonkotnote, staffname, kotid, tickettime, ticketitems}: any = kt;
    const dispatch = useDispatch();

    let [kot, setKot]: any = useState(kt);
    const reprint = (kot: any) => {

    }


    const cancelKOTDialog = async (kot: any) => {
        dispatch(setDialog({
            visible: true,
            hidecancel: true,
            width:360,
            component: () => <CancelReason type={'ticketcancelreason'} kot={kot} setKot={setKot} />
        }))
    }

    appLog('kot item')

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
                                style={[styles.bold]}>#{table}-{kotid}</Text><Text>{tickettime}</Text></View>
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
                            }}>Reprint</Button>
                        </View>
                        <View>
                            {!Boolean(kot.cancelreason) && <Button onPress={() => {
                                cancelKOTDialog(kot).then()
                            }} more={{backgroundColor: styles.bg_red.backgroundColor}}>Cancel KOT</Button>}
                        </View>
                    </View>

                </View>
                {!hasLast &&  <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>}
            </View>
        </View>
    );
},(r1, r2) => {
    return r1.item === r2.item;
})

const mapStateToProps = (state: any) => ({
    kots: state.cartData.kots,
})
export default connect(mapStateToProps)(withTheme(Index));
