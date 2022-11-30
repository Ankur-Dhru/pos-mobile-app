import {FlatList, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph, Text} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import React from "react";
import {connect, useDispatch} from "react-redux";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";


const Paxes = () => {

    const dispatch = useDispatch();

    const onClickPax = (item: any) => {
        dispatch(updateCartField({pax:item}))
        dispatch(setDialog({visible: false}))
    }

    const paxes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    return <>
        <View style={[styles.grid]}>
            {
                 paxes.map((number:any)=>{
                     return <>
                         <Card style={[styles.m_2,styles.flexGrow,{minWidth:70,maxWidth:100}]} onPress={()=>{
                             onClickPax(number);
                         }}>
                             <Card.Content>
                                 <Paragraph style={[{textAlign:'center',textAlignVertical:'center',height:30}]}>{number}</Paragraph>
                             </Card.Content>
                         </Card>
                     </>
                 })
            }
        </View>
    </>
}



export default Paxes;

