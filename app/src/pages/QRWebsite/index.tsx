import * as React from 'react';

import {Linking, SafeAreaView, View} from 'react-native';
import {Caption, Card, List} from "react-native-paper";
import {Field, Form} from "react-final-form";
import CheckBox from "../../components/CheckBox";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {saveServerSettings} from "../../libs/function";
import {ItemDivider, localredux} from "../../libs/static";
import {Container} from "../../components";
import {useNavigation} from "@react-navigation/native";


export default function App() {

    const navigation = useNavigation()

    const {workspace}: any = localredux.initData;
    const {currentLocation} = localredux.localSettingsData;
    const initdata = currentLocation?.order || {}


    const handleSubmit = (values: any) => {
        currentLocation.order = values
        saveServerSettings('location', [{"key": currentLocation.locationid, "value": currentLocation}]).then()
    }


    return (
        <Container style={styles.bg_white}>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <>

                            <View style={[styles.middle,]}>
                                <View style={[styles.middleForm, {maxWidth: 400}]}>

                                    <KeyboardScroll>


                                        <View>
                                            <View>
                                                {<Card style={[styles.card]}>
                                                    <Card.Content style={[styles.cardContent]}>
                                                        <View>

                                                            {<View>
                                                                <Field name={'digitalmenu'}>
                                                                    {props => (<View><CheckBox
                                                                        value={props.input.value}
                                                                        label={'Enable Website & Digital Menu'}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value);
                                                                            handleSubmit(values)
                                                                        }}/></View>)}
                                                                </Field>
                                                            </View>}

                                                            {values.digitalmenu && <>

                                                                <List.Item
                                                                    style={[styles.listitem]}
                                                                    title={`https://${workspace}.dhru.menu`}
                                                                    onPress={() => {
                                                                        const url = `https://${workspace}.dhru.menu`;
                                                                        Linking.openURL(url)
                                                                    }}
                                                                    left={() => <List.Icon icon="web"/>}
                                                                    right={() => <List.Icon icon="chevron-right"/>}
                                                                />

                                                                <ItemDivider/>

                                                                <List.Item
                                                                    style={[styles.listitem]}
                                                                    title={`Print Digital Menu QR`}
                                                                    onPress={() => {
                                                                        navigation.navigate("PrintQR")
                                                                    }}
                                                                    left={() => <List.Icon icon="qrcode"/>}
                                                                    right={() => <List.Icon icon="chevron-right"/>}
                                                                />

                                                                <ItemDivider/>


                                                                {<View style={[{marginLeft: 15}]}>
                                                                    <Field name={'online'}>
                                                                        {props => (<View><CheckBox
                                                                            value={props.input.value}
                                                                            label={'   Enable Online Ordering'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                                handleSubmit(values)
                                                                            }}/></View>)}
                                                                    </Field>
                                                                </View>}

                                                                <ItemDivider/>

                                                                {<View>
                                                                    <Field name={'tableorder'}>
                                                                        {props => (<View><CheckBox
                                                                            value={props.input.value}
                                                                            label={'Enable Table Ordering'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                                handleSubmit(values)
                                                                            }}/></View>)}
                                                                    </Field>
                                                                </View>}


                                                                {values.tableorder && <>
                                                                    <Caption style={[styles.caption, {
                                                                        marginLeft: 15,
                                                                        marginTop: 10
                                                                    }]}>Tables </Caption>
                                                                    {
                                                                        currentLocation?.tables.map((table: any,index:any) => {
                                                                            return (
                                                                                <>
                                                                                    <List.Item
                                                                                        style={[styles.listitem]}
                                                                                        title={`${table.tablename}`}

                                                                                        onPress={() => {
                                                                                            navigation.navigate("PrintQR", {table: {...table,index}})
                                                                                        }}
                                                                                        left={() => <List.Icon
                                                                                            icon="qrcode"/>}
                                                                                        right={() => <List.Icon
                                                                                            icon="chevron-right"/>}
                                                                                    />
                                                                                    <ItemDivider/>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </>}

                                                            </>}

                                                        </View>
                                                    </Card.Content>
                                                </Card>}


                                            </View>
                                        </View>

                                    </KeyboardScroll>


                                </View>
                            </View>

                        </>
                    )}
                />
            </SafeAreaView>
        </Container>
    );
}

