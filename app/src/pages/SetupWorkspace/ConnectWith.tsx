import * as React from 'react';

import { View,  TouchableOpacity} from 'react-native';
import {Container} from "../../components";
import {styles} from "../../theme";
import {Paragraph} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {connectToLocalServer, getLocalSettings} from "../../libs/function";
import Button from "../../components/Button";


export default function App() {
    const navigation = useNavigation()

    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(()=>{
        getLocalSettings('serverip').then(async (serverip: any) => {
            if (Boolean(serverip)) {
                await connectToLocalServer(serverip, navigation).then();
            }
            setLoaded(true)
        })
    },[])

    if(!loaded){
        return <></>
    }

    return (
        <Container  style={[{padding:0}]}>

            <View  style={[styles.center, styles.h_100, styles.middle]}>

                <View>
                <Button style={[ styles.w_auto, styles.noshadow]}
                        more={{
                            backgroundColor: styles.secondary.color,
                            color: 'black',
                            height: 60,
                            width:360
                        }} onPress={() => {
                    navigation.navigate('Login')
                }}>Login or register as new terminal</Button>

                </View>


                <View style={[styles.mt_5]}>
                    <Button style={[ styles.w_auto, styles.noshadow]}
                            more={{
                                backgroundColor: styles.primary.color,
                                color: 'white',
                                height: 60,
                                width:360
                            }} onPress={() => {
                        navigation.navigate('LocalServer')
                    }}>Connect to local server</Button>

                </View>


            </View>

        </Container>
    );
}
