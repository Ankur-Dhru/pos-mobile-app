import React, {memo, useEffect, useRef, useState} from "react";
import {appLog, clone, saveLocalSettings, toCurrency, updateComponent, voucherData} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart} from "../../redux-store/reducer/cart-data";
import {current, device, VOUCHER} from "../../libs/static";
import {ProIcon} from "../../components";
import Discount from "./Discount";
import SwitchC from "../../components/Switch";
import CartSummaryMore from "./CartSummaryMore";
import {contentLoader, hideLoader, setModal, showLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import moment from "moment";
import ClientAndSource from "./ClientAndSource";


const Index = ({vouchertotaldisplay,advanceorder}: any) => {

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


    return (<>
        {Boolean(advanceorder?.date) &&  <Card style={[styles.dottedBorder,styles.noshadow,styles.p_5,styles.m_3,{borderRadius:5}]} onPress={()=>{
            dispatch(setModal({
                visible: true,
                hidecancel: true,
                width: '98%',
                component: () => <ClientAndSource title={'Advance Order'} edit={true} />
            }))
        }}>
            <Paragraph>Delivery on :  {moment(advanceorder.date).format('DD/MM/YYYY')} {moment(advanceorder.time).format('HH:mm A')}</Paragraph>
            {Boolean(advanceorder.notes) &&  <Paragraph>{advanceorder.notes}</Paragraph>}
        </Card>}
        <Card   onPress={()=>{ viewSummary() }} style={[styles.mt_3,styles.m_2,styles.noshadow,styles.bg_light]}>
        <Card.Content >

            <View><Paragraph style={[styles.absolute,{top:0,left:'50%',marginLeft:-10}]}><ProIcon name={'chevron-up'} action_type={'text'} size={15}/></Paragraph></View>

            <View ref={moreSummaryRef}><CartSummaryMore  /></View>

            <View style={[styles.grid, styles.justifyContent]}>
                <View style={{width:'40%'}}><Paragraph style={[styles.paragraph,styles.bold]}>Total </Paragraph></View>
                <View  style={{width:'40%'}}><Paragraph
                    style={[styles.paragraph, styles.bold, styles.text_lg, styles.green,{textAlign:'right'}]}>{toCurrency(vouchertotaldisplay || '0')} </Paragraph></View>
            </View>
        </Card.Content>
    </Card></>)
}

const mapStateToProps = (state: any) => ({
    advanceorder:state.cartData?.advanceorder,
    vouchertotaldisplay: parseInt(state.cartData.vouchertotaldisplay),
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
