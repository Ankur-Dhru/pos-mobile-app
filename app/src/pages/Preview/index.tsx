import React, {Component, WebViewHTMLAttributes} from 'react';
import {Image, ScrollView, Text, useWindowDimensions, View,} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";


import {appLog, base64Decode, printPDF, sharePDF,} from "../../libs/function";
import {Card, Paragraph} from "react-native-paper";


import {SIZE} from "../../libs/static";
import RenderHtml from 'react-native-render-html';

var XMLParser = require('react-xml-parser');


class Preview extends Component<any> {

    params: any;
    data: any = '';
    state: any = {
        selectedPrinter: null
    }


    constructor(props: any) {
        super(props);

        this.state = {isLoading: true}

        const {route}: any = this.props;
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

    renderTemplate = (xmlData: any) => {

        appLog('new XMLParser().parseFromString(xmlData)',new XMLParser().parseFromString(xmlData))

        try {

             new XMLParser().parseFromString(xmlData)

        } catch (e: any) {
            return `Template Error : ${e?.message}`
        }


    }


    render() {
        const {navigation}: any = this.props;
        const {menu, filename}: any = this.params;


        navigation.setOptions({
            headerTitle: `Preview`,
        });


        return (
            <Container>


                <View style={[styles.middle]}>
                    <View style={[styles.middleForm, styles.h_100]}>

                        <ScrollView style={[styles.h_100, styles.flex]}>

                            <Card style={[styles.card, styles.h_100]}>
                                <Card.Content style={[styles.cardContent]}>

                                    <ScrollView>

                                        <Paragraph>Hello</Paragraph>



                                        <RenderHtml
                                            source={this.renderTemplate(base64Decode(this.params.data))}
                                        />


                                        <Paragraph>Hello</Paragraph>

                                        {/*<WebView

                                        source={{ uri: 'https://reactnative.dev/' }}
                                        automaticallyAdjustContentInsets={true}
                                    />*/}
                                    </ScrollView>

                                </Card.Content>

                            </Card>

                        </ScrollView>

                        <View>
                            <View style={[styles.submitbutton, styles.row, styles.justifyContent]}>
                                <View style={[styles.cell, styles.w_auto]}>
                                    <Text style={{textAlign: 'center'}}>
                                        <ProIcon name={'share-nodes'}
                                                 onPress={() => sharePDF({data: this.data, filename})}/>
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
                    </View>

                </View>


            </Container>
        )
    }
}


export default Preview;


