import React, {useEffect, useState} from "react";
import {Dimensions, Image, Platform, ScrollView, Text, View} from "react-native";
import {styles} from "../../theme";
import Container from "../../components/Container";
import {db, device, localredux,} from "../../libs/static";
import Button from "../../components/Button";
import {
    appLog,
    connectToLocalServer,
    getDatabaseName,
    getLocalSettings,
    retrieveData,
} from "../../libs/function";
import moment from "moment/moment";


import PageLoader from "../../components/PageLoader";




const Index = (props: any) => {

    const {navigation} = props
    device.navigation = navigation;
    const [loader,setLoader]:any = useState(false);


    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return (dim.height >= dim.width) ? 'portrait' : 'landscape';
    };


    const [oriantation,setOrientation] = useState(isPortrait())


    useEffect(()=>{
        Dimensions.addEventListener('change', () => {
            setOrientation(isPortrait())
        });
    })


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
                        localredux.licenseData = licenseData;
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


    if(!loader){
        return <PageLoader/>
    }


/*    return <Container  style={{padding: 0}}>
        <View style={[styles.grid,styles.h_100,styles.border,styles.flex]}>
            <View style={[styles.border,styles.w_100,styles.flexGrow,{backgroundColor:'red',minHeight:200,maxWidth:420}]}>
                <Paragraph>Helo</Paragraph>
            </View>
            <View style={[styles.border,styles.flexGrow,styles.h_100,{backgroundColor:'green',minWidth:'50%'}]}>
                <View style={[styles.h_100,styles.flex]}>
                    <View style={[]}>
                        <Paragraph>Helo2</Paragraph>
                        <Paragraph>Helo2</Paragraph>
                        <Paragraph>Helo2</Paragraph>
                    </View>
                    <View style={[styles.mt_auto]}>
                        <Paragraph>Helo2</Paragraph>
                    </View>
                </View>
            </View>
        </View>
    </Container>*/


    return <Container style={{padding: 0, backgroundColor: '#0E4194',height:'100%',display:'flex'}}>

        <View style={[styles.flex,styles.h_100,oriantation === 'landscape' && styles.grid]}>

            <View style={[{padding: 40,minWidth:360,height:220}]}>
                <View>
                    <Image
                        style={[{width: 50, height: 50}]}
                        source={require('../../assets/dhru-logo-22.png')}
                    />
                    <View style={[styles.mt_5]}>
                        <Text style={{fontSize: 25,fontWeight:'bold', color: 'white'}}>
                            Start selling with
                        </Text>
                        <Text  style={{fontSize: 25,fontWeight:'bold', color: 'white'}}>
                            Dhru ERP
                        </Text>
                    </View>
                </View>
            </View>


            <View style={[styles.flex,styles.h_100,styles.middle,styles.flexGrow,styles.w_auto,oriantation === 'landscape'?styles.bg_white:'', {position: 'relative',minWidth:400,}]}>

                {<View style={{
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


                    </View>


                    <View style={[styles.p_5,{width: '100%',marginTop:'auto'}]}>
                        <View style={{marginHorizontal:20,marginBottom:20}}>
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
