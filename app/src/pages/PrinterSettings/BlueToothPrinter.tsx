/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState,} from 'react';
import {
    Button,
    FlatList,
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableHighlight, TouchableOpacity,
    View,
} from 'react-native';

import BleManager from 'react-native-ble-manager';
import Mustache from "mustache";
import {EscPos} from "escpos-xml";
import {defaultInvoiceTemplate, testInvoiceData} from "../../libs/static";
import {appLog, getItem, getLeftRight, getTemplate, getTrimChar, numberFormat} from "../../libs/function";
import {Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {v4 as uuidv4} from "uuid";
import {ProIcon} from "../../components";
import InputField from "../../components/InputField";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Index = ({fieldprops, values}: any) => {

    let devices: any = []

    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState<any>([]);

    const [selected, setSelected] = useState(fieldprops.input.value)


    const startScan = () => {
        if (!isScanning) {
            appLog('isScanning',isScanning)
            BleManager.scan([], 3, true).then((results) => {
                appLog('results',results)
                setIsScanning(true);
            }).catch(err => {
                appLog(err);
            });
        }
    }

    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
    }

    const handleDisconnectedPeripheral = (data: any) => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + data.peripheral);
    }

    const handleUpdateValueForCharacteristic = (data: any) => {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }


    const handleDiscoverPeripheral = (peripheral: any) => {
        if (!peripheral.name) {
            peripheral.name = peripheral.id;
        }
        devices.push({label: peripheral.name, value: peripheral.id, more: peripheral})
        setList(devices)
    }


    useEffect(() => {
        BleManager.start({showAlert: false});
        const BleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        const BleManagerStopScan = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        const BleManagerDisconnectPeripheral = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        const BleManagerDidUpdateValueForCharacteristic = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    startScan()
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            startScan()
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }


        return (() => {

            console.log('unmount');
            BleManagerDiscoverPeripheral.remove();
            BleManagerStopScan.remove();
            BleManagerDisconnectPeripheral.remove();
            BleManagerDidUpdateValueForCharacteristic.remove();

            // bleManagerEmitter?.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
            // bleManagerEmitter?.removeListener('BleManagerStopScan', handleStopScan);
            // bleManagerEmitter?.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
            // bleManagerEmitter?.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        })
    }, []);


    return (
        <>
            <InputField
                label={'Bluetooth Devices'}
                mode={'flat'}
                key={uuidv4()}
                list={list}
                value={selected}
                selectedValue={selected}
                displaytype={'pagelist'}
                inputtype={'dropdown'}
                listtype={'other'}
                addItem={<TouchableOpacity onPress={async () => {

                }}>
                    <Paragraph><ProIcon name={'plus'}/></Paragraph></TouchableOpacity>}
                onChange={(value: any, more: any) => {
                    setSelected(value);
                    values.bluetoothdetail = more
                    fieldprops.input.onChange(value);
                }}>
            </InputField>
        </>
    );
};


export default Index;
