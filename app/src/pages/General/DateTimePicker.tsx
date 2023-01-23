import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {appLog, filterArray, getType} from "../../libs/function";
import {Divider, List, Paragraph, withTheme} from "react-native-paper";

import {styles as theme, styles} from "../../theme";


import Search from "../../components/SearchBox"
import {device, ItemDivider} from "../../libs/static";
import Avatar from "../../components/Avatar/PhoneAvatar";
import ProIcon from "../../components/ProIcon";
import Button from "../../components/Button";
import Container from "../../components/Container";
import KAccessoryView from '../../components/KAccessoryView';
import moment from "moment/moment";
import DateTimePicker from "../../components/InputField/DateTimePicker";

const Index = (props: any) => {

    const {navigation, route}: any = props;

    const {
        dueterm,
        defaultValue,
        mode,
        onSelect,
        label,
    }: any = route?.params || {};

    const [value,setValue]:any = useState()



    const onChange = (value:any) => {
        setValue(value)
    }

    navigation.setOptions({
        headerTitle:label
    })


    return (

        <Container   style={styles.bg_white}>

            <View style={[styles.h_100,styles.flex]}>
                <DateTimePicker
                    label={label}
                    dueterm={dueterm}
                    defaultValue={moment(value).format('YYYY-MM-DD')}
                    mode={mode}
                    onSelect={onChange}
                />
            </View>

            <KAccessoryView>
                <View style={[styles.grid,styles.justifyContent,styles.mb_5]}>
                    <View style={[styles.w_auto]}>
                        <Button more={{backgroundColor:styles.light.color,color:'black'}} onPress={() => {navigation.goBack(); }}> Cancel </Button>
                    </View>
                    <View  style={[styles.w_auto,styles.ml_2]}>
                        <Button onPress={() => { onSelect(value); navigation.goBack(); }}> OK </Button>
                    </View>
                </View>
            </KAccessoryView>

        </Container>
    );

}


export default (withTheme(Index));




