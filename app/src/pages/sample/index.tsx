/*
import apiService from "../../libs/api-service";
import {ACTIONS, METHOD, STATUS} from "../../libs/static";
import React, {useState} from "react";
import {appLog, isDebug} from "../../libs/function";
import {View} from "react-native";
import {Button, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";

import { EscPos } from '@dailykit/xml-escpos-helper';


const Index = () => {

    const [name, setName] = useState('Helo');

    console.log('name',name)


    const template = `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
    <align mode="center">
      <bold>
        <text-line size="1:0">{{title}}</text-line>
      </bold>
    </align>

    {{#thankyouNote}}
    <align mode="center">
      <text-line encoding="cp864" codepage="22" size="0:0">  {{{thankyouNote}}}</text-line>
    </align>

    <line-feed />

    <paper-cut />
  </document>
`;

    appLog('template',template);

    const input = {
        title: 'Sample',
        thankyouNote: 'أهلا بك',
    };

    const options = {
        wrapWord: false, //true by default
        wrapWordMaxLength: 48, // 32 by default
    };

    const buffer = EscPos.getBufferFromTemplate(template, input, options);

    appLog('buffer',buffer)


    return <View>
        <Paragraph style={[styles.paragraph, styles.mb_5]}>Cart 123</Paragraph>
    </View>
}

export default Index;
*/
