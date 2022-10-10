import React, {memo, useEffect, useRef, useState} from "react";
import {appLog, clone, saveLocalSettings, toCurrency, updateComponent, voucherData} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {device, VOUCHER} from "../../libs/static";
import {ProIcon} from "../../components";
import Discount from "./Discount";
import SwitchC from "../../components/Switch";
import CartSummaryMore from "./CartSummaryMore";
import {contentLoader, hideLoader, showLoader } from "../../redux-store/reducer/component";
import store from "../../redux-store/store";


const Index = ({vouchertotaldisplay}: any) => {


    const dispatch = useDispatch()
    const moreSummaryRef:any = React.useRef();
    let summary:any = false


    useEffect(()=>{
        updateComponent(moreSummaryRef,'display','none');
    },[vouchertotaldisplay])


    const viewSummary = async () => {

        summary = !summary;
        updateComponent(moreSummaryRef,'display',summary?'flex':'none');

        if(summary) {
            dispatch(contentLoader(true))
            setTimeout( async ()=>{
                let data = await itemTotalCalculation(clone(store.getState().cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
                await dispatch(setCartData(clone(data)));
                await dispatch(setUpdateCart());
                dispatch(contentLoader(false))
            })
        }
    }


    return (<Card   onPress={()=>{ viewSummary() }} style={[styles.mt_3]}>
        <Card.Content >

            <View><Paragraph style={[styles.absolute,{top:0,left:'50%',marginLeft:-10}]}><ProIcon name={summary?'chevron-down':'chevron-up'} action_type={'text'} size={15}/></Paragraph></View>

            <View ref={moreSummaryRef}><CartSummaryMore  /></View>

            <View style={[styles.grid, styles.justifyContent]}>
                <View style={{width:'40%'}}><Paragraph style={[styles.paragraph,styles.bold]}>Total </Paragraph></View>
                <View  style={{width:'40%'}}><Paragraph
                    style={[styles.paragraph, styles.bold, styles.text_lg, styles.green,{textAlign:'right'}]}>{toCurrency(vouchertotaldisplay || '0')} </Paragraph></View>
            </View>
        </Card.Content>
    </Card>)
}

const mapStateToProps = (state: any) => ({
    vouchertotaldisplay: state.cartData.vouchertotaldisplay,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
