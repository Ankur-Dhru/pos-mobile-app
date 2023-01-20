import React, {useEffect, useState} from "react";
import {Image, View} from "react-native";
import {styles} from "../../theme";
import {
    appLog, connectToLocalServer,
    getDatabaseName,
    getLocalSettings,
    getStateAndTaxType,
    intervalInvoice,
    retrieveData
} from "../../libs/function";
import Container from "../../components/Container";
import moment from "moment";
import {useDispatch} from "react-redux";
import {hideLoader} from "../../redux-store/reducer/component";
import {db, device, localredux, urls,} from "../../libs/static";
import {setSettings} from "../../redux-store/reducer/local-settings-data";
import PageLoader from "../../components/PageLoader";


const Index = (props: any) => {

    const {navigation} = props
    device.navigation = navigation;

    useEffect(()=>{
        setTimeout(()=>{
            navigation.replace('GettingStarted')
        },500)
    },[])

    return <Container style={{padding: 0}}><View style={[styles.center, styles.h_100, styles.middle]}>
        <Image
            style={[{width: 150, height: 150}]}
            source={require('../../assets/dhru-logo-22.png')}
        />
    </View></Container>
}

export default Index;
