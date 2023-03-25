import * as React from 'react';

import {Linking, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Caption, Card, List} from "react-native-paper";
import {Field, Form} from "react-final-form";
import CheckBox from "../../components/CheckBox";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {saveServerSettings} from "../../libs/function";
import {ItemDivider, localredux} from "../../libs/static";
import {Container, ProIcon} from "../../components";
import {useNavigation} from "@react-navigation/native";


export default function App() {

    const navigation = useNavigation()

    const {workspace}: any = localredux.initData;
    const {currentLocation} = localredux.localSettingsData;
    const {locationname} = currentLocation
    const initdata = currentLocation?.order || {}

    const colors = [
        '#ef476f','#ffd166','#06d6a0','#118ab2','#073b4c',
        '#9381ff','#ffd8be',
        '#003049','#d62828','#f77f00','#fcbf49','#eae2b7',
        '#8e9aaf','#860a70','#3a438c',
    ]

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
                    render={({handleSubmit, submitting, values,form, ...more}: any) => (
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
                                                                        navigation.navigate("PrintQR",{table:{locationname:locationname}})
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
                                                                                            navigation.navigate("PrintQR", {table: {...table,locationname,index}})
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


                                                                <Caption style={[styles.caption,styles.mt_5]}>Website Theme Color</Caption>
                                                                <View style={[styles.grid,]}>
                                                                    {
                                                                        colors.map((color:any,index:any)=>{
                                                                            return <View key={index}>
                                                                                <TouchableOpacity style={[styles.flexGrow,styles.center,styles.middle,{minWidth:60,height:60,backgroundColor:color}]} onPress={()=>{

                                                                                    form.change('themecolor',color)
                                                                                     handleSubmit(values)

                                                                                }}>
                                                                                    {values.themecolor === color &&  <ProIcon name={'check'} color={'white'}/>}
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        })
                                                                    }
                                                                </View>


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

