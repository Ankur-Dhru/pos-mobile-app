import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Caption, Card, Paragraph} from "react-native-paper";

import {Button, Container, InputBox} from "../../components";
import {Field, Form} from 'react-final-form';


import {composeValidators, ItemDivider, required,} from "../../libs/static";

import KAccessoryView from "../../components/KAccessoryView";
import {appLog, chevronRight, connectToLocalServer, getLocalSettings} from "../../libs/function";
import {useNavigation} from "@react-navigation/native";

export default function LocalServer(props: any) {
    const navigation = useNavigation();

    const [serverip, setServerip] = useState()
    let [servers,setServers]:any = useState()

    const handleSubmit = (values: any) => {
        Keyboard.dismiss();
        const {serverip}: any = values;
        connectToLocalServer(serverip, navigation).then();
    }

    useEffect(()=>{
        getLocalSettings('recentserverips').then((ips:any)=>{
            setServers(ips);
        })
    },[])

    const renderitems = ({item}: any) => {

        return (
            <TouchableOpacity onPress={() => connectToLocalServer(item, navigation).then()} style={[{paddingHorizontal: 5}]}>

                <View style={[styles.grid, styles.justifyContent, styles.py_5]}>
                    <View><Paragraph style={[styles.paragraph, styles.text_md]}>{item}</Paragraph></View>
                    <View>
                        {chevronRight}
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    return (
        <Container    style={styles.bg_white}>
            <Form
                onSubmit={handleSubmit}
                initialValues={{serverip: serverip}}
                render={({handleSubmit, submitting, values, ...more}: any) => (

                    <>
                        <View style={[styles.middle,]}>
                            <View style={[styles.middleForm,{maxWidth:400}]}>

                                <ScrollView>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                            <View style={[styles.grid,styles.justifyContent,styles.middle]}>

                                            <View style={[styles.w_auto]}>

                                                <Field name="serverip"
                                                       validate={composeValidators(required)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Remote Terminal IP'}
                                                            autoFocus={false}
                                                            keyboardType={'numeric'}
                                                            autoCapitalize='none'
                                                            onSubmitEditing={(e:any) => {
                                                                handleSubmit(values)
                                                            }}
                                                            returnKeyType={'go'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>

                                            </View>

                                            <View style={[styles.ml_2]}>
                                                <Button more={{color: 'white',height:43,marginTop:5}} disable={more.invalid}
                                                        secondbutton={more.invalid} onPress={() => {
                                                    handleSubmit(values)
                                                }}>Connect</Button>
                                            </View>

                                            </View>

                                            <View style={[styles.mt_5]}>
                                                <Paragraph style={[styles.muted,]}>
                                                   Connect to remote terminal, remote terminal ip address is required and both device must be in same local network.
                                                </Paragraph>
                                            </View>

                                        </Card.Content>
                                    </Card>


                                    {Boolean(servers) &&   <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                            <Caption style={[styles.caption]}>Recently Used</Caption>

                                            <FlatList
                                                data={Object.values(servers)}
                                                keyboardDismissMode={'on-drag'}
                                                keyboardShouldPersistTaps={'always'}
                                                renderItem={renderitems}
                                                ItemSeparatorComponent={ItemDivider}

                                            />


                                        </Card.Content>
                                    </Card>}


                                </ScrollView>

                                {/*<KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}>Next</Button>
                                    </View>
                                </KAccessoryView>*/}

                            </View>
                        </View>


                    </>

                )}
            >

            </Form>
        </Container>
    );
}
