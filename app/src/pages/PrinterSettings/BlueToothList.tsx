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
import {List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import Button from "../../components/Button";
import PageLoader from "../../components/PageLoader";
import {useDispatch} from "react-redux";
import {setBottomSheet} from "../../redux-store/reducer/component";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Index = ({setMacId}: any) => {

    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState<any>({});

    const [selected, setSelected] = useState('')

    const dispatch = useDispatch()


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
            list[peripheral.id] = {label: peripheral.name, value: peripheral.id, more: peripheral};
        }
        setList(list)
        console.log('Disconnected from ' + data.peripheral);
    }

    const handleUpdateValueForCharacteristic = (data: any) => {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }

    const retrieveConnected = () => {
        BleManager.getConnectedPeripherals([]).then((results) => {

            appLog('results',results)

            if (results.length == 0) {
                console.log('No connected peripherals')
            }

            for (var i = 0; i < results.length; i++) {
                var peripheral: any = results[i];
                peripheral.connected = true;
                list[peripheral.id] = {label: peripheral.name, value: peripheral.id, more: peripheral};
            }

            appLog('list',list)

            setList(list)
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
        BleManager.start({showAlert: true});

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
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
            bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
            bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
            bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
            bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
        })
    }, []);

    const setDevice = () => {



        setMacId({
            bluetoothdevice:selected,
        })
        dispatch(setBottomSheet({visible:false}))
    }


    const renderdevices = (i: any) => {
        return (
            <List.Item
                style={[styles.listitem]}
                onPress={() => {
                    appLog('selected',i.item)
                    setSelected(i.item);
                }}
                title={i.item.label}
                left={() => <List.Icon icon="printer-wireless"/>}
                right={() => i.item.value === selected?.value && <List.Icon icon="check"/>}
                key={i.item.value}
            />
        );
    };


    return <>


        <View style={[styles.w_100,styles.h_100,styles.flex]}>

            <View style={[styles.px_5,styles.grid,styles.justifyContent]}>
                {/*<View>
                    <Button more={{color: 'black',backgroundColor:styles.secondary.color}}
                            onPress={() => {
                                retrieveConnected()
                            }}> Retrieve connected peripherals
                    </Button>
                </View>
*/}
                <View style={[styles.w_auto]}>
                    <Button more={{color: 'black',backgroundColor:styles.secondary.color}}
                            onPress={() => {
                                startScan()
                            }}> {isScanning ? 'Scanning' : 'Start Scan'}
                    </Button>
                </View>

            </View>

            <FlatList
                data={Object.values(list)}
                keyboardDismissMode={'on-drag'}
                keyboardShouldPersistTaps={'always'}
                renderItem={renderdevices}

                ItemSeparatorComponent={ItemDivider}
                ListEmptyComponent={<View>
                    <View style={[styles.p_6]}>
                        {isScanning ? <Paragraph style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>
                            <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> Please wait Scanning....</Text>
                        </Paragraph> :  <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No any devices found</Text>}
                    </View>
                </View>}
                keyExtractor={item => item.value}
            />
        </View>

        <View style={[styles.submitbutton,styles.w_100]}>
            <View style={[styles.p_5]}>

                <Button
                        onPress={() => {
                            Boolean(selected) && setDevice()
                        }}> Confirm
                </Button>
            </View>
        </View>

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


