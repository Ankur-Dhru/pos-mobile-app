import React, {useEffect, useRef, useState} from "react";

import {ScrollView, TouchableOpacity, View} from "react-native";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Card, Paragraph, Text, TextInput as TI, Title} from "react-native-paper";
import {
    ACTIONS,
    composeValidators,
    countrylist,
    device, grecaptcharesponse,
    isDevelopment,
    isEmail,
    isValidPassword,
    loginUrl,
    matchPassword,
    METHOD,
    mustBeNumber,
    required,
    STATUS
} from "../../libs/static";
import Button from "../../components/Button";
import {appLog, isEmpty, nextFocus} from "../../libs/function";
import InputField from "../../components/InputField";
import apiService from "../../libs/api-service";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";
import PageLoader from "../../components/PageLoader";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";


const Register = (props: any) => {


    const {navigation}: any = props;

    const step1 = React.useRef<View>(null);
    const step2 = React.useRef<View>(null);

    let inputRef = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];

    const [passwordVisible, setPasswordVisible]: any = useState(true)
    const [cpasswordVisible, setCPasswordVisible]: any = useState(true)

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

    const handleSubmit = async (values: any) => {
        const country: any = countrylist.find((item: any) => {
            return item.code === values.country
        })
        values = {...values, code: country.dial_code}

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.REGISTER,
            body: values,
            other: {url: loginUrl},
        }).then(async (response: any) => {
            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                appLog('response', response)
                device.token = response.token;
                device.global_token = response.global_token;
                store.dispatch(setAlert({visible: true, message: 'Register Successful'}))
                navigation.replace('Verification', {userdetail: {...values, ...response.data}});
            }
        })
    }




    const initialValues = isDevelopment ? {
        deviceid:'asdfadsf',
        "g-recaptcha-response": grecaptcharesponse,
        "mobile_number": "8866522619",
        "first_name": "ankur",
        "last_name": "patel",
        "company_name": "",
        "country": 'IN',
        "address1": "4th Floor, Orange Pole, 80 feet road",
        "address2": "Near Siddhivinayak Temple",
        "city": "Anand",
        "state": "Gujarat",
        "postcode": "388001",
        "email": "ankur9090_11@dhrusoft.com",
        "password": "Dhrunet1@",
        "cpassword": "Dhrunet1@",
        "code": "91",

    } : {
        deviceid:'asdfadsf',
        "g-recaptcha-response": grecaptcharesponse,
        "mobile_number": "",
        "first_name": "",
        "last_name": "",
        "company_name": "",
        "country": 'IN',
        "address1": "",
        "address2": "",
        "city": "",
        "state": "",
        "postcode": "",
        "email": "",
        "password": "",
        "cpassword": "",
        "code": "91",
    }


    return <Container hideappbar={true}>

        <Form
            onSubmit={handleSubmit}
            initialValues={initialValues}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.middle,]}>
                    <View style={[styles.middleForm]}>
                        <KeyboardScroll>

                            <View>

                                <View>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                    <View>
                                        <Field name="email" validate={composeValidators(required, isEmail)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    returnKeyType={'next'}
                                                    onSubmitEditing={()=> nextFocus(inputRef[0])}
                                                    label={'Email Address'}
                                                    inputtype={'textbox'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>


                                    <View>
                                        <Field  name="password"
                                               validate={composeValidators(required, isValidPassword)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    customRef={inputRef[0]}
                                                    onSubmitEditing={()=> nextFocus(inputRef[1])}
                                                    returnKeyType={'next'}
                                                    label={'Password'}
                                                    inputtype={'textbox'}
                                                    secureTextEntry={passwordVisible}
                                                    right={<TI.Icon name={passwordVisible ? "eye" : "eye-off"}
                                                                    onPress={() => setPasswordVisible(!passwordVisible)}/>}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="cpassword"
                                               validate={composeValidators(required, matchPassword(values.password))}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    customRef={inputRef[1]}
                                                    onSubmitEditing={()=> nextFocus(inputRef[2])}
                                                    returnKeyType={'next'}
                                                    label={'Confirm Password'}
                                                    inputtype={'textbox'}

                                                    secureTextEntry={cpasswordVisible}
                                                    right={<TI.Icon name={cpasswordVisible ? "eye" : "eye-off"}
                                                                    onPress={() => setCPasswordVisible(!cpasswordVisible)}/>}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                        </Card.Content>

                                    </Card>


                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                    <View>
                                        <Field name="country" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Country'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Country"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={countrylist.map((item) => {
                                                        return {label: item.name, value: item.code}
                                                    })}
                                                    onChange={(value: any) => {
                                                        const country: any = countrylist.find((item: any) => {
                                                            return item.code === value
                                                        })
                                                        values.code = country.dial_code;
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>


                                    <View>
                                        <Field name="first_name" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'First Name'}
                                                    returnKeyType={'next'}
                                                    customRef={inputRef[2]}
                                                    onSubmitEditing={()=> nextFocus(inputRef[3])}
                                                    inputtype={'textbox'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="last_name" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    returnKeyType={'next'}
                                                    customRef={inputRef[3]}
                                                    onSubmitEditing={()=> nextFocus(inputRef[4])}
                                                    label={'Last Name'}
                                                    inputtype={'textbox'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View style={[styles.mt_5]}>
                                        <View>
                                            <Text
                                                style={[styles.text_xs, styles.muted, {marginBottom: -25}]}>Mobile</Text>
                                            <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                <View>
                                                    <InputField
                                                        {...props}

                                                        inputtype={'textbox'}
                                                        editable={false}
                                                        value={'+' + values.code}
                                                        onChange={(value: any) => {

                                                        }}
                                                    />
                                                </View>
                                                <Field name="mobile_number"
                                                       validate={composeValidators(required, mustBeNumber)}>
                                                    {props => (
                                                        <View style={[styles.w_auto, styles.ml_2]}>
                                                            <InputField
                                                                {...props}
                                                                customRef={inputRef[4]}
                                                                keyboardType={'number-pad'}
                                                                label={''}
                                                                returnKeyType={'go'}
                                                                inputtype={'textbox'}
                                                                onSubmitEditing={(e: any) => {
                                                                    handleSubmit(values)
                                                                }}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        </View>
                                                    )}
                                                </Field>
                                            </View>
                                        </View>
                                    </View>

                                        </Card.Content>

                                    </Card>

                                </View>

                                <View style={[styles.middle, {marginBottom: 30}]}>
                                    <TouchableOpacity onPress={() => navigation.replace('Login')}><Paragraph
                                        style={[styles.paragraph, styles.mt_5]}>Already have an account? <Text
                                        style={[{color: styles.primary.color}]}> Sign In </Text>
                                    </Paragraph></TouchableOpacity>
                                </View>

                            </View>


                        </KeyboardScroll>

                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid}
                                        more={{color:'white'}}
                                        onPress={() => {
                                            handleSubmit(values)
                                        }}> Continue
                                </Button>
                            </View>
                        </KAccessoryView>
                    </View>
                </View>
            )}
        >

        </Form>


    </Container>
}

export default Register;
