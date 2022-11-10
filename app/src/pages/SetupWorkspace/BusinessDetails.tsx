import React, {Component} from "react";
import {Keyboard, ScrollView, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Title, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {v4 as uuidv4} from 'uuid';
import KAccessoryView from "../../components/KAccessoryView"
import apiService from "../../libs/api-service";
import {ACTIONS, adminUrl, localredux, METHOD, required, STATUS} from "../../libs/static";
import {assignOption} from "../../libs/function";
import KeyboardScroll from "../../components/KeyboardScroll";


class Index extends Component<any> {

    initdata: any;
    error: boolean = false;
    errorMessage: string = "";
    alreadySetup: boolean = true;
    isNew: boolean = true;
    buttonLabel: string = "Next";
    industrytypes: any;

    constructor(props: any) {
        super(props);

        const {route} = props;

        const {location: {industrytype, pin, street1, street2, city}} = localredux.initData;


        this.initdata = {
            "industrytype": industrytype || "",
            "pin": pin || "",
            "street1": street1 || "",
            "street2": street2 || "",
            "departments": [{type: "Other"}],
            "city": city || "",
        }

        this.industrytypes = localredux.initData?.staticdata?.industrytypes || []

        this.alreadySetup = Boolean(route?.params?.alreadySetup);
        this.isNew = Boolean(route?.params?.isNew);

        if (this.alreadySetup) {
            this.buttonLabel = this.isNew ? "Next" : "Update";

            if (!this.isNew) {
                this.initdata = {
                    ...this.initdata,
                    ...route?.params?.locationData,
                }
            }
        }
    }


    handleSubmit = (values: any) => {
        Keyboard.dismiss();
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        let key = "06aa6e6d-a01b-43b5-849e-a1d84ba533ad"
        if (this.alreadySetup) {
            key = this.isNew ? uuidv4() : values?.locationid
        }

        apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            workspace: workspace,
            token: token,
            other: {url: adminUrl},
            body: {
                settingid: 'location',
                settingdata: [{key, "value": {...values, locationid: key}}]
            },
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                this.props.navigation.navigate('CurrencyPreferences');
            }
        });
    }


    render() {

        const optionIndustryType = Object.keys(this.industrytypes).map((k) => assignOption(this.industrytypes[k].name, k));


        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <>
                            <View style={[styles.middle,]}>
                                <View style={[styles.middleForm]}>
                                    <KeyboardScroll>


                                        <View style={[styles.px_6]}>
                                        <Title>Business Details </Title>



                                            {
                                                this.alreadySetup && <View>
                                                    <Field name="locationname" validate={required}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Location Name'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                            }

                                            <View>
                                                <Field name="industrytype" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Industry'}
                                                            selectedValue={props.input.value}
                                                            selectedLabel={"Select Industry"}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            showlabel={false}
                                                            appbar={true}
                                                            search={false}
                                                            listtype={'other'}
                                                            list={optionIndustryType}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            {
                                                this.alreadySetup && <View>
                                                    <Field name="ownership" validate={required}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Ownership'}
                                                                selectedValue={props.input.value}
                                                                selectedLabel={"Select Ownership"}
                                                                displaytype={'bottomlist'}
                                                                inputtype={'dropdown'}
                                                                showlabel={false}
                                                                appbar={true}
                                                                search={false}
                                                                listtype={'other'}
                                                                list={[
                                                                    {label: "Own", value: "own"},
                                                                    {label: "Franchise", value: "franchise"}
                                                                ]}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                            }


                                            <View>
                                                <Field name="street1" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Street 1'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View>
                                                <Field name="street2">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Street 2'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View>
                                                <Field name="city" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'City'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View>
                                                <Field name="pin" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value + ""}
                                                            label={'Zip/Postal Code'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            {
                                                this.alreadySetup && <View>
                                                    <Field name="mobile">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Mobile'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>

                                                    <Field name="latitude">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Latitude'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>

                                                    <Field name="longitude">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Longitude'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                            }

                                        </View>


                                    </KeyboardScroll>

                                    <KAccessoryView>
                                        <View style={[styles.submitbutton]}>
                                            <Button disable={more.invalid} secondbutton={more.invalid}
                                                    onPress={() => {
                                                        handleSubmit(values)
                                                    }}>{this.buttonLabel}</Button>
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

