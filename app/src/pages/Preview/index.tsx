import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, Text, PixelRatio, View, Image, SafeAreaView, Alert} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";


import {appLog, base64Decode, captureImages, errorAlert, printPDF, sharePDF,} from "../../libs/function";
import ViewShot from "react-native-view-shot";
import PageLoader from "../../components/PageLoader";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";
import {sendDataToPrinter} from "../../libs/Network";
import {device} from "../../libs/static";
import WebView from "react-native-webview";
import Button from "../../components/Button";

import RenderHtml from 'react-native-render-html';
import {Paragraph} from "react-native-paper";

global.Buffer = require('buffer').Buffer;


const Index = ({navigation, route}: any) => {

    const params = route.params;
    const ref: any = useRef();
    const scrollviewRef:any = useRef();
    const {menu, filename, printer}: any = params;


    const [loaded, setLoaded] = useState<boolean>(false)
    const [height,setHeight] = useState(0);
    const [images,setImages] = useState([])

    const data = `<!DOCTYPE html>
                <html>
                  <head>
                    <title>Print</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">   
                    <style type="text/css">
                      body {
                        margin: 0;
                        padding: 0; 
                        width:80mm
                      }
                      @media (-webkit-device-pixel-ratio: 1){ 
                        @viewport {                            
                             width:100%;
                        }
                      }
                    </style> 
                  </head>
                  <body>                     
                     ${base64Decode(device.printpreview)}
                     <div><div>Powered By Dhru ERP</div><br/></div>
                  </body>
                </html>`;

    const snapShot = () => {
        const {printer}: any = params;

        const isSunmi = (printer?.printertype === 'sunmi')

        try {
            ref.current.capture().then(async (uri: any) => {

                isSunmi && await SunmiPrinter.printerInit();

                await captureImages(500, uri).then(async (images: any) => {

                    //setImages(images)

                    for (let key in images) {
                        const {base64result, width}: any = images[key];
                        if (isSunmi) {
                            await SunmiPrinter.printBitmap(base64result, width)
                        } else {
                            //await sendDataToPrinter('', '', printer, Buffer.from('data:image/png;base64,' + base64result, 'base64'))
                        }
                    }
                    if (isSunmi) {
                        await SunmiPrinter.lineWrap(3)
                        await SunmiPrinter.cutPaper()
                    }



                });

            });
        } catch (e) {
            appLog('e', e)
        }
    }


    const loadPrintData = () => {
        const {filename, autoprint, printer}: any = params
        if (autoprint) {
            if(height) {
                appLog('take auto shot')
                setTimeout(async () => {
                    await snapShot()
                    setTimeout(() => {
                        navigation.goBack()
                    })
                },500)
            }
            //printPDF({data: data, filename}).then()
        }
    }

    useEffect(()=>{
        loadPrintData();
    },[height])


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


    /*navigation.setOptions({
        headerRight:()=>{
            return (
                <ProIcon name={'print'} onPress={() =>
                    snapShot()
                }/>
            )
        }
    })*/

    const webViewScript = `window.ReactNativeWebView.postMessage(document.body.scrollHeight);
  true; // note: this is required, or you'll sometimes get silent failures
`;

    const onProductDetailsWebViewMessage = (event:any) => {
        setHeight(Number(event.nativeEvent.data) + ((Number(event.nativeEvent.data) * 2 / 100)))
    }

    /*return    <WebView
        source={{html: data}}
        automaticallyAdjustContentInsets={true}
        scrollEnabled={false}
        javaScriptEnabled={true}
        onMessage={onProductDetailsWebViewMessage}
        domStorageEnabled={true}
        injectedJavaScript={webViewScript}
    />*/



    if(!height) {
        return  <WebView
            source={{html: data}}
            scalesPageToFit={true}
            mixedContentMode="always"
            automaticallyAdjustContentInsets={false}
            scrollEnabled={false}
            javaScriptEnabled={true}
            onMessage={onProductDetailsWebViewMessage}
            injectedJavaScript={webViewScript}
        />
    }



    return (
        <View style={[styles.h_100,styles.flex,styles.bg_white]}>

            <ScrollView  contentContainerStyle={[styles.px_6]}>
                <ViewShot ref={ref}  style={{height:height}}   options={{result: "data-uri",   format: "png", quality: 1}}>
                    <WebView
                        source={{html: data}}
                        style={{height:height}}
                    />
                </ViewShot>
            </ScrollView>

            <View>
                <View style={[styles.submitbutton, styles.row, styles.justifyContent]}>
                    {/*<View style={[styles.cell, styles.w_auto]}>
                        <Text style={{textAlign: 'center'}}>
                            <ProIcon name={'share-nodes'}
                                     onPress={() => sharePDF({data: data, filename})}/>
                        </Text>
                    </View>*/}
                    <View style={[styles.cell, styles.w_auto,styles.ml_2]}>
                        <Button more={{color: 'white'}}
                                onPress={() => {
                                    snapShot()
                                }}> Print {height}
                        </Button>
                        {/*<Text style={{textAlign: 'center'}}>
                            <ProIcon name={'print'} onPress={() =>
                                snapShot()
                                //printPDF({data: this.data, filename})
                            }/>
                        </Text>*/}
                    </View>
                    {/*<View style={[styles.cell, styles.w_auto]}>
                        <Text style={{textAlign: 'center'}}>
                            <ProIcon name={'download'} onPress={() => params.downloadPDF()}/>
                        </Text>
                    </View>*/}
                </View>
            </View>





        </View>
    )

}


export default Index;


