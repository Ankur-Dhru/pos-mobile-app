import React, {useEffect} from "react";
import {Image, View} from "react-native";
import {styles} from "../../theme";
import Container from "../../components/Container";
import {device,} from "../../libs/static";


const Index = (props: any) => {

    const {navigation} = props
    device.navigation = navigation;

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('GettingStarted')
            //navigation.replace('Sample')
        }, 500)
    }, [])

    return <Container style={{padding: 0}}><View style={[styles.center, styles.h_100, styles.middle]}>
        <Image
            style={[{width: 150, height: 150}]}
            source={require('../../assets/dhru-logo-22.png')}
        />
    </View></Container>
}

export default Index;
