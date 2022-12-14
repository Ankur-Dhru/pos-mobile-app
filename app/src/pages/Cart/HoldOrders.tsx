import React, {useEffect, useState} from "react";
import {FlatList, Text, View} from "react-native";
import {Caption, List, Paragraph, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {current, ItemDivider} from "../../libs/static";
import {styles} from "../../theme";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {dateFormat, getTempOrders, toCurrency} from "../../libs/function";
import moment from "moment";


const Index = (props: any) => {

    const [tableorders,setTableOrders]:any = useState({})

    useEffect(()=>{
        getTempOrders().then((orders:any)=>{
            setTableOrders(orders)
        })
    },[])

    const dispatch = useDispatch()




    const renderitem = ({item}: any) => {
        return <List.Item
            style={[styles.listitem]}
            title={`${item.clientname}`}
            description={moment(item.localdatetime).format(dateFormat(true))}
            left={(props: any) => <List.Icon {...props} icon="newspaper-variant-multiple-outline"/>}
            right={() =>  <List.Icon icon="chevron-right"/>}

            onPress={async () => {
                current.table = item;
                await dispatch(setBottomSheet({visible: false}))
                dispatch(setCartData(item))
            }}
        />
    }


    return <View style={[styles.p_6, styles.w_100, styles.h_100]}>
        <Caption style={[styles.caption]}>{'Holding List'}</Caption>
        <FlatList
            data={Object.values(tableorders)}
            renderItem={renderitem}
            ItemSeparatorComponent={ItemDivider}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            initialNumToRender={5}
            ListEmptyComponent={() => {
                return (<View style={[]}><Paragraph  style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>No any Holding Orders</Paragraph></View>)
            }}
        />
    </View>
}




export default  Index;

