import React from "react";
import {Image, Text, View} from "react-native";
import {styles} from "../../theme";
import {retrieveData} from "../../libs/function";
import Container from "../../components/Container";
import moment from "moment";
import {useDispatch} from "react-redux";

import {Card} from "react-native-paper";
import {setTableOrdersData} from "../../redux-store/reducer/table-orders-data";
import {hideLoader} from "../../redux-store/reducer/component";
import {localredux} from "../../libs/static";
import {setLastSyncTime} from "../../redux-store/reducer/local-settings-data";
import store from "../../redux-store/store";
import {setInitData} from "../../redux-store/reducer/init-data";
import {appLog, groupBy} from "../../libs/function";

const Index = (props: any) => {

    const {navigation} = props
    const dispatch = useDispatch()

    //////// check license and set workspace and staffdata
    retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
        const {
            licenseData,
            initData,
            localSettingsData,
            itemsData,
            addonsData
        } = data || {};

        let screen = 'SetupStackNavigator';
        if (Boolean(data) && Boolean(licenseData)) {
            const {license: {expired_on, status}} = licenseData.data;
            const today = moment().format('YYYY-MM-dd');
            if (expired_on >= today && status === 'Active') {

                localredux.initData = initData;
                localredux.localSettingsData = localSettingsData;


                //await store.dispatch(setInitData(initData))

                retrieveData('fusion-pro-pos-mobile-tableorder').then(async (tableorders: any) => {
                    await dispatch(setTableOrdersData(tableorders));
                })
                screen = 'PinStackNavigator';
            }
        }
        dispatch(hideLoader())
        navigation.replace(screen)
    })

    return <Container hideappbar={true}><Card><View style={[styles.center, styles.h_100, styles.middle]}>
        <Image
            style={[{width: 150, height: 150}]}
            source={require('../../assets/dhru-logo-22.png')}
        />
    </View></Card></Container>
}

export default Index;
