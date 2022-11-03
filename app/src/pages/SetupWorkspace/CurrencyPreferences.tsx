import React, {Component} from "react";
import {Keyboard, ScrollView, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, Title, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {CommonActions} from "@react-navigation/native";
import KeyboardScroll from "../../components/KeyboardScroll";
import apiService from "../../libs/api-service";
import {ACTIONS, adminUrl, localredux, METHOD, required, STATUS} from "../../libs/static";
import {assignOption} from "../../libs/function";


class Index extends Component<any> {

    initdata: any;
    error: any;
    errorMessage: any;
    decimalcurrency: any;
    currency: any;

    constructor(props: any) {
        super(props);
        const {staticdata: {decimalcurrency, currency}} = localredux.initData
        this.decimalcurrency = decimalcurrency;
        this.currency = currency;
        this.initdata = {
            "currency": "",
        }
    }


    handleSubmit = (values: any) => {
        Keyboard.dismiss();
        const {workspace}:any = localredux.initData;
        const {token}:any = localredux.authData;

        apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            workspace:workspace,
            token:token,
            other: {url: adminUrl},
            body: {
                settingid: 'currency',
                settingdata: [{
                    "key": values.currency,
                    "value": {rate: '1', __key: values.currency, decimalplace: this.decimalcurrency[values.currency]}
                }]
            },
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {name: 'Terminal'},
                        ],
                    })
                );
            }
        });
    }


    render() {


        if (!Boolean(this.currency)) {
            return <View></View>
        }

        const currency_options = Object.keys(this.currency).map((c: any) => assignOption(this.currency[c], c))


        return (
            <Container>

                <ScrollView>
                    <View style={[styles.center, styles.h_100, styles.middle]}>

                        <View style={{width: 360}}>

                            <Title>Currency Preferences </Title>

                            <Form
                                onSubmit={this.handleSubmit}
                                initialValues={this.initdata}
                                render={({handleSubmit, submitting, values, ...more}: any) => (
                                    <View>
                                        <KeyboardScroll>

                                            <View>

                                                <View>

                                                    <Paragraph style={[styles.paragraph]}>Select your base currency and
                                                        you can
                                                        start revolutionising
                                                        your Business with DHRU</Paragraph>


                                                    <View>
                                                        <Field name="currency" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Currency'}
                                                                    selectedValue={props.input.value}
                                                                    selectLabel={'Select Currency'}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    showlabel={false}
                                                                    appbar={true}
                                                                    search={false}
                                                                    listtype={'other'}
                                                                    list={currency_options}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>

                                                        <Paragraph style={[styles.paragraph, styles.red]}>You can't
                                                            change your base
                                                            currency after finish.</Paragraph>
                                                    </View>

                                                </View>

                                            </View>

                                        </KeyboardScroll>


                                        <View style={[styles.mt_5]}>
                                            <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                                handleSubmit(values)
                                            }}>Next</Button>
                                        </View>


                                    </View>
                                )}
                            >

                            </Form>

                        </View>
                    </View>
                </ScrollView>


            </Container>
        );
    }
}


export default withTheme(Index);
