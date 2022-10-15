import React, {useEffect, useRef, useState} from "react";

import {Image, TouchableOpacity, View} from "react-native";
import Container from "../../components/Container";
import ReactNativePinView from "react-native-pin-view"
import {useDispatch} from "react-redux";
import { retrieveData, syncData} from "../../libs/function";

import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {Card, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import moment from "moment/moment";

import {setTableOrdersData} from "../../redux-store/reducer/table-orders-data";
import {localredux} from "../../libs/static";
import {appLog, groupBy} from "../../libs/function";
import store from "../../redux-store/store";
import {setOrder, setOrdersData} from "../../redux-store/reducer/orders-data";
import { setSettings } from "../../redux-store/reducer/local-settings-data";

const md5 = require('md5');


const Index = (props: any) => {

    let {route: {params}, navigation}: any = props;
    let {workspace}: any = localredux.initData;

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
                                clientsData,
                                addonsData,
                                itemsData,
                                orders
                            } = data || {};

                            if (Boolean(data) && Boolean(licenseData)) {
                                const {license: {expired_on, status}} = licenseData.data;
                                const today = moment().format('YYYY-MM-DD');
                                if (expired_on >= today && status === 'Active') {

                                    localredux.licenseData=licenseData;
                                    localredux.authData=authData;
                                    localredux.clientsData = clientsData;

                                    localredux.addonsData = addonsData;
                                    localredux.itemsData = itemsData;
                                    localredux.groupItemsData = groupBy(Object.values(itemsData), 'itemgroupid');

                                    await dispatch(setOrdersData(orders));
                                    /*await dispatch(setLicenseData(licenseData));
                                    await dispatch(setItemsData(items));
                                    await dispatch(setAddonsData(addons));
                                    await dispatch(setclientsData(clients));
                                    await dispatch(setRestaurant(isRestaurant));
                                    await dispatch(setCurrentLocation(currentLocation));
                                    await dispatch(setInitData(initData));
                                    await dispatch(setAuthData(authData));
                                    */

                                    await retrieveData('fusion-pro-pos-mobile-tableorder').then(async (tableorders: any) => {
                                        await dispatch(setTableOrdersData(tableorders));
                                    })

                                    await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
                                        if(!Boolean(data?.today) || (data?.today !== today) ){
                                            data.today =  today
                                        }
                                        await dispatch(setSettings(data));
                                    })

                                }
                            }
                            await dispatch(hideLoader())
                        })
                    localredux.loginuserData=params;
                   await navigation.replace('DrawerStackNavigator');

                } else {
                    dispatch(setAlert({visible: true, message: 'Wrong Pin'}));
                    pinView.current.clearAll()
                }
            }
        },200)
    }, [enteredPin])


    return <Container hideappbar={Boolean(params.onlyone)} >

        <Card>

            <View style={[styles.center, styles.h_100, styles.middle]}>

                <View style={{width:300}}>

                    <View style={[styles.grid,styles.center,{marginBottom:5}]}>
                        <Image
                            style={[{width: 50, height: 50,margin:'auto'}]}
                            source={require('../../assets/dhru-logo-22.png')}
                        />
                    </View>

                    <View>

                        <Paragraph style={[styles.paragraph,{textAlign:'center'}]}>{params.username}</Paragraph>
                    </View>

                <ReactNativePinView
                    inputSize={20}
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
