import React, {useEffect, useState} from "react";


import {Image, Linking, Text, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Title,TextInput as TI,} from "react-native-paper";
import {styles} from "../../theme";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {
    ACTIONS, APP_NAME,
    composeValidators,
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

const Index = (props: any) => {

    const {navigation}: any = props;

    const [passwordVisible,setPasswordVisible]:any = useState(true)

    const initdata: any = isDevelopment ? {
        email: 'ankur9090_103@dhrusoft.com',
        password: 'Dhrunet1@',
        //email: 'dhru360@yahoo.com',
        //password: 'dhru@9090',
    } : {
        email: '',
        password: ''
    };
    const handleSubmit = async (values: any) => {

        values = {
            ...values,
            "g-recaptcha-response": "g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj"
        }
        await apiService({
            method: METHOD.POST,
            action: ACTIONS.LOGIN,
            other: {url: loginUrl},
            body: values
        }).then((response: any) => {

            const {email_verified,mobile_verified,whatsapp_verified,phone_number_verified} = response.data;

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                localredux.authData = {...response.data, token: response.token}
                if(!email_verified){
                    navigation.replace('Verification',{userdetail: response.data});
                }
                else {
                    navigation.navigate('Workspaces');
                }
            }
        })
    }

    return  <Container  hideappbar={true}>



        <Card>



            <View style={[styles.center, styles.h_100, styles.middle]}>



                <View style={{width:350}}>
                <Form
                    onSubmit={handleSubmit}

                    initialValues={initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (


                        <View>

                            <View>

                                <View style={[styles.middle, {marginBottom: 30}]}>
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
                                                    right={<TI.Icon name={passwordVisible ? "eye" : "eye-off"}
                                                                    onPress={() =>  setPasswordVisible(!passwordVisible)}/>}
                                                    returnKeyType={'go'}
                                                    autoCapitalize='none'
                                                    secureTextEntry={passwordVisible}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>


                                </View>



                            </View>

                            <View>
                                <Button disable={more.invalid} secondbutton={more.invalid}
                                        onPress={() => {
                                            handleSubmit(values)
                                        }}> Login
                                </Button>
                            </View>

                            <View style={[styles.middle,styles.mt_5, {marginBottom: 30}]}>
                                <TouchableOpacity onPress={()=> navigation.navigate('Register') }><Paragraph style={[styles.paragraph,styles.mt_5]}>New User? <Text style={[{color:styles.primary.color}]}> Create an account </Text> </Paragraph></TouchableOpacity>
                            </View>


                        </View>

                    )}
                >

                </Form>
                </View>

            </View>



        </Card>



    </Container>

}

export default  Index;
