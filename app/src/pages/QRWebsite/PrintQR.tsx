import * as React from 'react';

import {Container} from "../../components";
import WebView from "react-native-webview";
import {appLog, base64Decode, errorAlert, isEmpty, printPDF, saveServerSettings, syncData} from "../../libs/function";
import {ACTIONS, device, localredux, METHOD, STATUS, urls} from "../../libs/static";
import {ScrollView, View} from "react-native";
import {styles} from "../../theme";
import Button from "../../components/Button";
import apiService from "../../libs/api-service";

import QRCode from 'react-native-qrcode-generator';


import {useEffect, useState} from "react";
import {Paragraph} from "react-native-paper";
import KeyboardScroll from "../../components/KeyboardScroll";
import {saveSettings} from "../../libs/api-service/common";
import {useNavigation} from "@react-navigation/native";

const Index = (props: any) => {

    const params = props?.route?.params;

    const {tableid,tablename,qrcodeid,index} = params?.table || {tableid:'',tablename:''}
    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const navigation = useNavigation()

    const {localSettingsData}: any = localredux;
    let currentLocation = localSettingsData.currentLocation;

    const [base64,setBase64] = useState('')
    const [randomCode,setCode] = useState(qrcodeid || Math.floor(Math.random() * (999999 - 100000 + 1) + 100000))




    const url = `https://${workspace}.dhru.menu`
    let qrcode = url;

    if(Boolean(tableid)){
        currentLocation.tables[index] =  {...currentLocation.tables[index],qrcodeid:randomCode};
        qrcode = `${url}/qrcode/${randomCode}`;
    }


    if(!Boolean(base64)){
        return <QRCode
            value={qrcode}
            size={200}
            getImageOnLoad={(base64:any)=>{
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
                    <div style="text-align: center">          
                        <div style="padding:10px">${url}</div>                              
                        <img src="${base64}" />
                         <div  style="padding:10px">${tablename}</div>                                                
                     </div>
                  </body>
                </html>`;


    return (
        <Container>

            <View style={[styles.middle]}>
                <View style={[styles.middleForm,{maxWidth:400}]}>

                    <View style={{height:300}}>
                        <WebView
                            source={{html: data}}
                        />
                    </View>

                        <View>
                            <View style={[styles.submitbutton, styles.row, styles.justifyContent]}>


                                {Boolean(tableid) &&  <View style={[styles.cell, styles.w_auto, styles.ml_2]}>
                                    <Button more={{color: 'white'}}
                                            onPress={async () => {
                                                saveServerSettings('location', [{"key": currentLocation.locationid, "value": currentLocation}]).then(()=>{
                                                    printPDF({data:data,filename: 'print QR'}).then(r => {
                                                        navigation.goBack()
                                                    })
                                                })
                                            }}> Print
                                    </Button>
                                </View>}

                                {!Boolean(tableid) &&  <View style={[styles.cell, styles.w_auto, styles.ml_2]}>
                                    <Button more={{color: 'white'}}
                                            onPress={async () => {
                                                printPDF({data:data,filename: 'print QR'}).then(r => {
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
