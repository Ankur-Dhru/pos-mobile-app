import React, {useCallback, useEffect, useRef, useState} from "react";

import {Image, TouchableOpacity, View} from "react-native";
import Container from "../../components/Container";
import ReactNativePinView from "react-native-pin-view"
import {useDispatch} from "react-redux";
import {appLog, retrieveData, syncData} from "../../libs/function";

import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {Card, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import moment from "moment/moment";

import {setTableOrdersData} from "../../redux-store/reducer/table-orders-data";
import {localredux} from "../../libs/static";
import {groupBy} from "../../libs/function";
import { setOrdersData} from "../../redux-store/reducer/orders-data";
import { setSettings } from "../../redux-store/reducer/local-settings-data";
import {ProIcon} from "../../components";
import {readTable} from "../../libs/Sqlite/selectData";
import {CREATE_ITEM_INDEX, TABLE} from "../../libs/Sqlite/config";
import {getDBConnection} from "../../libs/Sqlite";

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
                                clientsData,
                                addonsData,

                                orders
                            } = data || {};

                            if (Boolean(data) && Boolean(licenseData)) {
                                const {license: {expired_on, status}} = licenseData.data;
                                const today = moment().format('YYYY-MM-DD');
                                if (expired_on >= today && status === 'Active') {

                                    localredux.licenseData=licenseData;
                                    localredux.authData=authData;
                                    localredux.clientsData = clientsData;
                                    localredux.localSettingsData = localSettingsData;
                                    localredux.addonsData = addonsData;

                                     //localredux.itemsData = await readTable(TABLE.ITEM,'3468866f-e582-4649-8d7f-b3aef30ce8a9').then()

                                    //localredux.groupItemsData = groupBy(localredux.itemsData, 'itemgroupid');


                                    await dispatch(setOrdersData(orders));


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


    return <Container hideappbar={true}  >

        <Card>
            <View style={{position:'absolute',zIndex:99}}>
                <TouchableOpacity  style={[styles.p_6]} onPress={()=>navigation.goBack()}>
                    <ProIcon name={'chevron-left'}  />
                </TouchableOpacity>
            </View>
            <View style={[styles.center, styles.h_100, styles.middle]}>

                <View style={{width:300}}>

                    <View style={[styles.grid,styles.center,]}>
                        <Image
                            style={[{width: 45, height: 45,margin:'auto',marginBottom:5}]}
                            source={require('../../assets/dhru-logo-22.png')}
                        />
                    </View>

                    <View>
                        <Paragraph style={[styles.paragraph,{textAlign:'center'}]}>{params.username}</Paragraph>
                    </View>

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
