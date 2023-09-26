import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import {Alert, FlatList, View} from "react-native";

import {connect} from "react-redux";

import Item from "../Cart/Item";
import Kot from "../Cart/Kot";
import {styles} from "../../theme";
import {Card, Paragraph, Text} from "react-native-paper";
import {appLog, findObject, isRestaurant, prelog, resetDiscount, updateComponent} from "../../libs/function";
import {ItemDivider} from "../../libs/static";
import ToggleButtons from "../../components/ToggleButton";
import store from "../../redux-store/store";

const Index = (props: any) => {


    let {invoiceitems,totalqnt,kots,currentpax,orderbypax,discountdetail,vouchertotaldiscountamountdisplay} = props;


    const hasrestaurant = isRestaurant();

    const cartListRef = React.useRef<FlatList>(null);
    const kotListRef = React.useRef<View>(null);

    const firstRenderRef = useRef(false);

    useEffect(()=>{
        updateComponent(cartListRef,'display','flex')
        updateComponent(kotListRef,'display','none')
    },[])

    useEffect(()=>{
        if(Boolean(vouchertotaldiscountamountdisplay)){
            Alert.alert(
                "Alert",
                'Discount coupons will be reset',
                [
                    {text: "OK", onPress: () => resetDiscount().then()}
                ]
            );
        }
    },[totalqnt])

    useLayoutEffect(() => {
        if(firstRenderRef?.current) {
            const timeout = setTimeout(() => {
                if (cartListRef.current && invoiceitems && invoiceitems.length > 0) {
                    cartListRef.current.scrollToEnd({animated: false});
                }
            });
            return () => {
                clearTimeout(timeout);
            };
        }
        firstRenderRef.current=true
    }, [invoiceitems?.length]);



    const renderItem = useCallback(({item, index}: any) => <Item item={item}   orderbypax={orderbypax} hasdiscount={discountdetail}  key={item.key} hasLast={invoiceitems.length === index+1} isRestaurant={hasrestaurant}   index={index}/>, [currentpax]);
    const renderKot = useCallback(({item, index}: any) => <Kot kot={item} orderbypax={orderbypax} hasLast={kots.length === index+1} key={item.key} />, []);

    const onButtonToggle = (value:any) => {
        if(value === 'items'){
            updateComponent(cartListRef,'display','flex')
            updateComponent(kotListRef,'display','none')
        }
        else{
            updateComponent(cartListRef,'display','none')
            updateComponent(kotListRef,'display','flex')
        }
    };


    return (
        <>
            {Boolean(kots?.length > 0) &&  <View style={[styles.mb_3]}>
                <ToggleButtons
                    width={'50%'}
                    default={'items'}
                    btns={[{label:'Items',value:'items'},{label:'KOTs',value:'kots'}]}
                    onValueChange={onButtonToggle}
                />
            </View>}


            <>
                <FlatList
                    data={kots}
                    ref={kotListRef}
                    getItemLayout={(data, index) => {
                        return { length: 200, offset: 200 * index, index };
                    }}
                    ItemSeparatorComponent={ItemDivider}
                    ListFooterComponent={() => {
                        return  <View style={{height:80}}></View>
                    }}
                    renderItem={renderKot}
                />
            </>

            <>
                <FlatList
                    data={invoiceitems?.filter((item:any)=>{

                        return (+item.pax === +currentpax) || !Boolean(item.pax) || currentpax === 'all'
                    }).filter((item:any)=>{
                        return item?.treatitem !== 'charges'
                    })}
                    ref={cartListRef}
                    getItemLayout={(data, index) => {
                        return { length: 80, offset: 80 * index, index };
                    }}
                    ListFooterComponent={() => {
                        return  <View style={{height:80}}></View>
                    }}
                    ItemSeparatorComponent={ItemDivider}
                    renderItem={renderItem}
                    ListEmptyComponent={()=>{
                        return (
                            <View>
                                <View>
                                    <View style={{marginTop:50}}><Paragraph style={[styles.paragraph,{textAlign:'center'}]}>No any item(s) added</Paragraph></View>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(item)=>item.key}

                />
            </>

        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    kots: state.cartData.kots,
    currentpax:state.cartData.currentpax,
    orderbypax:state.cartData.orderbypax,
    totalqnt: state.cartData.totalqnt,
    vouchertotaldiscountamountdisplay:state.cartData.vouchertotaldiscountamountdisplay,
    discountdetail: Boolean(state.cartData.discountdetail)
})

export default connect(mapStateToProps)(Index);

