'use strict';

import React, {useState} from 'react';


import QRCodeScanner from 'react-native-qrcode-scanner';

import {withTheme} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {METHOD, urls} from "../../libs/static";
import apiService from "../../libs/api-service";
import {getTempOrdersByWhere} from "../../libs/Sqlite/selectData";

const Index = () => {

    let scanner: any;
    const navigation = useNavigation()

    const onSuccess = async (e?: any) => {

        let tabledetails: any = {
            "area": "Table Token",
            "invoiceitems": [],
            "kots": [],
            "ordertype": "tabletoken",
            "pax": 1,
            "paxes": "1",
            "qrcodeid": e.data,
            "tableid": e.data,
            "tablename": `Table Token ${e.data}`
        }

        if ((Boolean(urls.localserver))) {

            await apiService({
                method: METHOD.GET,
                action: 'tableorder',
                queryString: {key: 'tableid', value: e.data},
                other: {url: urls.localserver},
            }).then((response: any) => {

                const {kots, numOfKOt}: any = tabledetails;
                if (kots?.length > 0 || numOfKOt > 0) {
                    let {staffid, staffname, ...others}: any = response.data;
                    tabledetails = {
                        ...tabledetails, ...others, currentpax: 'all'
                    }
                } else {
                    tabledetails = {
                        ...tabledetails, ...response.data
                    }
                }
                tabledetails.invoiceitems.map((item: any, index: any) => {
                    item = {
                        ...item, ...item.itemdetail
                    }
                    tabledetails.invoiceitems[index] = item
                })
            })
        } else {
            await getTempOrdersByWhere({tableid: e.data}).then((data) => {
                const tabledata: any = Object.values(data)[0];
                tabledetails = {
                    ...tabledetails, ...tabledata, currentpax: 'all'
                }
            })
        }

        navigation.navigate('CartStackNavigator', tabledetails);

        setTimeout(() => {
            scanner?.reactivate()
        }, 3000)

        /*Linking.openURL(e?.data).catch(err => {
            console.error('An error occured', err)
        });*/
    };

    return (<>
        <QRCodeScanner
            ref={(node) => {
                scanner = node
            }}
            showMarker={true}
            markerStyle={{borderColor: 'white'}}
            cameraTimeout={10000}
            vibrate={true}
            permissionDialogTitle={'Camera Permission'}
            permissionDialogMessage={'Scanning  Table'}
            onRead={onSuccess}
        />

    </>);
}

export default withTheme(Index);

