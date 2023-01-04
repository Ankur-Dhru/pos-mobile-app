import React from "react";
import {Image, View} from "react-native";
import {styles} from "../../theme";
import {appLog, getDatabaseName, getStateAndTaxType, intervalInvoice, retrieveData} from "../../libs/function";
import Container from "../../components/Container";
import moment from "moment";
import {useDispatch} from "react-redux";
import {hideLoader} from "../../redux-store/reducer/component";
import {db, device, localredux,} from "../../libs/static";
import {setSettings} from "../../redux-store/reducer/local-settings-data";


const Index = (props: any) => {




    const {navigation} = props
    const dispatch = useDispatch();

    device.navigation = navigation;

    //navigation.replace('Sample')


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

                        //await getStateAndTaxType(initData.general?.country).then()

                        screen = 'PinStackNavigator';

                        await retrieveData(`fusion-dhru-pos-settings`).then(async (data: any) => {
                            await dispatch(setSettings(data));
                        })

                    }
                }


            })

        }

        dispatch(hideLoader())
        navigation.replace(screen)

    })


    return <Container style={{padding: 0}}><View style={[styles.center, styles.h_100, styles.middle]}>
        <Image
            style={[{width: 150, height: 150}]}
            source={require('../../assets/dhru-logo-22.png')}
        />
    </View></Container>
}

export default Index;
