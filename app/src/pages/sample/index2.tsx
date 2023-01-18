/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef} from 'react';
import {Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {
    BLEPrinter,
    IBLEPrinter,
    INetPrinter,
    IUSBPrinter,
    NetPrinter,
    USBPrinter
} from 'react-native-thermal-receipt-printer-image-qr';

import {DeviceType} from './FindPrinter';
import {appLog} from "../../libs/function";

const printerList: Record<string, any> = {
    ble: BLEPrinter,
    net: NetPrinter,
    usb: USBPrinter,
};

export interface SelectedPrinter
    extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
    printerType?: keyof typeof printerList;
}

export const PORT: string = '9100';

export enum DevicesEnum {
    usb = 'usb',
    net = 'net',
    blu = 'blu',
}

const deviceWidth = Dimensions.get('window').width;
const EscPosEncoder = require('esc-pos-encoder')

const Sample = ({route}: any) => {
    const [selectedValue, setSelectedValue] = React.useState<keyof typeof printerList>(DevicesEnum.net);
    const [devices, setDevices] = React.useState([]);
    // const [connected, setConnected] = React.useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>(
        {},
    );
    let QrRef = useRef<any>(null);
    const [selectedNetPrinter, setSelectedNetPrinter] =
        React.useState<DeviceType>({
            device_name: 'My Net Printer',
            host: '10.1.1.200', // your host
            port: PORT, // your port
            printerType: DevicesEnum.net,
        });

    React.useEffect(() => {
        if (route.params?.printer) {
            setSelectedNetPrinter({
                ...selectedNetPrinter,
                ...route.params.printer,
            });
        }
    }, [route.params?.printer]);

    const getListDevices = async () => {
        const Printer = printerList[selectedValue];
        // get list device for net printers is support scanning in local ip but not recommended
        if (selectedValue === DevicesEnum.net) {
            await Printer.init();
            setLoading(false);
            return;
        }
        requestAnimationFrame(async () => {
            try {
                await Printer.init();
                const results = await Printer.getDeviceList();
                setDevices(
                    results?.map((item: any) => ({
                        ...item,
                        printerType: selectedValue,
                    })),
                );
            } catch (err) {
                console.warn(err);
            } finally {
                setLoading(false);
            }
        });
    };


    const handleConnectSelectedPrinter = async () => {
        setLoading(true);
        const Printer: typeof NetPrinter = printerList[selectedValue];
        const connect = async () => {
            await Printer.init();
            try {
                const status = await NetPrinter.connectPrinter(selectedNetPrinter?.host || '', 9100);
                setLoading(false);
                console.log('connect -> status', status);
                Alert.alert(
                    'Connect successfully!',
                    `Connected to ${status.host ?? 'Printers'} !`,
                );
            } catch (err) {
                console.warn(err);
            } finally {
                setLoading(false);
            }
        };
        await connect();
    };


    const handlePrintBillWithImage = async () => {

        appLog('printerList', printerList);
        appLog('selectedValue', selectedValue)

        handleConnectSelectedPrinter().then(() => {
            const Printer: typeof NetPrinter = printerList[selectedValue];
            Printer.printImage('https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/3a/bd/b5/the-food-bill.jpg', {
                imageWidth: 575,
                // imageHeight: 1000,
                // paddingX: 100
            })
            Printer.printBill("", {beep: false});
        })


    }


    return (
        <View style={styles.container}>

            <View style={styles.section}>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: 'blue'}]}
                        onPress={handlePrintBillWithImage}>

                        <Text style={styles.text}>Print bill With Image</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
};

export default Sample

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {},
    rowDirection: {
        flexDirection: 'row',
    },
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        height: 40,
        width: deviceWidth / 1.5,
        alignSelf: 'center',
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    title: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    qr: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    }
});
