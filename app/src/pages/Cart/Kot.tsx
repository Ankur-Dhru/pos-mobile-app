import React, {memo, useState} from "react";
import {Alert, View} from "react-native";
import {Divider, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {Button} from "../../components";
import {connect, useDispatch} from "react-redux";
import CancelReason from "./CancelReason";
import {appLog, clone, printKOT} from "../../libs/function";
import store from "../../redux-store/store";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import {ItemDivider, localredux} from "../../libs/static";
import {setBottomSheet} from "../../redux-store/reducer/component";
import KOTItemListforCancel from "./KOTItemListforCancel";


const Index = (props: any) => {

    let {kot: kt, tablename, theme: {colors}, hasLast}: any = props;

    const {departmentname, commonkotnote, staffname, kotid, tickettime, ticketitems,ticketnumberprefix}: any = kt;

    const dispatch = useDispatch();
    const navigation = useNavigation()
    const {cancelkot}:any = localredux?.authData?.settings;

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


    const askPemission = () => {
        navigation.navigate('AskPermission',{kot:kot,cancelKOTDialog:cancelKOTDialog})
    }



    const cancelKOTDialog = async (kot: any,force?:any) => {
        if(cancelkot || force) {
            navigation.navigate('CancelReason', {type: 'ticketcancelreason', kot: kot, setKot: setKot})
        }
        else{
            Alert.alert(
                "Alert",
                'You do not have cancel KOT permission',
                [
                    {text: "Cancel",onPress: () => {},style:'cancel'},
                    {text: "Ask Permission", onPress: () => askPemission()}
                ]
            );
        }
    }



    return (
        <View style={[{minWidth: '100%', marginBottom: 4}]}>
            <View>
                <View style={[styles.px_5, styles.py_4]}>

                    <View>
                        {Boolean(kot.cancelreason) &&
                            <View style={[styles.mb_2]}><Paragraph style={[styles.paragraph, {color: styles.red.color}]}>Cancel
                                : {kot.cancelreason}</Paragraph></View>}
                        <View style={[styles.grid,styles.mb_2,styles.justifyContent]}>
                            <Paragraph style={[styles.bold]}>{ticketnumberprefix}-{kotid} ({tickettime})</Paragraph>
                            <Paragraph style={[styles.ml_1]}> {tablename}</Paragraph>
                        </View>
                    </View>

                    <View style={[styles.mt_2]}>
                        {
                           Boolean(ticketitems.length) && ticketitems?.map((item: any, index: any) => {
                                return <View key={index}>
                                    <Paragraph style={[{textTransform:'capitalize'},Boolean(item.cancelled) && {color:styles.red.color}]}>{item.productqnt} x {item.productdisplayname} {Boolean(item.cancelled) && `(Cancelled - ${item.reasonname})`}</Paragraph>
                                </View>
                            })
                        }
                        {Boolean(commonkotnote) && <View><Text>{commonkotnote}</Text></View>}

                        <View style={[styles.mt_2,styles.grid]}><Paragraph style={[styles.paragraph,styles.text_xs,styles.muted]}>Kitchen : {departmentname}</Paragraph>
                        {Boolean(staffname) && <Paragraph  style={[styles.paragraph,styles.text_xs,styles.ml_1,styles.muted]}>({staffname})</Paragraph>}
                        </View>
                    </View>

                    <View style={[styles.grid, styles.justifyContentSpaceBetween, styles.mt_4]}>
                        <View>
                            <Button more={{color:'white',height:40}}  onPress={() => {
                                reprint(kot)
                            }}> Reprint {kot.print ? '(' + (kot.print) + ')' : ''}</Button>
                        </View>
                        <View>
                            {!Boolean(kot.cancelreason) && <Button onPress={() => {
                               if(kot?.ticketitems?.length === 1) {
                                   cancelKOTDialog(kot).then()
                               }
                               else {
                                   dispatch(setBottomSheet({
                                       visible: true,
                                       height: '70%',
                                       component: () => <KOTItemListforCancel kot={kot} cancelKOTDialog={cancelKOTDialog}/>
                                   }))
                               }
                            }} more={{backgroundColor: styles.bg_red.backgroundColor,color:'white',height:40}}>Cancel KOT</Button>}
                        </View>
                    </View>

                </View>

            </View>
        </View>
    );
}

const mapStateToProps = (state: any) => ({
    kots: state.cartData.kots,
    tablename: state.cartData.tablename,
})
export default connect(mapStateToProps)(withTheme(Index));
