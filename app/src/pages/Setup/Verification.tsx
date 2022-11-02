import React, {Component} from "react";
import {Keyboard, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Paragraph, Text, Title, withTheme} from "react-native-paper";


import {TouchableOpacity} from "react-native";
import {Field, Form} from "react-final-form";

import InputField from "../../components/InputField";
import apiService from "../../libs/api-service";
import {localredux, loginUrl, METHOD, STATUS} from "../../libs/static";
import {appLog} from "../../libs/function";
import {setAlert, setDialog} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import CancelReason from "../Cart/CancelReason";
import ChangeEmail from "./ChangeEmail";


class Index extends Component<any> {

    initdata: any;

    constructor(props: any) {
        super(props);

        const {route}: any = this.props;


        this.initdata = {
            "code": "",
            ...route.params.userdetail
        }

    }

    componentDidMount() {

    }

    handleSubmit = (values: any) => {

        apiService({
            method: METHOD.POST,
            action: 'verifyemail',
            other: {url: loginUrl},
            body: values,
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                this.props.navigation.replace('AddWorkspace');
            }
        });
    }

    resendCode = () => {

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

    updateEmail = (email:any) => {
        this.initdata.email = email;
        this.forceUpdate()
    }


    render() {

        const {navigation, theme: {colors}} = this.props;


        return (
            <Container>

                <View style={[styles.center, styles.h_100, styles.middle]}>

                    <View style={{width: 360}}>

                        <Title>Verify Email </Title>

                        <Form
                            onSubmit={this.handleSubmit}
                            initialValues={{code: ''}}>
                            {props => (
                                <>
                                    <View>
                                        <Paragraph style={[styles.paragraph]}>Your Registered Email </Paragraph>
                                        <View style={[styles.grid, styles.middle]}>
                                            <Paragraph>
                                                {this.initdata.email} -
                                            </Paragraph>
                                            <TouchableOpacity onPress={() => {
                                                appLog('change  emial')
                                                store.dispatch(setDialog({
                                                    visible: true,
                                                    hidecancel: true,
                                                    width:360,
                                                    component: () => <ChangeEmail updateEmail={this.updateEmail} />
                                                }))
                                            }}>
                                                <Text style={[{color: colors.accent}]}> Change Email </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>





                                    <View>
                                        <Field name="code">
                                            {props => (
                                                <InputField
                                                    value={props.input.value}
                                                    label={'Code'}

                                                    keyboardType='numeric'
                                                    inputtype={'textbox'}
                                                    autoCapitalize='none'
                                                    autoFocus={true}
                                                    onSubmitEditing={(e: any) => {
                                                        this.handleSubmit(props.values)
                                                    }}
                                                    returnKeyType={'go'}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>


                                    <View style={[styles.py_5, styles.middle,{marginBottom:10,marginTop:10}]}>
                                        <TouchableOpacity onPress={() => {
                                            this.resendCode()
                                        }}>
                                            <Paragraph style={[{color: colors.accent}]}> Resend Code</Paragraph>
                                        </TouchableOpacity>
                                    </View>


                                    <View style={{marginBottom:80}}>
                                        <Button disabled={props.submitting || props.pristine}
                                                onPress={() => {
                                                    this.handleSubmit(props.values)
                                                }}> Verify </Button>

                                    </View>

                                </>
                            )}
                        </Form>

                    </View>

                </View>

            </Container>
        );
    }
}


export default withTheme(Index);



