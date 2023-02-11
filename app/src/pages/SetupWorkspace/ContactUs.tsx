import React, {useEffect, useState} from 'react';
import {Image, Linking, SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container, ProIcon} from "../../components";
import {useDispatch} from "react-redux";
import {appLog, assignOption, base64Encode, errorAlert, isEmpty, syncData} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {ACTIONS, device, grecaptcharesponse, localredux, METHOD, required, STATUS, urls} from "../../libs/static";

import InputField from '../../components/InputField';

import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";

import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {Caption, Card, List, Paragraph} from "react-native-paper";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";


const Index = (props: any) => {

    const navigation = useNavigation()

    const initdata: any = {"name":"","email":"","subject":"","text":"","g-recaptcha-response":grecaptcharesponse}
    const [message,setMessage] = useState();


    const handleSubmit = async (values: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        values = {
            ...values,
            subject:base64Encode(values.subject),
            text:base64Encode(values.text)
        }

        apiService({
            method: METHOD.POST,
            action: 'contactus',
            token: token,
            other: {url: 'https://api.dhru.com/client/api/v1/'},
            body: values,
        }).then((result) => {

            if (result.status === STATUS.SUCCESS) {
                setMessage(result?.message)
            }
            else{
                errorAlert(result?.message)
            }
        });

    }



    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader/>
    }

    if(Boolean(message)){
        return <Container><View style={[styles.center, styles.h_100, styles.middle,styles.p_5]}>
             <Paragraph style={[styles.green]}>{message}</Paragraph>
        </View></Container>
    }


    return (
        <Container style={styles.bg_white}>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm,{maxWidth:400}]}>
                                <ScrollView>


                                    <Card style={[styles.card,styles.bg_light,{marginHorizontal:10}]}>
                                        <Card.Content style={[styles.cardContent,{paddingVertical: 0,paddingHorizontal: 0}]}>
                                            <List.Item
                                                style={[styles.listitem]}
                                                title="+91 88993 88993"
                                                onPress={() => {
                                                    Linking.openURL('whatsapp://send?text=hi&phone=918899388993').then()
                                                }}
                                                left={() => <List.Icon icon="whatsapp"/>}
                                                right={() => <List.Icon icon="chevron-right"/>}
                                            />
                                        </Card.Content>
                                    </Card>

                                    <Card style={[styles.card]}>

                                        <Card.Content style={[styles.cardContent]}>







                                            <View style={[styles.mt_5]}>

                                                <Caption style={[styles.caption]}>Get in touche with us</Caption>

                                                <Field name="name" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Full Name'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="email" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Email'}
                                                            keyboardType='email-address'
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="subject"  validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Subject'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>



                                                <Field name="text"  validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            multiline={true}
                                                            label={'Message'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>


                                            </View>

                                        </Card.Content>

                                    </Card>
                                </ScrollView>

                                <KAccessoryView>

                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Send </Button>
                                    </View>

                                </KAccessoryView>
                            </View>
                        </View>
                    )}
                >

                </Form>
            </SafeAreaView>
        </Container>

    )

}


export default Index;


