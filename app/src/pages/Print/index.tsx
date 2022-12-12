import React, {Component} from 'react';
import {BackHandler, Text, View,} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";

import {Button, Container, ProIcon} from "../../components";


import {base64Decode, log, printPDF, sharePDF,} from "../../libs/function";

import WebView from "react-native-webview";
import {CommonActions} from '@react-navigation/native';
import {Card, Title, withTheme} from "react-native-paper";


class Preview extends Component<any> {

    params: any;
    data: any = '';
    state: any = {
        selectedPrinter: null
    }

    constructor(props: any) {
        super(props);
        const {route}: any = this.props;
        this.state = {isLoading: true}
        this.params = route.params;

        this.data = `<!DOCTYPE html>
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
                     ${base64Decode(this.params.data)}
                  </body>
                </html>`;

        this.loadPrintData();

    }


    loadPrintData = () => {
        const {filename, autoprint}: any = this.params
        if (autoprint) {
            printPDF({data: this.data, filename}).then()
        }
    }


    render() {
        const {navigation, theme: {colors}}: any = this.props;
        const {menu, filename}: any = this.params;


        navigation.setOptions({
            headerTitle: `Preview`,
        });


        return (
            <Container>

                <View style={[styles.pageContent]}>
                    <Card style={[styles.card, styles.h_100]}>
                        <Card.Content style={[styles.h_100]}>
                            <WebView
                                source={{html: this.data}}
                                automaticallyAdjustContentInsets={true}
                            />
                        </Card.Content>
                    </Card>
                </View>


                <View style={[styles.absolute, {bottom: 5, zIndex: 1, left: 0, right: 0}]}>
                    <View style={[styles.mb_5, styles.px_6, styles.row, styles.justifyContent, {paddingBottom: 5}]}>
                        <View style={[styles.cell, styles.w_auto]}>
                            <Text style={{textAlign: 'center'}}>
                                <ProIcon name={'share-nodes'} onPress={() => sharePDF({data: this.data, filename})}/>
                            </Text>
                        </View>
                        <View style={[styles.cell, styles.w_auto]}>
                            <Text style={{textAlign: 'center'}}>
                                <ProIcon name={'print'} onPress={() => printPDF({data: this.data, filename})}/>
                            </Text>
                        </View>
                        <View style={[styles.cell, styles.w_auto]}>
                            <Text style={{textAlign: 'center'}}>
                                <ProIcon name={'download'} onPress={() => this.params.downloadPDF()}/>
                            </Text>
                        </View>

                    </View>
                </View>
            </Container>
        )
    }
}




export default  Preview;


