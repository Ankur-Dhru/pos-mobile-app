import React, {useEffect, useRef, useState} from 'react';
import {Alert, ScrollView, View,ActivityIndicator} from 'react-native';
import {styles} from "../../theme";


import {appLog, base64Decode, captureImages, errorAlert,} from "../../libs/function";
import ViewShot from "react-native-view-shot";
import PageLoader from "../../components/PageLoader";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";
import {device} from "../../libs/static";
import WebView from "react-native-webview";
import Button from "../../components/Button";


import EscPosPrinter, {getPrinterSeriesByName,} from 'react-native-esc-pos-printer';
import {useDispatch} from "react-redux";
import {hideLoader, setAlert, showLoader} from "../../redux-store/reducer/component";


global.Buffer = require('buffer').Buffer;


import {Platform} from 'react-native';
import {BLEPrinter, NetPrinter, USBPrinter} from "react-native-thermal-receipt-printer-image-qr";
import ZigzagLines from "../../components/ZigZag";
import ZigZag from "../../components/ZigZag";
import {Paragraph} from "react-native-paper";
import store from "../../redux-store/store";

let printerList:any = ''

if(Platform.OS === 'android') {
    import("react-native-thermal-receipt-printer-image-qr").then(({BLEPrinter, NetPrinter, USBPrinter})=>{
        printerList =   {
            ble: BLEPrinter,
            net: NetPrinter,
            usb: USBPrinter,
        };
    });
}

const Index = ({navigation, route}: any) => {



    const params = route.params;
    const ref: any = useRef();
    const scrollviewRef: any = useRef();
    const {menu, filename, printer}: any = params;

    const Printer: typeof NetPrinter = printerList['net'] || {};

    const [loaded, setLoaded] = useState<boolean>(false)
    const [height, setHeight] = useState(0);

    const dispatch = useDispatch()


    const data = `<!DOCTYPE html>
                <html>
                  <head>
                    <title>Print</title>
                    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">   
                    <style type="text/css">
                      body {
                        margin: 0;
                        padding: 0;                                                                                              
                      }                
                    </style>  
                  </head>
                  <body>   
                    <div>                                        
                        ${base64Decode(device.printpreview)}
                       <div style="text-align: center;font-size: 0.3em;font-weight: bold;font-family: Arial">Powered By Dhru ERP</div>
                       <br/> 
                     </div>
                  </body>
                </html>`;


    const handleConnectSelectedPrinter = async () => {
        const connect = async () => {
            await Printer.init();
            try {
                await Printer.connectPrinter(printer?.host || '', 9100);
            } catch (err) {
                Alert.alert('Printer Connection error!');
            } finally {

            }
        };
        await connect();
    };


    const snapShot = () => {
        const {printer}: any = params;

       // dispatch(showLoader())

        const isSunmi = (printer?.printertype === 'sunmi');
        const isGeneric = (printer?.printername === 'Other - Generic - ESC/POS')

        try {
            ref.current.capture().then(async (uri: any) => {

                await captureImages(isGeneric ? 2000 :1000, uri).then(async (images: any) => {
                    //setImages(images)

                    if (isSunmi) {
                        await SunmiPrinter.printerInit();
                        for (let key in images) {
                            const {base64result, width}: any = images[key];
                            await SunmiPrinter.printBitmap(base64result, width)
                        }
                        await SunmiPrinter.lineWrap(3)
                        await SunmiPrinter.cutPaper()
                        dispatch(setAlert({visible: true, message: 'Print Successful'}))
                    } else {


                        if (!isGeneric) {
                            try {
                                await EscPosPrinter.init({
                                    target: `TCP:${printer.host}`,
                                    seriesName: getPrinterSeriesByName(printer.printername),
                                    language: 'EPOS2_LANG_EN',
                                })

                                let printing = new EscPosPrinter.printing();
                                await printing.initialize().align('center')

                                for (let key in images) {
                                    const {base64result, width}: any = images[key];
                                    await printing.image({uri: 'data:image/png;base64,' + base64result}, {width: width})
                                }

                                await printing.cut().send();
                                dispatch(setAlert({visible: true, message: 'Print Successful'}))
                            }
                            catch (e) {
                                dispatch(setAlert({visible: true, message: 'Printer connection error'}))
                            }
                        } else {
                            try {
                                handleConnectSelectedPrinter().then(async () => {
                                    for (let key in images) {
                                        const {base64result, width}: any = images[key];
                                        await Printer.printImageBase64(base64result, {
                                            imageWidth: width,
                                        })
                                    }
                                    await Printer.printBill("", {beep: false});
                                })
                                dispatch(setAlert({visible: true, message: 'Print Successful'}))
                            }
                            catch (e) {
                                dispatch(setAlert({visible: true, message: 'Printer connection error'}))
                            }
                        }
                    }
                });

                dispatch(hideLoader())
                navigation.goBack()


            });
        } catch (e) {
            dispatch(hideLoader())
            dispatch(setAlert({visible: true, message: e}))
        }

    }


    const loadPrintData = () => {
        const {filename, autoprint, printer}: any = params
        if (autoprint) {
            if (height) {
                appLog('take auto shot')
                setTimeout(async () => {
                    await snapShot()
                    setTimeout(() => {
                        navigation.goBack()
                    })
                }, 1000)
            }
            //printPDF({data: data, filename}).then()
        }
    }

    useEffect(() => {
        loadPrintData();
    }, [height])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true);
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader/>
    }



    const webViewScript = `window.ReactNativeWebView.postMessage(document.body.scrollHeight);
  true; // note: this is required, or you'll sometimes get silent failures
`;

    const onProductDetailsWebViewMessage = (event: any) => {
        setHeight(Number(event.nativeEvent.data))
    }

    const {webviewwidth} = printer


    if (!height) {
        return <View style={[styles.h_100,   styles.middle,{backgroundColor:styles.light.color}]}>

            <View style={[styles.h_100, {width: webviewwidth}]}>

                <WebView
                    source={{html: data}}
                    automaticallyAdjustContentInsets={false}
                    scalesPageToFit={true}
                    scrollEnabled={false}
                    javaScriptEnabled={true}
                    onMessage={onProductDetailsWebViewMessage}
                    injectedJavaScript={webViewScript}
                />

                <View  style={[styles.loader,styles.bg_light]}>
                    {<View  style={[styles.screenCenter,styles.h_100,styles.transparent]}>
                        <View style={{borderRadius:50}}>
                            <ActivityIndicator style={styles.m_1} color={'#016EFE'} size='large' animating={true}/>
                        </View>
                    </View> }
                </View>


            </View>

        </View>
    }


    return (
        <View style={[styles.h_100, styles.flex,styles.w_100,  styles.middle,{backgroundColor:styles.light.color}]}>
            <ScrollView>
                <View style={[styles.h_100,styles.flex,   {width: webviewwidth, marginVertical:20,backgroundColor:'white'}]}>
                    <ZigZag></ZigZag>
                    <View style={[styles.p_5]}>
                        <ViewShot ref={ref}   options={{result: "data-uri", format: "jpg", quality: 1}}>
                            <WebView
                                source={{html: data}}
                                style={{height: height}}
                            />
                        </ViewShot>
                    </View>
                    <ZigZag position={'bottom'}></ZigZag>
                </View>
            </ScrollView>

            <View>
                <View style={[styles.submitbutton, styles.row, styles.justifyContent]}>
                    <View style={[styles.cell, styles.w_auto, styles.ml_2]}>
                        <Button more={{color: 'white'}}
                                onPress={() => {
                                    snapShot()
                                }}> Print
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    )

}


export default Index;


