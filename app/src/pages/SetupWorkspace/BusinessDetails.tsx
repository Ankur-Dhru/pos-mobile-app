import React, {Component} from "react";
import {Keyboard, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {v4 as uuidv4} from 'uuid';
import KAccessoryView from "../../components/KAccessoryView"
import apiService from "../../libs/api-service";
import {ACTIONS, localredux, METHOD, PRODUCTCATEGORY, required, STATUS, urls} from "../../libs/static";
import {appLog, assignOption, nextFocus} from "../../libs/function";
import KeyboardScroll from "../../components/KeyboardScroll";

let inputRef: any = [];

class Index extends Component<any> {

    initdata: any;
    error: boolean = false;
    errorMessage: string = "";
    alreadySetup: boolean = true;
    isNew: boolean = true;
    buttonLabel: string = "Next";
    industrytypes: any;
    locationname:any;

    constructor(props: any) {
        super(props);

        const {route} = props;

        const {location: {industrytype, pin, street1, street2, city}} = localredux.initData;

        inputRef = [React.createRef(), React.createRef(), React.createRef(), React.createRef()]
        this.locationname = route?.params?.legalname || 'Default';

        this.initdata = {
            "industrytype": industrytype || "",
            "pin": pin || "",
            "street1": street1 || "",
            "street2": street2 || "",
            "departments": [{type: "Other"}],
            "city": city || "",
            locationname:this.locationname
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

        let key = PRODUCTCATEGORY.LOCATIONID
        if (this.alreadySetup) {
            key = this.isNew ? uuidv4() : values?.locationid
        }

        if(values.industrytype === 'foodservices'){
            values.departments[0].type = 'Kitchen';
        }


        apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            workspace: workspace,
            token: token,
            other: {url: urls.adminUrl},
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


                                        <Card style={[styles.card]}>

                                            <Card.Content style={[styles.cardContent]}>


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
                                                                onSubmitEditing={() => nextFocus(inputRef[1])}
                                                                returnKeyType={'next'}
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
                                                                customRef={inputRef[1]}
                                                                onSubmitEditing={() => nextFocus(inputRef[2])}
                                                                returnKeyType={'next'}
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
                                                                customRef={inputRef[2]}
                                                                onSubmitEditing={() => nextFocus(inputRef[3])}
                                                                returnKeyType={'next'}
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
                                                                customRef={inputRef[3]}
                                                                onSubmitEditing={() => handleSubmit(values)}
                                                                returnKeyType={'go'}
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

                                            </Card.Content>

                                        </Card>


                                    </KeyboardScroll>

                                    <KAccessoryView>
                                        <View style={[styles.submitbutton]}>
                                            <Button more={{color: 'white'}} disable={more.invalid}
                                                    secondbutton={more.invalid}
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

