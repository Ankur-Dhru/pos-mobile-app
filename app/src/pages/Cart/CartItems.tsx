import React, {useEffect, useRef, useState} from "react";

import {ScrollView, TouchableOpacity, View} from "react-native";

import {connect} from "react-redux";

import Item from "../Cart/Item";
import Kot from "../Cart/Kot";
import {styles} from "../../theme";
import {Card, Paragraph, Text} from "react-native-paper";
import CartSummary from "./CartSummary";
import Button from "../../components/Button";
import {appLog, isRestaurant} from "../../libs/function";
import {device} from "../../libs/static";
import ProIcon from "../../components/ProIcon";

const Index = (props: any) => {




    let {selectItem, itemid} = props;
    let scrollRef: any = useRef();
    const hasrestaurant = isRestaurant();

    const [displayKOT,setDisplayKOT]:any = useState(false)

    let {
        invoiceitems,
        kots,
        vouchersubtotaldisplay,
        vouchertotaldisplay,
        globaltax,
        voucherroundoffdisplay
    }: any = props.cartData;


    if (Boolean(itemid)) {
        invoiceitems = invoiceitems.filter((item: any) => {
            return item.productid === itemid;
        })
    }

    useEffect(() => {
        setTimeout(() => {
            invoiceitems.length > 0 && scrollRef?.current.scrollToEnd();
        }, 500)
    }, [invoiceitems.length])


    const renderitems = (i: any, key: any) => {
        return (
            <Item item={i} key={i.key} hasLast={invoiceitems.length === key+1} isRestaurant={hasrestaurant} selectItem={selectItem}  index={key}/>
        );
    };

    const renderkots = (i: any, key: any) => {
        return (
            <Kot kot={i} hasLast={kots.length === key+1} key={i.key} />
        );
    };

    return (
        <>
            {Boolean(kots.length > 0) &&  <View>
                <View style={[styles.grid,styles.justifyContent,styles.mb_2]}>

                    <Button style={[styles.w_auto]} compact={true}  onPress={() => {setDisplayKOT(false)}} secondbutton={displayKOT} ><Text style={{color:'black'}}>Items</Text></Button>
                    <Button style={[styles.ml_2,styles.w_auto]} compact={true}  onPress={() => {setDisplayKOT(true)}} secondbutton={!displayKOT}><Text style={{color:'black'}}>KOTs</Text></Button>
                </View>
            </View>}

            <ScrollView ref={scrollRef} style={[styles.bg_white,{borderRadius:5}]}>
                {(Boolean(invoiceitems.length > 0) || Boolean(kots.length > 0)) ? <Card style={[Boolean(itemid) && styles.card,!device.tablet && styles.noshadow]}>
                    {<View>
                        {displayKOT ? <>
                            {
                                Boolean(kots.length) && kots.map((item: any, key: any) => {
                                    return renderkots(item, key)
                                })
                            }
                        </>
                            :
                        <>
                            {
                                Boolean(invoiceitems.length) && invoiceitems.map((item: any, key: any) => {
                                    return renderitems(item, key)
                                })
                            }
                        </>}
                    </View>}
                </Card> : <Card>
                    <Card.Content>
                        <View style={{marginTop:50}}><Paragraph style={[styles.paragraph,{textAlign:'center'}]}>No any item(s) added</Paragraph></View>
                        <View  style={{marginTop:20}}><Paragraph  style={[styles.paragraph,{textAlign:'center'}]}><ProIcon name={'utensils'} size={25}/></Paragraph></View>
                    </Card.Content>
                </Card> }
            </ScrollView>

            {!Boolean(itemid) && <CartSummary/>}
        </>
    )
}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})

export default connect(mapStateToProps)(Index);
