import React, {Component} from 'react';
import { ScrollView, Text,  View,} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";


import {appLog, base64Decode, printPDF, sharePDF,} from "../../libs/function";
import {Card, Paragraph} from "react-native-paper";


import {SIZE} from "../../libs/static";
import RenderHtml from 'react-native-render-html';
import parse, {domToReact} from 'html-react-parser';

//var XMLParser = require('react-xml-parser');


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
                     ${this.renderTemplate(base64Decode(this.params.data))}
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

    renderTemplate = (xmlData:any) => {


        /*xmlData = xmlData.replaceAll('<align','<div').replaceAll('<text','<div').replaceAll('<bold','<div');
        xmlData = xmlData.replaceAll('</align','</div').replaceAll('</text','</div').replaceAll('</bold','</div');

        appLog('xmlData',xmlData)

        return xmlData*/


        try {
            const options = {
                replace: (domNode: any) => {
                    const {name, children, attribs, nextSibling} = domNode;

                    if (name === "img" || name === "image") {
                        let srcData = nextSibling.data;
                        nextSibling.data = "";
                        return <img width={130} src={srcData}/>
                    }
                    if (name === "bold") {
                        return <b>{domToReact(children, options)}</b>
                    }
                    if (name === "text") {
                        if (attribs?.size) {
                            let sizePx: keyof typeof SIZE = attribs.size
                            let size: any = SIZE[sizePx];
                            return <div style={{fontSize: size, lineHeight: size}}>{domToReact(children, options)}</div>
                        }
                        return <div>{domToReact(children, options)}</div>
                    }
                    if (name === "align") {
                        return <div style={{textAlign: attribs?.mode || "left"}}>{domToReact(children, options)}</div>
                    }
                    return domNode
                }
            }

            appLog('parse(xmlData,options)',parse(xmlData,options))

            return parse(xmlData,options)
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
                                            source={{html:`<div style="color:black">25254345</div>`}}
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


