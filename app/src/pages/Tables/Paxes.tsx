import {FlatList, ScrollView, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph, Text} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import React from "react";
import {connect, useDispatch} from "react-redux";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";


const Paxes = () => {

    const dispatch = useDispatch();

    const onClickPax = (item: any) => {
        dispatch(updateCartField({paxes:item,pax:item}))
        dispatch(setDialog({visible: false}))
    }

    const paxes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

    return <>
        <ScrollView>
            <View style={[styles.grid]}>
                {
                     paxes.map((number:any)=>{
                         return <>
                             <TouchableOpacity  style={[styles.m_2,styles.p_5,styles.flexGrow,styles.bg_light,{borderRadius:10,width:'25%'}]} onPress={()=>{ onClickPax(number);}}>
                                 <Paragraph style={[styles.bold,{textAlign:'center',textAlignVertical:'center'}]}>{number}</Paragraph>
                             </TouchableOpacity>
                         </>
                     })
                }
            </View>
        </ScrollView>
    </>
}



export default Paxes;

