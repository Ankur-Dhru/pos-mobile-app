import React, {useEffect, useState} from "react";


import {Image, Linking, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Title,TextInput as TI,} from "react-native-paper";
import {styles} from "../../theme";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {
    ACTIONS, APP_NAME,
    composeValidators, device, grecaptcharesponse,
    isDevelopment,
    isEmail, localredux,
    loginUrl,
    METHOD,
    required,
    STATUS
} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import apiService from "../../libs/api-service";
import {appLog, isEmpty} from "../../libs/function";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";


const Index = (props: any) => {

    const {navigation}: any = props;

    const [passwordVisible,setPasswordVisible]:any = useState(true)

    const initdata: any = isDevelopment ? {
        //email: 'ankur9090_132@dhrusoft.com',
        //password: 'Dhrunet1@',
        email: 'dhru360@yahoo.com',
        password: 'dhru@9090',
    } : {
        email: '',
        password: ''
    };
    const handleSubmit = async (values: any) => {

        values = {
            ...values,
            "g-recaptcha-response": grecaptcharesponse
        }
        await apiService({
            method: METHOD.POST,
            action: ACTIONS.LOGIN,
            other: {url: loginUrl},
            body: values
        }).then((response: any) => {


            const {email_verified,mobile_verified,whatsapp_verified,phone_number_verified} = response.data;

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                localredux.licenseData = {...values,...response.data}
                localredux.authData = {...response.data, token: response.token}
                device.token = response.token;
                if(!email_verified){
                    navigation.replace('Verification',{userdetail: response.data});
                }
                else {
                    navigation.replace('Workspaces');
                }
            }
        })
    }

    return  <Container>


        <Form
            onSubmit={handleSubmit}
            style={[styles.middle]}
            initialValues={initdata}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>
                <View style={[styles.middle,]}>
                    <View style={[styles.middleForm,{maxWidth:380,}]}>

                    <ScrollView>

                        <View style={[styles.px_6]}>
                            <View style={[styles.middle, {marginBottom: 30,marginTop:30}]}>
                                <Image
                                    style={[{width: 70, height: 70}]}
                                    source={require('../../assets/dhru-logo-22.png')}
                                />
                                <Title style={[styles.mt_5]}>Login with email </Title>
                                <Text style={[styles.muted]}>account.dhru.com</Text>
                            </View>

                            <View style={[styles.py_5]}>
                                <View style={[styles.mb_5]}>
                                    <Field name="email" validate={composeValidators(required, isEmail)}>
                                        {props => (
                                            <InputBox
                                                {...props}
                                                value={props.input.value}
                                                label={'Email'}
                                                autoFocus={false}
                                                autoCapitalize='none'
                                                keyboardType='email-address'
                                                onChange={props.input.onChange}
                                            />
                                        )}
                                    </Field>
                                </View>

                                <View>
                                    <Field name="password" validate={required}>
                                        {props => (
                                            <InputBox
                                                value={props.input.value}
                                                label={'Password'}
                                                onSubmitEditing={(e: any) => {
                                                    handleSubmit(values)
                                                }}
                                                right={<TI.Icon name={passwordVisible ? "eye" : "eye-off"}  onPress={() =>  setPasswordVisible(!passwordVisible)}/>}
                                                returnKeyType={'go'}
                                                autoCapitalize='none'
                                                secureTextEntry={passwordVisible}
                                                onChange={props.input.onChange}
                                            />
                                        )}
                                    </Field>
                                </View>


                            </View>

                            <View style={[styles.middle,styles.mt_5, {marginBottom: 20}]}>
                                <TouchableOpacity onPress={()=> navigation.navigate('Register') }><Paragraph style={[styles.paragraph,styles.mt_5]}>New User? <Text style={[{color:styles.primary.color}]}> Create an account </Text> </Paragraph></TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>

                    <KAccessoryView>
                        <View style={[styles.submitbutton,styles.mb_5]}>
                            <Button more={{color:'white'}} disable={more.invalid} secondbutton={more.invalid}
                                    onPress={() => {
                                        handleSubmit(values)
                                    }}> Login
                            </Button>
                        </View>

                    </KAccessoryView>

                    </View>

                </View>

                </>

            )}
        >

        </Form>

    </Container>

}

export default  Index;
