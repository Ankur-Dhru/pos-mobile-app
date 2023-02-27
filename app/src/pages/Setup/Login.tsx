import React, {useEffect, useRef, useState} from "react";


import {Image, Keyboard, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
    STATUS, urls
} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import apiService from "../../libs/api-service";
import {
    appLog,
    connectToLocalServer,
    getLocalSettings,
    isEmpty,
    nextFocus,
    saveLocalSettings
} from "../../libs/function";
import KAccessoryView from "../../components/KAccessoryView";
import InputField from "../../components/InputField";


const Index = (props: any) => {

    const {navigation}: any = props;

    const [passwordVisible, setPasswordVisible]: any = useState(true)
    const [loaded, setLoaded] = useState<boolean>(false)

    let passwordRef:any = useRef()

    const initdata: any = isDevelopment ? {
        //email: 'akash@dhrusoft.com',
        //password: 'Akash@123',
        //email: 'obodogabriel29@gmail.com',
        //password: 'Podoski@12',
        email: 'ankur@dhrusoft.com',
        password: 'Dhrunet1@',
    } : {
        email: '',
        password: ''
    };


    useEffect(()=>{
        getLocalSettings('serverip').then(async (serverip: any) => {
            if (Boolean(serverip)) {
                await connectToLocalServer(serverip, navigation).then();
            }
            setLoaded(true)
        })
    },[])

    if(!loaded){
        return <></>
    }


    const handleSubmit = async (values: any) => {
        Keyboard.dismiss();
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
                localredux.authData = {...response.data, token: response.token,global_token: response.global_token}
                device.token = response.token;
                device.global_token = response.global_token;
                urls.localserver = '';
                saveLocalSettings('serverip',urls.localserver).then();
                if (!email_verified) {
                    navigation.navigate('Verification', {userdetail: response.data});
                } else {
                    navigation.navigate('Workspaces');
                }
            }

        })
    }


    return <Container   style={styles.bg_white}>


        <Form
            onSubmit={handleSubmit}
            style={[styles.middle]}
            initialValues={initdata}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>
                    <View style={[styles.middle,]}>
                        <View style={[styles.middleForm, {maxWidth: 400,}]}>


                                <View style={[styles.px_5,styles.h_100,styles.flex]}>
                                    <View style={[{marginTop: 20}]}>
                                        <Image
                                            style={[{width: 25, height: 25}]}
                                            source={require('../../assets/dhru-logo-22.png')}
                                        />
                                        <Title style={[styles.mt_5,{fontSize:30}]}>Sign In </Title>
                                        {/*<Text style={[styles.muted]}>account.dhru.com</Text>*/}
                                    </View>

                                    <View>
                                        <TouchableOpacity onPress={() => navigation.navigate('Register')}><Paragraph
                                            style={[styles.paragraph, styles.mt_5]}>New User? <Text  style={[{color: styles.primary.color}]}> Create an account </Text>
                                        </Paragraph></TouchableOpacity>
                                    </View>

                                    <View style={[styles.mt_5]}>
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





                                <View style={[styles.submitbutton,styles.mb_5]}>
                                    <Button more={{color: 'white',backgroundColor:styles.primary.color}} disable={more.invalid} secondbutton={more.invalid}
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}> Login
                                    </Button>



                                </View>


                                    <View style={[styles.bg_light,styles.p_5,styles.mt_5,{borderRadius:5,}]}>

                                        <View >

                                        <Paragraph style={{marginBottom:10}}>
                                            Connect to remote terminal, remote terminal ip address is required and both device must be in same local network.
                                        </Paragraph>

                                        <Button style={[ styles.w_auto, styles.noshadow]}
                                                more={{
                                                    backgroundColor: 'white',
                                                    borderColor:styles.primary.color,
                                                    borderWidth:1,
                                                    color: styles.primary.color,
                                                    height: 45,
                                                }} onPress={() => {
                                            navigation.navigate('LocalServer')
                                        }}
                                        >Connect To Remote Terminal</Button>

                                        </View>

                                    </View>



                                </View>





                            <KAccessoryView>


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
