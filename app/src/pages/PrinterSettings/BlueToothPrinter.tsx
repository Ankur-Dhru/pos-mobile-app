import React, {useEffect, useState,} from 'react';
import {
    FlatList,
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import BleManager from 'react-native-ble-manager';
import {ItemDivider} from "../../libs/static";
import {appLog} from "../../libs/function";
import {List} from "react-native-paper";
import {styles} from "../../theme";
import Button from "../../components/Button";
import PageLoader from "../../components/PageLoader";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Index = ({fieldprops, values}: any) => {

    let devices: any = []

    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState<any>({});

    const [selected, setSelected] = useState(fieldprops.input.value)


    const startScan = () => {
        BleManager.enableBluetooth()
            .then(() => {
                if (!isScanning) {
                    appLog('isScanning', isScanning)
                    BleManager.scan([], 5, true).then((results) => {
                        setIsScanning(true);
                    }).catch(err => {
                        appLog(err);
                    });
                }
                console.log("The bluetooth is already enabled or the user confirm");
            })
            .catch((error) => {
                // Failure code
                console.log("The user refuse to enable bluetooth");
            });


    }

    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
        // retrieveConnected()
    }

    const handleDisconnectedPeripheral = (data: any) => {
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;

            appLog('peripheral', peripheral)

            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        console.log('Disconnected from ' + data.peripheral);
    }

    const handleUpdateValueForCharacteristic = (data: any) => {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    const retrieveConnected = () => {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }

            for (var i = 0; i < results.length; i++) {
                var peripheral: any = results[i];
                peripheral.connected = true;
                // devices.push({label: peripheral.name, value: peripheral.id, more: peripheral})
            }

            //setList(devices)

        });
    }


    const handleDiscoverPeripheral = (peripheral: any) => {
        if (!peripheral.name) {
            peripheral.name = peripheral.id;
        }
        list[peripheral.id] = {label: peripheral.name, value: peripheral.id, more: peripheral};
        setList(list)
    }


    useEffect(() => {


        BleManager.start({showAlert: false}).then(() => {
            if (Platform.OS === 'android' && Platform.Version >= 23) {
                PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]).then((result) => {
                    appLog('result', result)
                    if (result) {
                        startScan()
                        console.log("User accept");
                    } else {
                        console.log("User refuse");
                    }
                });
            } else {
                startScan()
            }
        });
        const BleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        const BleManagerStopScan = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        const BleManagerDisconnectPeripheral = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        const BleManagerDidUpdateValueForCharacteristic = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);


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


    const renderdevices = (i: any) => {
        return (
            <List.Item
                style={[styles.listitem]}
                onPress={() => {
                    setSelected(i.item.value);
                    values.bluetoothdetail = i.item;
                    fieldprops.input.onChange(i.item.value);
                }}
                title={i.item.label}
                left={() => <List.Icon icon="printer-wireless"/>}
                right={() => i.item.value === selected && <List.Icon icon="check"/>}
                key={i.item.value}
            />
        );
    };

    if (!Object.values(list).length) {
        return <>
            <View style={[styles.p_6]}>
                <PageLoader/>
                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> Please wait Scanning....</Text>
            </View>
        </>
    }

    return <>

        <FlatList
            data={Object.values(list)}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            renderItem={renderdevices}

            ItemSeparatorComponent={ItemDivider}
            ListEmptyComponent={<View>
                <View style={[styles.p_6]}>
                    <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No any devices
                        found</Text>
                </View>
            </View>}
            keyExtractor={item => item.value}
        />

        {/*<View style={[styles.mt_3]}>
            <TouchableOpacity>
                <Button
                    more={{color: 'black', backgroundColor: styles.secondary.color}}
                    secondbutton={true}
                    onPress={async () => {
                        //setList({});
                        startScan()
                    }}> Scan Again
                </Button>
            </TouchableOpacity>
        </View>*/}

    </>

    /*    return (
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
        );*/
};


export default Index;


