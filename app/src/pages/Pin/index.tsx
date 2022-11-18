import React, {useCallback, useEffect, useRef, useState} from "react";

import {Image, TouchableOpacity, View} from "react-native";
import Container from "../../components/Container";
import ReactNativePinView from "react-native-pin-view"
import {useDispatch} from "react-redux";
import {appLog, getAddons, getClients, retrieveData, saveLocalSettings, syncData} from "../../libs/function";

import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {Card, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import moment from "moment/moment";

import {setTableOrdersData} from "../../redux-store/reducer/table-orders-data";
import {  localredux} from "../../libs/static";

import { setOrdersData} from "../../redux-store/reducer/orders-data";
import { setSettings } from "../../redux-store/reducer/local-settings-data";

import {setGroupList} from "../../redux-store/reducer/group-list";


const md5 = require('md5');


const Index = (props: any) => {

    let {route: {params}, navigation}: any = props;

    const dispatch = useDispatch()

    const pinView: any = useRef(null)
    const [enteredPin, setEnteredPin] = useState("")



    useEffect(() => {

        setTimeout(async ()=>{
            if(enteredPin.length === 5){
                if (md5(enteredPin) === params.loginpin) {
                    dispatch(showLoader())

                   await retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {

                            const {
                                licenseData,
                                authData,
                                localSettingsData,
                                orders
                            } = data || {};


                            if (Boolean(data) && Boolean(licenseData)) {
                                const {license: {expired_on, status}} = licenseData.data;
                                const today = moment().format('YYYY-MM-DD');
                                if (expired_on >= today && status === 'Active') {



                                    localredux.licenseData=licenseData;
                                    localredux.authData= {...params,...authData};
                                    localredux.localSettingsData = localSettingsData;

                                    getClients().then()
                                    getAddons().then()


                                    const {itemgroup}:any = localredux.initData;

                                    if(Boolean(itemgroup)) {
                                        await dispatch(setGroupList(itemgroup))
                                    }

                                    await dispatch(setOrdersData(orders));

                                    await retrieveData('fusion-pro-pos-mobile-tableorder').then(async (tableorders: any) => {
                                        await dispatch(setTableOrdersData(tableorders));
                                    })

                                    await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
                                        await dispatch(setSettings(data));
                                    })

                                }
                            }
                            await dispatch(hideLoader())
                        })
                    localredux.loginuserData=params;

                    await navigation.replace('ClientAreaStackNavigator');

                } else {
                    dispatch(setAlert({visible: true, message: 'Wrong Pin'}));
                    pinView.current.clearAll()
                }
            }
        },200)
    }, [enteredPin])

    navigation.setOptions({headerShown:!params.onlyone})




    return <Container hideappbar={true}  >

        <Card>

            <View style={[styles.center, styles.h_100, styles.middle]}>

                <View style={{width:300}}>

                    <View style={[styles.grid,styles.center,]}>
                        <Image
                            style={[{width: 45, height: 45,margin:'auto',marginBottom:5}]}
                            source={require('../../assets/dhru-logo-22.png')}
                        />
                    </View>

                    {params.onlyone && <View>
                        <Paragraph style={[styles.paragraph,{textAlign:'center'}]}>{params.username} </Paragraph>
                        <Paragraph style={[styles.paragraph,styles.text_sm,{textAlign:'center'}]}>{params.loginpin === 'b0baee9d279d34fa1dfd71aadb908c3f' &&  <Text style={[styles.paragraph,styles.muted,{textAlign:'center'}]}>Default PIN is 11111</Text>}</Paragraph>
                    </View>}

                <ReactNativePinView
                    inputSize={15}

                    ref={pinView}
                    pinLength={5}
                    onValueChange={value => value.length === 5 && setEnteredPin(value)}
                    inputViewEmptyStyle={{
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderColor: "#ccc",
                    }}
                    inputViewFilledStyle={{
                        backgroundColor: "#000",
                    }}
                    buttonViewStyle={{
                        borderWidth: 0,
                        backgroundColor: "#eee",
                        borderColor: "#ccc",
                    }}
                    buttonTextStyle={{
                        color: "#000",
                    }}
                    inputViewStyle={{
                        marginBottom:5
                    }}


                />
                </View>

                <View style={{marginTop:10}}>
                    <TouchableOpacity onPress={() => {syncData().then()}}><Text>Sync</Text></TouchableOpacity>
                </View>



            </View>


        </Card>
    </Container>
}



export default Index;

//
