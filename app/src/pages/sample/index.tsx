import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Image, TextInput as TextInputReact, ScrollView} from 'react-native';

import {appLog, getTemplate, nextFocus, printImage} from "../../libs/function";
import {  image6000,

} from "../../libs/static";

import ViewShot from "react-native-view-shot";

global.Buffer = require('buffer').Buffer;


import InputField from "../../components/InputField";
import WebView from "react-native-webview";
import {Card, Paragraph} from "react-native-paper";
import {styles} from "../../theme";


export default function App() {

    const [cropheight,setCropHeight]:any = useState(500);

    const ref:any = useRef();

    const [source, setSource] = useState('');

    const snapShot = () => {
        ref.current.capture().then((uri:any) => {
             printImage(cropheight,uri);
             appLog("do something with ", uri);
        });
    }

    const Tags = () => {
        let h1 = '';
        for(let i=0;i<100;i++)
        {
            h1 += `<h1>Hello ${i}</h1>`
        }
        return h1
    }

    const htmldata = `<!DOCTYPE html>
                <html>
                  <head>
                    <title>Print</title>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8">   
                    <style type="text/css">
                      body {
                        margin: 0;
                        padding: 0;         
                      }
                    </style>
                  </head>
                  <body>
                  <h1>hello</h1>
                  <!--   <Tags/>-->                      
                  </body>
                </html>`;

    return (
        <View>


                    <Card style={[styles.card, styles.h_100]}>
                        <Card.Content style={[styles.h_100,styles.flex]}>
                            <ViewShot ref={ref}   options={{result: "data-uri", fileName: "voucher", format: "png", quality: 1 }} style={[styles.flex,{height:'auto'}]}>
                                <WebView
                                    source={{html: htmldata}}
                                    automaticallyAdjustContentInsets={false}
                                />
                            </ViewShot>

                            <TouchableOpacity   onPress={()=>snapShot()}>
                                <Paragraph>Crop</Paragraph>
                            </TouchableOpacity>

                        </Card.Content>
                    </Card>

                   {/* <ViewShot ref={ref}   options={{result: "data-uri", fileName: "voucher", format: "png", quality: 1 }} style={dimension}>

                        <Text>...Something to rasterize...</Text>
                    </ViewShot>*/}




        </View>
    );
}
