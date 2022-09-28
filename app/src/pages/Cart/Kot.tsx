import React, {useState} from "react";
import {View} from "react-native";
import {Divider, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {Button} from "../../components";
import {setDialog} from "../../redux-store/reducer/component";
import {connect, useDispatch} from "react-redux";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import CancelReason from "./CancelReason";


const Index = (props: any) => {

    let {kot: kt, kots, invoiceitems, invoiceitemsdeleted, theme: {colors},hasLast}: any = props;
    const {departmentname, table, commonkotnote, staffname, kotid, tickettime, ticketitems}: any = kt;
    const dispatch = useDispatch();

    let [kot, setKot]: any = useState(kt);
    const reprint = (kot: any) => {

    }

    const cancelKOT = ({cancelreason, cancelreasonid}: any) => {
        kot = {
            ...kot,
            cancelreason: cancelreason,
            cancelreasonid: cancelreasonid,
        }
        const index = kots.findIndex(function (item: any) {
            return item.kotid === kot.kotid
        });
        kots = {
            ...kots,
            [index]: kot
        }
        setKot(kot);

        const remaininginvoiceitems = invoiceitems.filter(function (item: any) {
            return item.kotid !== kot.kotid
        });

        const addtoinvoiceitemsdeleted = invoiceitems.filter(function (item: any) {
            return item.kotid === kot.kotid
        });
        const newdeletedinvoiceitems = invoiceitemsdeleted.concat(addtoinvoiceitemsdeleted);
        dispatch(updateCartField({
            kots: Object.values(kots),
            invoiceitems: remaininginvoiceitems,
            invoiceitemsdeleted: newdeletedinvoiceitems
        }))
    }

    const cancelKOTDialog = async (kot: any) => {
        dispatch(setDialog({
            visible: true,
            hidecancel: true,
            component: () => <CancelReason type={'ticketcancelreason'} cancelKOT={cancelKOT}/>
        }))
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
}

const mapStateToProps = (state: any) => ({
    kots: state.cartData.kots,
    invoiceitems: state.cartData.invoiceitems || [],
    invoiceitemsdeleted: state.cartData.invoiceitemsdeleted || [],
})
export default connect(mapStateToProps)(withTheme(Index));
