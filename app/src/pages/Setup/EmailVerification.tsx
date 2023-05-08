import React, {Component, useEffect, useState} from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";

import InputField from "../../components/InputField";
import apiService from "../../libs/api-service";
import {loginUrl, METHOD, STATUS} from "../../libs/static";
import {setAlert, setDialog} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import ChangeEmail from "./ChangeEmail";
import KAccessoryView from "../../components/KAccessoryView"
import {appLog} from "../../libs/function";
import {
    CodeField, Cursor,
    isLastFilledCell,
    MaskSymbol,
    useBlurOnFulfill,
    useClearByFocusCell
} from "react-native-confirmation-code-field";
import ResendCounting from "../../components/ResendCounting";

const Index = (props: any) => {

    const {route}: any = props;

    let initdata = {
        ...route.params.userdetail
    }

    const [email,setEmail] = useState(initdata.email)


    useEffect(()=>{
        apiService({
            method: METHOD.GET,
            action: 'verifyemail',
            other: {url: loginUrl},
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                store.dispatch(setAlert({visible: true, message: 'Code successfully send'}))
            }
        });
    },[])

    const handleSubmit = (values: any) => {

        apiService({
            method: METHOD.POST,
            action: 'verifyemail',
            other: {url: loginUrl},
            body: values,
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                const {email_verified, mobile_verified,whatsapp_number, whatsapp_verified, phone_number_verified} = initdata;
                 if (!whatsapp_verified  && Boolean(whatsapp_number)) {
                     navigation.replace('WhatsappVerification',{userdetail:initdata});
                } else {
                    navigation.navigate('AddWorkspace')
                }
            }
        });
    }

    const resendCode = () => {

        apiService({
            method: METHOD.GET,
            action: 'verifyemail',
            other: {url: loginUrl},
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                store.dispatch(setAlert({visible: true, message: 'Code successfully send'}))
            }
        });
    }

    const updateEmail = (email: any) => {
        initdata.email = email;
        setEmail(email)
    }

    const [value, setValue]:any = useState("")
    const ref = useBlurOnFulfill({value, cellCount: 6});
    const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });


    useEffect(() => {
        setTimeout(async () => {
            if (value.length === 6) {
                console.log('value',value)
            }
        }, 200)
    }, [value]);


    const renderCell = ({index, symbol, isFocused}:any) => {
        let textChild = null;

        if (symbol) {
            textChild = (
                <MaskSymbol
                    maskSymbol="*️"
                    isLastFilledCell={isLastFilledCell({index, value})}>
                    {symbol}
                </MaskSymbol>
            );
        } else if (isFocused) {
            textChild = <Cursor />;
        }

        return (
            <Text
                key={index}
                style={[styles.cellBox, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        );
    };


    const {navigation, theme: {colors}} = props;


    return (
        <Container    style={styles.bg_white}>

            <Form
                onSubmit={handleSubmit}
                initialValues={{code: ''}}>
                {props => (
                    <>

                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm, {maxWidth: 400,}]}>

                                <ScrollView>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                            <View>
                                                <Paragraph style={[styles.paragraph,styles.muted]}>Your Registered Email </Paragraph>
                                                <View style={[styles.grid, styles.middle]}>
                                                    <Paragraph>
                                                        {email} -
                                                    </Paragraph>
                                                    <TouchableOpacity onPress={() => {
                                                        store.dispatch(setDialog({
                                                            visible: true,
                                                            hidecancel: true,
                                                            width: 360,
                                                            component: () => <ChangeEmail updateEmail={updateEmail}/>
                                                        }))
                                                    }}>
                                                        <Text style={[{color: colors.accent}]}> Change Email </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>


                                            <View style={[styles.flex,styles.middle]}>
                                                <CodeField
                                                    ref={ref}

                                                    value={value}
                                                    onChangeText={setValue}
                                                    cellCount={6}
                                                    autoFocus={true}
                                                    rootStyle={styles.codeFieldRoot}
                                                    keyboardType="number-pad"
                                                    textContentType="oneTimeCode"
                                                    renderCell={renderCell}
                                                />
                                            </View>

                                            <View>
                                                <ResendCounting onResendOTP={resendCode}/>
                                            </View>



                                        </Card.Content>
                                    </Card>

                                </ScrollView>

                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button

                                                onPress={() => {
                                                    if(Boolean(value.length === 6)) {
                                                        props.values.code = value
                                                        handleSubmit(props.values)
                                                    }
                                                }}> Verify </Button>

                                    </View>
                                </KAccessoryView>

                            </View>
                        </View>

                    </>
                )}
            </Form>


        </Container>
    );

}


export default withTheme(Index);



