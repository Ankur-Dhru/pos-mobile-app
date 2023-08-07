import * as React from 'react';
import {Card, Paragraph} from 'react-native-paper';
import {styles} from "../../theme";
import {Image, View} from "react-native";
import {base64Decode, log, shortName} from "../../libs/function";
import WebView from "react-native-webview";
import Container from "../../components/Container";

const Index = ({route}: any) => {

    const {data} = route.params;

    const html: any = `<!DOCTYPE html>
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
                     ${base64Decode(data)}
                  </body>
                </html>`;

    return (<Container>
        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>
                <View style={[styles.h_100]}>
                    <WebView
                        source={{html: html}}
                        style={[styles.h_100]}
                    />
                </View>
            </Card.Content>
        </Card>
    </Container>);

}

export default Index
