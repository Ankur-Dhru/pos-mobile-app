import React, {Component} from "react";
import {Keyboard, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {CommonActions} from "@react-navigation/native";
import KeyboardScroll from "../../components/KeyboardScroll";
import apiService from "../../libs/api-service";
import {ACTIONS, localredux, METHOD, required, STATUS, urls} from "../../libs/static";
import {assignOption} from "../../libs/function";
import KAccessoryView from "../../components/KAccessoryView"

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
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            workspace: workspace,
            token: token,
            other: {url: urls.adminUrl},
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
            <Container    style={styles.bg_white}>


                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <>
                            <View style={[styles.middle]}>
                                <View style={[styles.middleForm, {maxWidth: 400,}]}>
                                    <KeyboardScroll>

                                        <Card style={[styles.card]}>
                                            <Card.Content style={[styles.cardContent]}>
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
                                                                    selectlabel={'Currency'}
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

                                            </Card.Content>

                                        </Card>
                                    </KeyboardScroll>

                                    <KAccessoryView>
                                        <View style={[styles.submitbutton]}>
                                            <Button more={{color: 'white'}} disable={more.invalid}
                                                    secondbutton={more.invalid} onPress={() => {
                                                handleSubmit(values)
                                            }}>Next</Button>
                                        </View>
                                    </KAccessoryView>

                                </View>

                            </View>

                        </>
                    )}
                >

                </Form>


            </Container>
        );
    }
}


export default withTheme(Index);

