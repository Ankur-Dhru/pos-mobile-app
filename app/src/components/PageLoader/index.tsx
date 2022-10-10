import React from "react";
import {ActivityIndicator, View} from "react-native";
import {styles} from "../../theme";
import CartLoader from "../ContentLoader/CartLoader";
import TableLoader from "../ContentLoader/TableLoader";


const Index = (props: any) => {

    const {page}: any = props

    if (page === 'table') {
        return <TableLoader/>
    }
    else if (page === 'cart') {
        return <CartLoader/>
    }

    return <View style={[styles.screenCenter, styles.h_100, styles.transparent]}>
        <ActivityIndicator style={styles.m_1} color={'#016EFE'} size='large' animating={true}/>
    </View>
}


export default Index;
