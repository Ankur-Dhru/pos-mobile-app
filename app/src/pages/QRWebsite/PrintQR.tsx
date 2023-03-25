import * as React from 'react';
import {useState} from 'react';

import {Container} from "../../components";
import WebView from "react-native-webview";
import {printPDF, saveServerSettings} from "../../libs/function";
import {localredux} from "../../libs/static";
import {View} from "react-native";
import {styles} from "../../theme";
import Button from "../../components/Button";

import QRCode from 'react-native-qrcode-generator';
import {useNavigation} from "@react-navigation/native";

const Index = (props: any) => {

    const params = props?.route?.params;

    let {tableid, tablename, qrcodeid, index,locationname} = params?.table || {tableid: '', tablename: '',locationname:''}
    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const navigation = useNavigation()

    const {localSettingsData}: any = localredux;
    let currentLocation = localSettingsData.currentLocation;

    const [base64, setBase64] = useState('')
    const [randomCode, setCode] = useState(qrcodeid || Math.floor(Math.random() * (999999 - 100000 + 1) + 100000))


    const url = `https://${workspace}.dhru.menu`
    let qrcode = url;

    if (Boolean(tableid)) {
        currentLocation.tables[index] = {...currentLocation.tables[index], qrcodeid: randomCode};
        qrcode = `https://dhru.menu/qrcode/${randomCode}`;
    }

    if(!tablename){
        tablename = ''
    }


    if (!Boolean(base64)) {
        return <QRCode
            value={qrcode}
            size={200}
            getImageOnLoad={(base64: any) => {
                setBase64(base64)
            }}
            bgColor='black'
            fgColor='white'/>
    }


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
                    <div style="text-align: center;padding: 20px 0">     
                    
                     <h2 style="padding: 0;margin: 0">${locationname}</h2>      
                                                       
                        <h3>Scan for menu</h3>                    
                        <img src="${base64}" />
                         <h4>${tablename}</h4> 
                         <div>${url}</div>   
                                                             
                     </div>
                  </body>
                </html>`;


    return (
        <Container>

            <View style={[styles.middle]}>
                <View style={[styles.middleForm, {maxWidth: 400}]}>

                    <View style={{height: 450}}>
                        <WebView
                            source={{html: data}}
                        />
                    </View>

                    <View>
                        <View style={[styles.submitbutton, styles.row, styles.justifyContent]}>


                            {Boolean(tableid) && <View style={[styles.cell, styles.w_auto, styles.ml_2]}>
                                <Button more={{color: 'white'}}
                                        onPress={async () => {
                                            saveServerSettings('location', [{
                                                "key": currentLocation.locationid,
                                                "value": currentLocation
                                            }]).then(() => {
                                                printPDF({data: data, filename: 'print QR'}).then(r => {
                                                    navigation.goBack()
                                                })
                                            })
                                        }}> Print
                                </Button>
                            </View>}

                            {!Boolean(tableid) && <View style={[styles.cell, styles.w_auto, styles.ml_2]}>
                                <Button more={{color: 'white'}}
                                        onPress={async () => {
                                            printPDF({data: data, filename: 'print QR'}).then(r => {
                                                navigation.goBack()
                                            })
                                        }}> Print
                                </Button>
                            </View>}


                        </View>
                    </View>


                </View>

            </View>


        </Container>
    );
}

export default Index
