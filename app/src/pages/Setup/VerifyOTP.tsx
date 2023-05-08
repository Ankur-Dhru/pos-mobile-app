import React, {Component, useEffect, useState} from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, RadioButton, Text, Title, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";

import InputField from "../../components/InputField";
import apiService from "../../libs/api-service";
import {ACTIONS, db, device, localredux, loginUrl, METHOD, STATUS, urls} from "../../libs/static";

import {setAlert, setDialog, showLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";

import KAccessoryView from "../../components/KAccessoryView"

import {onLoginDetailCheck} from "./Login";
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

    const {navigation, theme: {colors}} = props;
    const [channel, setChannel] = React.useState('email');

    const {email,whatsapp,temp_token} = route.params.userdetail;
    const initdata = route.params.logindetails;



   const  handleSubmit = (values: any) => {
        apiService({
            method: METHOD.POST,
            action: ACTIONS.LOGIN,
            other: {url: loginUrl},
            body: values,
        }).then((response) => {
            if (response.status === STATUS.SUCCESS) {
                onLoginDetailCheck(response,values,navigation)
            }
            else{
                console.log('response',response)
            }
        });
    }

    const resendCode = () => {
        apiService({
            method: METHOD.GET,
            action: ACTIONS.LOGIN,
            token:temp_token,
            queryString:{'channel':channel},
            other: {url: loginUrl},
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                store.dispatch(setAlert({visible: true, message: result.message}))
            }
        });
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


    return (
        <Container    style={styles.bg_white}>

            <Form
                onSubmit={handleSubmit}
                initialValues={initdata}>
                {props => (
                    <>

                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm, {maxWidth: 400,}]}>

                                <ScrollView>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                            <View>
                                                <Paragraph style={[styles.paragraph,styles.muted]}>OTP Required,  OTP send your registered email.</Paragraph>
                                                <View>

                                                    <RadioButton.Group onValueChange={value => setChannel(value)} value={channel}>
                                                        <RadioButton.Item label={email} status={'checked'} position={'trailing'} mode={'android'} value="email" />
                                                        {Boolean(whatsapp) &&  <RadioButton.Item label={whatsapp} position={'trailing'} mode={'android'}  value="whatsapp" />}
                                                    </RadioButton.Group>

                                                </View>
                                            </View>


                                                <View style={[styles.flex,styles.middle]}>
                                                    <CodeField
                                                        ref={ref}
                                                        {...props1}
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
                                                    props.values.otp = value
                                                    handleSubmit(props.values)
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



