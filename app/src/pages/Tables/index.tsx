import React, {useEffect, useState} from "react";
import Container from "../../components/Container";
import Tables from "./Tables";

import PageLoader from "../../components/PageLoader";
import {Alert, BackHandler} from "react-native";
import {createNavigationContainerRef} from "@react-navigation/native";
import {checkPrinterSettings} from "../../libs/function";
import * as url from "url";
import {urls} from "../../libs/static";

const Index = (props: any) => {

    const {navigation} = props;


    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);


    const navigationRef = createNavigationContainerRef();
    const goBack: any = () => navigationRef?.canGoBack();

    const handleBackButton = () => {

        if (goBack) {
            return false;
        } else {
            Alert.alert('Hold on!', 'Are you sure you want to close the app?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {text: 'YES', onPress: () => BackHandler.exitApp()},
            ]);
            return true;
        }
    };


    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    }, []);


    useEffect(() => {
        if(!Boolean(urls.localserver)) {
            checkPrinterSettings(navigation)
        }
    }, [])


    if (!loaded) {
        return <PageLoader page={'table'}/>
    }


    return <Container style={{padding: 0}}>
        <Tables/>
    </Container>
}


export default Index;

