import React, {memo} from "react";

import {SafeAreaView, ScrollView, View} from "react-native";
import Container from "../../components/Container";
import {connect, useDispatch} from "react-redux";
import {withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {Field, Form} from "react-final-form";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import apiService from "../../libs/api-service";
import {
    composeValidators,
    localredux,
    loginUrl,
    METHOD,
    minLength,
    mustBeNumber, posUrl,
    required,
    STATUS, urls
} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import {appLog, errorAlert, nextFocus} from "../../libs/function";
import InputField from "../../components/InputField";
import {useNavigation} from "@react-navigation/native";
import {setAlert} from "../../redux-store/reducer/component";


const md5 = require('md5');


const Index = (props: any) => {

    const {adminid,loginpin}:any = localredux.authData

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const initdata = {oldpin: '', newpin: '', adminid: adminid}

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const handleSubmit = (values: any) => {
        if (md5(values.oldpin) === loginpin) {
            apiService({
                method: METHOD.POST,
                action: 'changepin',
                workspace: workspace,
                token: token,
                other: {url:  urls.posUrl},
                body: values
            }).then((result) => {
                if (result.status === STATUS.SUCCESS) {
                    errorAlert(result.message,'Success')
                    navigation?.goBack()
                }
            });
        }
        else{
            errorAlert('Old Pin do not match')
        }
    }


    return <Container style={styles.bg_white}>
        <SafeAreaView>
            <Form
                initialValues={initdata}
                onSubmit={handleSubmit}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <>

                        <View style={[styles.middle, styles.px_5]}>
                            <View style={[styles.middleForm, {maxWidth: 400}]}>

                                <ScrollView>

                                    <View>

                                        <Field name="oldpin"  validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'Old Pin'}
                                                    inputtype={'textbox'}
                                                    keyboardType={'numeric'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>

                                    </View>

                                    <View>


                                        <Field name="newpin"  validate={composeValidators(required, minLength(5))}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'New Pin'}
                                                    inputtype={'textbox'}
                                                    keyboardType={'numeric'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>

                                    </View>

                                </ScrollView>


                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Change </Button>
                                    </View>
                                </KAccessoryView>


                            </View>

                        </View>

                    </>
                )}
            >
            </Form>
        </SafeAreaView>
    </Container>


}


const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(withTheme(memo(Index)));

