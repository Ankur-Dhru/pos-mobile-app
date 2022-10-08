import React from "react";
import {ActivityIndicator, View} from "react-native";
import {styles} from "../../theme";
import ClientareaLoader from "../ContentLoader/ClientareaLoader";
import CartLoader from "../ContentLoader/CartLoader";


const Index = (props: any) => {

    const {page}: any = props

    if (page === 'table') {
        return <View style={[styles.screenCenter, styles.h_100, styles.transparent]}>
            <ClientareaLoader/>
        </View>
    }
    else if (page === 'cart') {
        return <View style={[styles.screenCenter, styles.h_100, styles.transparent]}>
            <CartLoader/>
        </View>
    }

    return <View style={[styles.screenCenter, styles.h_100, styles.transparent]}>
        <ActivityIndicator style={styles.m_1} color={'#016EFE'} size='large' animating={true}/>
    </View>
}


export default Index;
