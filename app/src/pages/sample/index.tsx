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
    TouchableHighlight,
    View,
} from 'react-native';

import BleManager from 'react-native-ble-manager';
import Mustache from "mustache";
import {EscPos} from "escpos-xml";
import {defaultInvoiceTemplate, testInvoiceData} from "../../libs/static";
import {getItem, getLeftRight, getTemplate, getTrimChar, numberFormat} from "../../libs/function";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Index = () => {
    const [isScanning, setIsScanning] = useState(false);
    const peripherals = new Map();
    const [list, setList] = useState<any>([]);
    const [printer, setPrinter] = useState({});


    const startScan = () => {
        if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
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

    const retrieveConnected = () => {
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                var peripheral: any = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
        });
    }

    const handleDiscoverPeripheral = (peripheral: any) => {
        console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        peripherals.set(peripheral.id, peripheral);
        setList(Array.from(peripherals.values()));
    }


    const afterConnection = (peripheral: any) => {
        setTimeout(() => {

            BleManager.retrieveServices(peripheral.id).then((peripheralInfo: any) => {
                console.log("peripheralInfo", peripheralInfo);

                const findSC = peripheralInfo?.characteristics?.find((sc: any) => sc?.characteristic?.length === 36 && sc?.service?.length === 36)
                if (findSC?.service && findSC?.characteristic) {

                    setTimeout(() => {
                        BleManager.startNotification(peripheral.id, findSC?.service, findSC?.characteristic).then(() => {
                            console.log('Started notification on ' + peripheral.id);
                            setTimeout(async () => {
                                const cartData: any = testInvoiceData;

                                const decimalPlace = 2;
                                let printJson = {
                                    ...cartData,
                                    isdisplaytaxable: cartData?.vouchersubtotaldisplay != cartData?.vouchertaxabledisplay,
                                    head: () => getItem("DESCRIPTION", "QNT", "RATE", "AMOUNT") + "\n" + getItem("HSN Code", "GST %", "", ""),
                                    items: cartData?.invoiceitems?.map((item: any) => getItem(item.productdisplayname, item.productqnt, numberFormat(item.productratedisplay, 2), numberFormat(item.product_total_price_display, 2)) + "\n" +
                                        getItem(item?.hsn, item?.totalTaxPercentageDisplay + "%", "", "")),
                                    total: () => getLeftRight(cartData.paymentsby || 'Total', numberFormat(cartData?.vouchertotaldisplay, decimalPlace)),
                                    subtotal: () => getLeftRight(cartData.paymentsby || 'Sub Total', numberFormat(cartData?.vouchertotaldisplay, decimalPlace)),
                                    taxabledisplay: () => getLeftRight("Taxable", numberFormat(cartData?.vouchertaxabledisplay, decimalPlace)),
                                    totalbig: () => getLeftRight(cartData.paymentsby || 'Total', numberFormat(cartData?.vouchertotaldisplay, decimalPlace), true),
                                    totaltax: () => getLeftRight("TotalTax", numberFormat(cartData?.vouchertaxdisplay, decimalPlace)),
                                    discount: () => getLeftRight("Discount", numberFormat(cartData?.vouchertotaldiscountamountdisplay, decimalPlace)),
                                    roundoff: () => getLeftRight("Roundoff", numberFormat(cartData?.voucherroundoffdisplay, decimalPlace)),
                                    adjustment: () => getLeftRight("Adjustment", numberFormat(cartData?.adjustmentamount, decimalPlace)),
                                    totalMRP: () => getLeftRight("Total MRP", numberFormat(cartData?.totalMRP, decimalPlace)),
                                    paymentList: () => cartData.payment.map((pm: any) => {
                                        if (Boolean(pm?.paymentAmount)) {
                                            getLeftRight(pm.paymentby, numberFormat(pm?.paymentAmount))
                                        }
                                    }),
                                    taxes: () => cartData?.typeWiseTaxSummary?.map((item: any) => {
                                        return `${item?.taxtype}:${numberFormat(item?.taxprice, decimalPlace)}`
                                    }).join(", "),
                                    line: () => "<text>" + getTrimChar(0, "-") + "\n</text>",
                                }

                                let xmlData = Mustache.render(getTemplate(defaultInvoiceTemplate), printJson);
                                const buffer: any = EscPos.getBufferFromXML(xmlData);
                                BleManager.write(peripheral.id, findSC?.service, findSC?.characteristic, [...buffer]).then(() => {

                                });

                            }, 500);
                        }).catch((error) => {
                            console.log('Notification error', error);
                        });
                    }, 200);
                }
            });


        }, 900);
    }

    const testPeripheral = (peripheral: any) => {

        console.log("peripherals", JSON.stringify(peripheral))
        if (peripheral) {
            if (peripheral.connected) {
                alert("CONNECTED")
                // BleManager.disconnect(peripheral.id);
                afterConnection(peripheral)
            } else {
                alert("not CONNECTED")
                BleManager.connect(peripheral.id).then(() => {
                    let p = peripherals.get(peripheral.id);
                    if (p) {
                        p.connected = true;
                        peripherals.set(peripheral.id, p);
                        setList(Array.from(peripherals.values()));
                    }
                    console.log('Connected to ' + peripheral.id);
                    afterConnection(peripheral)
                }).catch((error) => {
                    console.log('Connection error', error);
                });
            }
        }

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

    const renderItem = (item: any) => {
        const color = item.connected ? 'green' : '#fff';
        return (
            <TouchableHighlight onPress={() => setPrinter(item)}>
                <View style={[{backgroundColor: color}]}>
                    <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
                    <Text style={{
                        fontSize: 10,
                        textAlign: 'center',
                        color: '#333333',
                        padding: 2
                    }}>RSSI: {item.rssi}</Text>
                    <Text style={{
                        fontSize: 8,
                        textAlign: 'center',
                        color: '#333333',
                        padding: 2,
                        paddingBottom: 20
                    }}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );
    }


    const printDirect = () => {
        testPeripheral(printer)
    }

    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                >

                    <View>

                        <View style={{margin: 10}}>
                            <Button
                                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                                onPress={() => startScan()}
                            />
                        </View>

                        <View style={{margin: 10}}>
                            <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected()}/>
                        </View>

                        <View style={{margin: 10}}>
                            <Button title="Direct Print" onPress={() => printDirect()}/>
                        </View>


                        {(list.length == 0) &&
                            <View style={{flex: 1, margin: 20}}>
                                <Text style={{textAlign: 'center'}}>No peripherals</Text>
                            </View>
                        }


                    </View>
                </ScrollView>
                <FlatList
                    data={list}
                    renderItem={({item}) => renderItem(item)}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </>
    );
};


export default Index;
