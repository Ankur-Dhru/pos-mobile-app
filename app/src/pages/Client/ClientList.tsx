import apiService from "../../libs/api-service";
import {ACTIONS, METHOD, STATUS} from "../../libs/static";
import React, {useState} from "react";
import {isDebug} from "../../libs/function";
import {View} from "react-native";
import {Button, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";


const Index = () => {

    const [name, setName] = useState('Helo');

    console.log('name',name)


    const test = async () => {
        apiService({
            method: METHOD.POST,
            action: "test",
            queryString:{name}
        }).then((response: any) => {

        })

    }

    return <View>
        <Paragraph style={[styles.paragraph, styles.mb_5]}>Cart</Paragraph>
    </View>
}

export default Index;
