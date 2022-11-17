import React, {useEffect, useState} from "react";
import Container from "../../components/Container";
import Tables from "./Tables";

import PageLoader from "../../components/PageLoader";
import {useDispatch} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {Menu, Title} from "react-native-paper";
import ProIcon from "../../components/ProIcon";
import DeleteButton from "../../components/Button/DeleteButton";
import {cancelOrder} from "../../libs/function";
import {styles} from "../../theme";
import {setDialog} from "../../redux-store/reducer/component";
import ReserveList from "./ReserveList";

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
    if (!loaded) {
        return <PageLoader page={'table'}/>
    }



    /*React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                Alert.alert(
                    'Alert',
                    'Want to exit app?',
                    [
                        { text: "Don't exit", style: 'cancel', onPress: () => {} },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ]
                );
            }),
        [navigation]
    );*/


    return <Container>
        <Tables/>
    </Container>
}


export default Index;

