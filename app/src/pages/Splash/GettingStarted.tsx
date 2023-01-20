import React, {useEffect, useState} from "react";
import {Dimensions, Image, Text, View} from "react-native";
import {styles} from "../../theme";
import Container from "../../components/Container";
import {db, device, localredux,} from "../../libs/static";
import Button from "../../components/Button";
import {appLog, connectToLocalServer, getDatabaseName, getLocalSettings, retrieveData} from "../../libs/function";
import moment from "moment/moment";

import PageLoader from "../../components/PageLoader";

const Index = (props: any) => {

    const {navigation} = props

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return (dim.height >= dim.width) ? 'portrait' : 'landscape';
    };

    device.navigation = navigation;
    const [loader,setLoader]:any = useState(false);
    const [oriantation,setoriantation] = useState(isPortrait())

    getDatabaseName().then(async (dbname: any) => {

        let screen = 'SetupStackNavigator';
        if (Boolean(dbname)) {
            db.name = dbname;

            //////// check license and set workspace and staffdata
            await retrieveData(db.name).then(async (data: any) => {
                const {
                    licenseData,
                    initData,
                    localSettingsData,
                } = data || {};

                if (Boolean(data) && Boolean(licenseData)) {
                    const {license: {expired_on, status}} = licenseData.data;
                    const today = moment().format('YYYY-MM-DD');
                    if (expired_on >= today && status === 'Active') {
                        localredux.initData = initData;
                        localredux.localSettingsData = localSettingsData;
                        screen = 'PinStackNavigator';
                        /*await retrieveData(`fusion-dhru-pos-settings`).then(async (data: any) => {
                            await dispatch(setSettings(data));
                        })*/
                    }
                }
            })
            navigation.replace(screen)
        }
        else {
            await getLocalSettings('serverip').then(async (serverip: any) => {
                if (Boolean(serverip)) {
                    screen = 'SetupStackNavigator';
                    navigation.replace(screen)
                }
            })
        }

        setLoader(true)
    })




    appLog('oriantation',oriantation)

    if(!loader){
        return <PageLoader/>
    }

    return <Container style={{padding: 0, backgroundColor: '#0E4194'}}>

        <View style={[styles.grid,styles.flex,styles.h_100]}>

            <View style={[{padding: 40,minWidth:360,height:180}]}>
                <View>
                    <Image
                        style={[{width: 50, height: 50}]}
                        source={require('../../assets/dhru-logo-22.png')}
                    />
                    <View style={[styles.mt_5]}>
                        <Text style={{fontSize: 25,fontWeight:'bold', color: 'white'}}>
                            Start selling with Dhru POS
                        </Text>
                    </View>
                </View>
            </View>


            <View style={[styles.h_100,styles.flex,  styles.middle,styles.flexGrow,styles.w_auto, {position: 'relative',minWidth:400}]}>

                {oriantation === 'portrait' && <View style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 0,
                    height: 1300,
                    width: 1300,
                    borderRadius: 1300
                }}>

                </View> }

                <View style={[styles.flex,styles.h_100,styles.w_100]}>

                    <View style={[styles.center,styles.h_100]}>
                        <View style={[styles.middle]}>
                            <Image
                                style={[{width: 340, height: 280}]}
                                source={require('../../assets/pos-app-welcom.png')}
                            />
                        </View>

                        <View style={[styles.p_5,{width: '100%'}]}>
                            <Button
                                onPress={async () => {
                                    navigation.replace('SetupStackNavigator')
                                }}
                                more={{backgroundColor: '#0E4194', color: 'white', height: 50, borderRadius: 30}}
                            > Get Started </Button>
                        </View>
                    </View>

                </View>



            </View>

        </View>





    </Container>
}

export default Index;
