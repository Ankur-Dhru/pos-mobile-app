import React, {useCallback, useEffect, useRef, useState} from "react";

import {FlatList, ScrollView, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";

import Item from "../Cart/Item";
import Kot from "../Cart/Kot";
import {styles} from "../../theme";
import {Card, Paragraph, Text} from "react-native-paper";
import CartSummary from "./CartSummary";
import Button from "../../components/Button";
import {appLog, clone, isRestaurant} from "../../libs/function";
import {device} from "../../libs/static";
import ProIcon from "../../components/ProIcon";


const ITEM_HEIGHT = 100;
const Index = (props: any) => {


    let {selectItem, invoiceitems,kots} = props;

    const hasrestaurant = isRestaurant();

    const [displayKOT,setDisplayKOT]:any = useState(false)
    const flatListRef = React.useRef<FlatList>(null);



    React.useLayoutEffect(() => {
        const timeout = setTimeout(() => {
            if (flatListRef.current && invoiceitems && invoiceitems.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [invoiceitems?.length]);


    const renderItem = useCallback(({item, index}: any) => <Item item={item} key={item.key} hasLast={invoiceitems.length === index+1} isRestaurant={hasrestaurant} selectItem={selectItem}  index={index}/>, []);
    const renderKot = useCallback(({item, index}: any) => <Kot kot={item} hasLast={kots.length === index+1} key={item.key} />, []);


    appLog('cartitems list')


    return (
        <>
            {Boolean(kots?.length > 0) &&  <View>
                <View style={[styles.grid,styles.justifyContent,styles.mb_2]}>

                    <Button style={[styles.w_auto]} compact={true}  onPress={() => {setDisplayKOT(false)}} secondbutton={displayKOT} ><Text style={{color:'black'}}>Items</Text></Button>
                    <Button style={[styles.ml_2,styles.w_auto]} compact={true}  onPress={() => {setDisplayKOT(true)}} secondbutton={!displayKOT}><Text style={{color:'black'}}>KOTs</Text></Button>
                </View>
            </View>}


            {displayKOT ? <>
                    <FlatList
                        data={kots}
                        renderItem={renderKot}
                    />
                </>
                :
                <FlatList
                    data={invoiceitems}
                    ref={flatListRef}
                    getItemLayout={(data, index) => {
                        return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
                    }}
                    renderItem={renderItem}
                    ListEmptyComponent={()=>{
                        return (
                            <Card>
                                <Card.Content>
                                    <View style={{marginTop:50}}><Paragraph style={[styles.paragraph,{textAlign:'center'}]}>No any item(s) added</Paragraph></View>
                                    <View  style={{marginTop:20}}><Paragraph  style={[styles.paragraph,{textAlign:'center'}]}><ProIcon name={'utensils'} size={25}/></Paragraph></View>
                                </Card.Content>
                            </Card>
                        )
                    }}

                />}

        </>
    )
}


const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
    kots: state.cartData.kots
})

export default connect(mapStateToProps)(Index);
