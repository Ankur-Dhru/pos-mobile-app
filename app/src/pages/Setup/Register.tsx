import React, {useEffect, useState} from "react";

import {FlatList, ScrollView, TouchableOpacity, View} from "react-native";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Paragraph, Text, Title} from "react-native-paper";
import {
    ACTIONS,
    composeValidators,
    countrylist,
    device, isDevelopment,
    isEmail,
    loginUrl,
    matchPassword,
    METHOD,
    mustBeNumber,
    required,
    STATUS
} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import {appLog, isEmpty, updateComponent} from "../../libs/function";
import InputField from "../../components/InputField";
import apiService from "../../libs/api-service";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";
import PageLoader from "../../components/PageLoader";


const Register = (props: any) => {


    const {navigation}: any = props;

    const step1 = React.useRef<View>(null);
    const step2 = React.useRef<View>(null);

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
        return <PageLoader  />
    }

    const handleSubmit = async (values: any) => {
        const country:any = countrylist.find((item:any)=>{
            return item.code === values.country
        })
        values = {...values,code:country.dial_code}

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.REGISTER,
            body: values,
            other: {url: loginUrl},
        }).then(async (response: any) => {
            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                appLog('response',response)
                device.token = response.token;
                device.global_token = response.global_token;
                store.dispatch(setAlert({visible: true, message: 'Register Successful'}))
                navigation.replace('Verification',{userdetail: {...values, ...response.data}});
            }
        })
    }

    const onValidate = (values: any) => {
        let error: any = {};
        return error;
    }

    const initialValues = isDevelopment ? {
        "g-recaptcha-response": "g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj",
        "mobile_number": "8866522619",
        "first_name": "ankur",
        "last_name": "patel",
        "company_name": "",
        "country":'IN',
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
        "g-recaptcha-response": "g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj",
        "mobile_number": "",
        "first_name": "",
        "last_name": "",
        "company_name": "",
        "country":'IN',
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


    return <Container  hideappbar={true}>

        <ScrollView>

            <View style={[styles.center, styles.h_100, styles.middle]}>

                <View style={{width: 360}}>

                    <Title style={[styles.mt_5]}>Create an account </Title>


                    <Form
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validate={onValidate}
                        render={({handleSubmit, submitting, values, ...more}: any) => (
                            <>


                                <View>
                                    <View>


                                        <View>

                                        <View ref={step1} style={[styles.mt_3]}>

                                            <View style={[styles.mb_5]}>
                                                <Field name="email" validate={composeValidators(required,isEmail)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Email Address'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View style={[styles.mb_5]}>
                                                <Field name="password" validate={composeValidators(required)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Password'}
                                                            secureTextEntry={true}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>


                                            <View style={[styles.mb_5]}>
                                                <Field name="cpassword"
                                                       validate={composeValidators(required)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Confirm Password'}
                                                            secureTextEntry={true}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>


                                            {/*<View>
                                                <Button  disable={more.invalid} secondbutton={more.invalid}
                                                         onPress={() => {
                                                             updateComponent(step2,'display','flex')
                                                             updateComponent(step1,'display','none')

                                                         }}> Next
                                                </Button>
                                            </View>

                                            <View style={[styles.middle, {marginBottom: 30}]}>
                                                <TouchableOpacity onPress={() => navigation.replace('Login')}><Paragraph
                                                    style={[styles.paragraph, styles.mt_5]}>Already have an account? <Text
                                                    style={[{color: styles.primary.color}]}> Sign In </Text>
                                                </Paragraph></TouchableOpacity>
                                            </View>*/}

                                        </View>



                                        <View ref={step2} >
                                            <View style={[styles.mb_5]}>
                                                <Field name="country">
                                                    {props => (
                                                        <InputField
                                                            label={'Select Country'}
                                                            mode={'flat'}
                                                            list={countrylist.map((item) => {
                                                                return {label: item.name, value: item.code}
                                                            })}
                                                            value={props.input.value}
                                                            selectedValue={props.input.value}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            listtype={'other'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}>
                                                        </InputField>
                                                    )}
                                                </Field>
                                            </View>


                                            <View style={[styles.grid]}>
                                                <View style={[styles.mb_5,styles.w_auto]}>
                                                    <Field name="first_name" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputBox
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'First Name'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                <View style={[styles.mb_5,styles.w_auto,styles.ml_2]}>
                                                    <Field name="last_name" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputBox
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Last Name'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                            </View>

                                            <View style={[styles.grid]}>
                                                <View style={[styles.mb_5,styles.w_auto]}>
                                                <Field name="mobile_number"
                                                       validate={composeValidators(required, mustBeNumber)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            keyboardType={'number-pad'}
                                                            label={'Mobile'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                                {/*<View style={[styles.mb_5,styles.w_auto,styles.ml_2]}>
                                                    <Field name="company_name">
                                                        {props => (
                                                            <InputBox
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Company Name'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>*/}
                                            </View>

                                            {/*<View style={[styles.mb_5]}>
                                                <Field name="address1">
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Address 1'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View style={[styles.mb_5]}>
                                                <Field name="address2">
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Address 2'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>*/}

                                            {/*<View style={[styles.grid]}>
                                                <View style={[styles.mb_5,styles.w_auto]}>
                                                    <Field name="city">
                                                        {props => (
                                                            <InputBox
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'City'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View style={[styles.mb_5,styles.w_auto,styles.ml_2]}>
                                                    <Field name="postcode">
                                                        {props => (
                                                            <InputBox
                                                                {...props}
                                                                value={props.input.value}
                                                                keyboardType={'number-pad'}
                                                                label={'Pin Code'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                            </View>*/}

                                            {/*<View style={[styles.mb_5]}>
                                                <Field name="state">
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'State'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>*/}


                                            <View style={[styles.grid,styles.justifyContent,styles.mb_5]}>
                                                {/*<View style={[styles.w_auto]}>
                                                    <Button
                                                        more={{backgroundColor:styles.accent.color}}
                                                             onPress={() => {
                                                                 updateComponent(step2,'display','none')
                                                                 updateComponent(step1,'display','flex')
                                                             }}> Previous
                                                    </Button>
                                                </View>*/}
                                                <View style={[styles.w_auto,]}>
                                                    <Button  disable={more.invalid} secondbutton={more.invalid}
                                                             more={{backgroundColor:styles.primary.color}}
                                                             onPress={() => {
                                                                 handleSubmit(values)
                                                             }}> Continue
                                                    </Button>
                                                </View>
                                            </View>


                                            <View style={[styles.middle, {marginBottom: 30}]}>
                                                <TouchableOpacity onPress={() => navigation.replace('Login')}><Paragraph
                                                    style={[styles.paragraph, styles.mt_5]}>Already have an account? <Text
                                                    style={[{color: styles.primary.color}]}> Sign In </Text>
                                                </Paragraph></TouchableOpacity>
                                            </View>

                                        </View>


                                        </View>


                                    </View>
                                </View>








                            </>
                        )}
                    >

                    </Form>


                </View>

            </View>
        </ScrollView>

    </Container>
}

export default Register;
