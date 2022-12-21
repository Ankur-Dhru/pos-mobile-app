import React, {useRef, useState} from "react";


import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Paragraph, TextInput as TI, Title,} from "react-native-paper";
import {styles} from "../../theme";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {
    ACTIONS,
    composeValidators,
    device,
    grecaptcharesponse,
    isDevelopment,
    isEmail,
    localredux,
    loginUrl,
    METHOD,
    required,
    STATUS
} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import apiService from "../../libs/api-service";
import {appLog, isEmpty, nextFocus} from "../../libs/function";
import KAccessoryView from "../../components/KAccessoryView";
import InputField from "../../components/InputField";


const Index = (props: any) => {

    const {navigation}: any = props;

    const [passwordVisible, setPasswordVisible]: any = useState(true)

    let passwordRef:any = useRef()

    const initdata: any = isDevelopment ? {
        //email: 'akash@dhrusoft.com',
        //password: 'Akash@123',
        email: 'dhru360@yahoo.com',
        password: 'dhru@9090',
    } : {
        email: '',
        password: ''
    };
    const handleSubmit = async (values: any) => {

        values = {
            ...values,
            deviceid: 'asdfadsf',
            "g-recaptcha-response": grecaptcharesponse
        }
        await apiService({
            method: METHOD.POST,
            action: ACTIONS.LOGIN,
            other: {url: loginUrl},
            body: values
        }).then((response: any) => {


            const {email_verified, mobile_verified, whatsapp_verified, phone_number_verified} = response.data;

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                localredux.licenseData = {...values, ...response.data}
                localredux.authData = {...response.data, token: response.token}
                device.token = response.token;
                if (!email_verified) {
                    navigation.navigate('Verification', {userdetail: response.data});
                } else {
                    navigation.navigate('Workspaces');
                }
            }
        })
    }


    return <Container style={{backgroundColor:'white'}}>


        <Form
            onSubmit={handleSubmit}
            style={[styles.middle]}
            initialValues={initdata}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>
                    <View style={[styles.middle,]}>
                        <View style={[styles.middleForm, {maxWidth: 400,}]}>

                            <ScrollView>

                                <View style={[styles.px_5]}>
                                    <View style={[styles.middle, {marginBottom: 30, marginTop: 30}]}>
                                        <Image
                                            style={[{width: 70, height: 70}]}
                                            source={require('../../assets/dhru-logo-22.png')}
                                        />
                                        <Title style={[styles.mt_5]}>Login with email </Title>
                                        <Text style={[styles.muted]}>account.dhru.com</Text>
                                    </View>

                                    <View style={[styles.py_5]}>
                                        <View>
                                            <Field name="email" validate={composeValidators(required, isEmail)}>
                                                {props => (

                                                    <InputField
                                                        {...props}
                                                        value={props.input.value}
                                                        returnKeyType={'next'}
                                                        onSubmitEditing={()=> nextFocus(passwordRef)}
                                                        label={'Email Address'}
                                                        inputtype={'textbox'}
                                                        keyboardType='email-address'
                                                        onChange={props.input.onChange}
                                                    />


                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="password" validate={required}>
                                                {props => (

                                                    <>

                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Password'}
                                                            inputtype={'textbox'}
                                                            onSubmitEditing={(e: any) => {
                                                                handleSubmit(values)
                                                            }}
                                                            right={<TI.Icon name={passwordVisible ? "eye" : "eye-off"} onPress={() => setPasswordVisible(!passwordVisible)}/>}
                                                            returnKeyType={'go'}
                                                            secureTextEntry={passwordVisible}
                                                            onChange={props.input.onChange}

                                                        />

                                                    </>



                                                )}
                                            </Field>
                                        </View>


                                    </View>

                                    <View style={[styles.middle, styles.mt_5, {marginBottom: 20}]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Register')}><Paragraph
                                            style={[styles.paragraph, styles.mt_5]}>New User? <Text  style={[{color: styles.primary.color}]}> Create an account </Text>
                                        </Paragraph></TouchableOpacity>
                                    </View>
                                </View>

                            </ScrollView>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button more={{color: 'white'}} disable={more.invalid} secondbutton={more.invalid}
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

export default Index;
