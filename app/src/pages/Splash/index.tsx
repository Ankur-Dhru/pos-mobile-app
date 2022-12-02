import React, {useCallback, useEffect} from "react";
import {Image,  View} from "react-native";
import {styles} from "../../theme";
import {appLog, retrieveData} from "../../libs/function";
import Container from "../../components/Container";
import moment from "moment";
import {useDispatch} from "react-redux";

import {Card} from "react-native-paper";
import {setTableOrdersData} from "../../redux-store/reducer/table-orders-data";
import {hideLoader} from "../../redux-store/reducer/component";
import {

    device,
    localredux, PRINTER,

} from "../../libs/static";
import {setSettings} from "../../redux-store/reducer/local-settings-data";

import {getDBConnection} from "../../libs/Sqlite";
import {
    CREATE_ADDON_TABLE, CREATE_CLIENT_TABLE, CREATE_INIT_TABLE,

    CREATE_ITEM_INDEX_ITEMGROUPID,
    CREATE_ITEM_INDEX_ITEMNAME, CREATE_ITEM_INDEX_ITEMUNIQUE,
    CREATE_ITEM_TABLE, CREATE_ORDER_TABLE, CREATE_TEMPORDER_TABLE
} from "../../libs/Sqlite/config";

const Index = (props: any) => {

    const {navigation} = props
    const dispatch = useDispatch();

    device.navigation = navigation;


    const loadDataCallback = useCallback(async () => {
        try {
           const db:any = await getDBConnection();

            db.executeSql(CREATE_ITEM_TABLE);
            db.executeSql(CREATE_ADDON_TABLE);
            db.executeSql(CREATE_CLIENT_TABLE);
            db.executeSql(CREATE_ORDER_TABLE);
            db.executeSql(CREATE_TEMPORDER_TABLE);

            db.executeSql(CREATE_ITEM_INDEX_ITEMGROUPID);
            db.executeSql(CREATE_ITEM_INDEX_ITEMNAME);
            db.executeSql(CREATE_ITEM_INDEX_ITEMUNIQUE);

        } catch (error) {
            appLog('error',error);
        }
    }, []);

    useEffect(() => {
        loadDataCallback().then(r => {});
    }, [loadDataCallback]);




    //////// check license and set workspace and staffdata
    retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
        const {
            licenseData,
            initData,
            localSettingsData,
        } = data || {};

        let screen = 'SetupStackNavigator';
        if (Boolean(data) && Boolean(licenseData)) {
            const {license: {expired_on, status}} = licenseData.data;
            const today = moment().format('YYYY-MM-DD');
            if (expired_on >= today && status === 'Active') {

                localredux.initData = initData;
                localredux.localSettingsData = localSettingsData;


                //await store.dispatch(setInitData(initData))

                retrieveData('fusion-pro-pos-mobile-settings').then(async (settings: any) => {
                    await dispatch(setSettings(settings));
                })


                screen = 'PinStackNavigator';
            }
        }

       // screen = 'Sample';

        await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
            await dispatch(setSettings(data));
        })

        //navigation.replace('PrinterSettings', {type: {name: 'Invoice', departmentid: PRINTER.INVOICE}})

        dispatch(hideLoader())
        navigation.replace(screen)
    })

    return <Container style={{padding:0}}><View style={[styles.center, styles.h_100, styles.middle]}>
        <Image
            style={[{width: 150, height: 150}]}
            source={require('../../assets/dhru-logo-22.png')}
        />
    </View></Container>
}

export default Index;
