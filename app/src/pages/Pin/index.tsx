import React, {memo, useEffect, useRef, useState} from "react";

import {Platform, ScrollView, View} from "react-native";
import Container from "../../components/Container";
import {connect, useDispatch} from "react-redux";
import {
    appLog,
    errorAlert,
    getAddons,
    getClients,
    getTempOrders,
    prelog,
    retrieveData,
    syncData
} from "../../libs/function";

import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";
import {Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import moment from "moment/moment";
import {db, device, localredux, METHOD, urls} from "../../libs/static";
import {setSettings} from "../../redux-store/reducer/local-settings-data";

import {setGroupList} from "../../redux-store/reducer/group-list";
import {setTableOrdersData} from "../../redux-store/reducer/table-orders-data";
import apiService from "../../libs/api-service";
import {
    CodeField,
    Cursor,
    isLastFilledCell,
    MaskSymbol,
    useBlurOnFulfill,
    useClearByFocusCell
} from "react-native-confirmation-code-field";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import {getUniqueId} from "react-native-device-info";
//import crashlytics from "@react-native-firebase/crashlytics";


const md5 = require('md5');


const Index = (props: any) => {

    let {route: {params}, navigation, syncDetail}: any = props;

    const dispatch = useDispatch()


    let isRestaurant = false;

    const setData = async (data: any) => {
        const {
            initData,
            licenseData,
            authData,
            localSettingsData,
        } = data || {};

        if (Boolean(data) && Boolean(licenseData)) {

            const {license: {expired_on, status}} = licenseData?.data;
            const today = moment().format('YYYY-MM-DD');

            if (expired_on >= today && status === 'Active') {

                localredux.initData = {...localredux.initData, ...initData};

                localredux.licenseData = licenseData;

                localredux.authData = {...authData, ...params};

                localredux.localSettingsData = localSettingsData;

                device.global_token = initData.global_token

                const {itemgroup}: any = localredux.initData;

                let filterGroups: any = {}

                if (Boolean(itemgroup)) {
                    Object.keys(itemgroup).forEach((key) => {
                        if (itemgroup[key].itemgroupstatus == 1) {
                            filterGroups[key] = itemgroup[key]
                        }
                    })
                }

                localredux.localSettingsData.currentLocation ={
                    ...localredux.localSettingsData.currentLocation,
                    sellbyserial:true
                }


                await dispatch(setGroupList(filterGroups))

                await getClients().then()
                await getAddons().then()
                await getTempOrders().then((orders) => {
                    dispatch(setTableOrdersData(orders));
                })

                const {othersettings} = localredux.initData;

                //crashlytics().log(`workspace : ${localredux.initData.workspace}`);

                isRestaurant = (localredux.localSettingsData?.currentLocation?.industrytype === 'foodservices');

                await retrieveData(`fusion-dhru-pos-settings`).then(async (data: any) => {
                    await dispatch(setSettings({...data, ...othersettings}));
                })


                await getUniqueId().then((deviceid) => {
                    device.uniqueid = deviceid
                })


                /*if(Platform.OS !== 'ios') {
                    try {
                        console.log('sync start')
                        BackgroundService.start(backgroundSync, options).then(r => {});
                    } catch (e) {
                        appLog('Error', e);
                    }
                }*/
                //await getOrders().then();

            }

        }

        /* const {workspace}: any = localredux.initData;
         analytics().logEvent('workspace', {
             name: workspace,
         }).then(r => {

         })*/

        await dispatch(hideLoader())
        localredux.loginuserData = params;






        if ((isRestaurant && Boolean(urls.localserver)) || !Boolean(urls.localserver)) {
            await navigation.replace('ClientAreaStackNavigator');
        } else {
            urls.localserver = '';
            errorAlert('Remote Terminal not support for retail')
            navigation.replace('SetupStackNavigator')
        }




    }

    useEffect(()=>{
        navigation.setOptions({headerShown: !params.onlyone || Boolean(urls.localserver)})
    },[])



    const [value, setValue]: any = useState("")
    const ref = useBlurOnFulfill({value, cellCount: 5});
    const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {
        setTimeout(async () => {
            if (value.length === 5) {

                const {loginpin, adminid}: any = params;

                if (md5(value) === loginpin) {

                    await dispatch(showLoader())

                    if (Boolean(urls?.localserver)) {
                        apiService({
                            method: METHOD.GET,
                            action: 'loginpin',
                            queryString: {pin: loginpin, adminid: adminid},
                            other: {url: urls.localserver},
                        }).then((response: any) => {
                            let {data} = response;

                            if (Boolean(data)) {

                                let initdata: any = {}
                                Object.keys(data).forEach((key: any) => {
                                    initdata[key] = data[key]?.data || data[key]
                                })

                                const locationid = localredux.licenseData?.data?.location_id;
                                const locations = initdata?.location;


                                let printingtemplates: any = {}
                                Object.values(initdata?.printingtemplate).map((template: any) => {
                                    if (template?.location === locationid) {
                                        printingtemplates[template?.printertype] = template
                                    }
                                })

                                const localSettingsData = {
                                    currentLocation: locations[locationid],
                                    printingtemplates: printingtemplates,
                                    lastSynctime: moment().unix(),
                                    terminalname: 'pending',
                                    isRestaurant: (locations[locationid]?.industrytype === "foodservices"),
                                }


                                setData({
                                    initData: initdata,
                                    licenseData: localredux.licenseData,
                                    localSettingsData: localSettingsData
                                })
                            }


                        })
                    } else {
                        await retrieveData(db.name).then(async (data: any) => {
                            setData(data).then()
                        })
                    }
                } else {
                    dispatch(setAlert({visible: true, message: 'Wrong Pin'}));
                    setValue('');
                    //pinView.current.focus()
                }
            }
        }, 200)
    }, [value]);


    const renderCell = ({index, symbol, isFocused}: any) => {
        let textChild = null;

        if (symbol) {
            textChild = (
                <MaskSymbol
                    maskSymbol="*️"
                    isLastFilledCell={isLastFilledCell({index, value})}>
                    {symbol}
                </MaskSymbol>
            );
        } else if (isFocused) {
            textChild = <Cursor/>;
        }

        return (
            <Text
                key={index}
                style={[styles.cellBox, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        );
    };

    return <Container style={styles.bg_white}>

        <ScrollView>

            <View style={[styles.h_100, styles.middle]}>


                <View style={{width: 300, marginTop: 20}}>


                    <View style={[styles.middle]}>

                        {<View style={[styles.middle]}>
                            <Avatar label={params.firstname + ' ' + params.lastname} value={1} fontsize={30} size={60}/>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, {textTransform: 'capitalize'}]}>{params.firstname} {params.lastname}</Paragraph>
                        </View>}

                    </View>

                    <View>
                        <CodeField
                            ref={ref}
                            {...props1}
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={value}
                            onChangeText={setValue}
                            cellCount={5}
                            autoFocus={!Boolean(syncDetail?.type)}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={renderCell}
                        />
                    </View>

                    <View style={[styles.middle]}>
                        <Paragraph>{params.loginpin === 'b0baee9d279d34fa1dfd71aadb908c3f' &&
                            <Text style={[styles.paragraph, styles.muted, styles.text_xs, {textAlign: 'center'}]}>default
                                pin is 11111</Text>}</Paragraph>
                    </View>


                </View>

                <View style={[styles.p_6, styles.w_100, {maxWidth: 320, marginTop: 50,}]}>

                    {!Boolean(urls?.localserver) && <Button style={[styles.noshadow]}
                                                            more={{
                                                                backgroundColor: 'white',
                                                                borderColor: styles.primary.color,
                                                                borderWidth: 1,
                                                                color: styles.primary.color,
                                                                height: 45,
                                                            }} onPress={() => {

                        syncData().then()
                    }}
                    >Synchronize</Button>}

                </View>


            </View>

        </ScrollView>

    </Container>
}


const mapStateToProps = (state: any) => ({
    syncDetail: state.syncDetail
})

export default connect(mapStateToProps)(withTheme(Index));

//
