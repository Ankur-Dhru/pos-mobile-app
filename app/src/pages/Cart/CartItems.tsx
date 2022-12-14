import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import {FlatList, View} from "react-native";

import {connect} from "react-redux";

import Item from "../Cart/Item";
import Kot from "../Cart/Kot";
import {styles} from "../../theme";
import {Card, Paragraph, Text} from "react-native-paper";
import Button from "../../components/Button";
import {appLog, isRestaurant, updateComponent} from "../../libs/function";
import ProIcon from "../../components/ProIcon";
import {ItemDivider} from "../../libs/static";
import ToggleButtons from "../../components/ToggleButton";

const Index = (props: any) => {


    let {invoiceitems,kots} = props;

    const hasrestaurant = isRestaurant();

    const cartListRef = React.useRef<FlatList>(null);
    const kotListRef = React.useRef<View>(null);

    const firstRenderRef = useRef(false);


    useEffect(()=>{
        updateComponent(cartListRef,'display','flex')
        updateComponent(kotListRef,'display','none')
    },[])


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

    const renderItem = useCallback(({item, index}: any) => <Item item={item} key={item.key} hasLast={invoiceitems.length === index+1} isRestaurant={hasrestaurant}   index={index}/>, []);
    const renderKot = useCallback(({item, index}: any) => <Kot kot={item} hasLast={kots.length === index+1} key={item.key} />, []);

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
                    data={invoiceitems}
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

                />
            </>

        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    kots: state.cartData.kots
})

export default connect(mapStateToProps)(Index);

