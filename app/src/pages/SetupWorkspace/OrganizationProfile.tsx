import React, {Component} from "react";
import {Keyboard, View} from "react-native";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Title, withTheme} from "react-native-paper";
import {appLog, assignOption, errorAlert, getStateList, log} from "../../libs/function";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {
    ACTIONS,
    adminUrl,
    composeValidators,
    countrylist,
    dateformats,
    localredux,
    METHOD,
    months,
    required,
    STATUS
} from "../../libs/static";
import {v4 as uuidv4} from 'uuid';
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"
import apiService from "../../libs/api-service";
import {isArray} from "util";

class Index extends Component<any, any> {

    _captchaRef: any;
    initdata: any;
    error: boolean = false;
    errorMessage: string = "";
    update: boolean = false;

    constructor(props: any) {
        super(props);
        this._captchaRef = React.createRef();

        this.state = {
            statelist: [],
            taxtypelist: [],
        }

        this.update = props?.route?.params?.update;

        const {
            legalname,
            sitename,
            countrycode,
            country,
            state,
            taxregtype,
            taxid,
            financialfirstmonth,
            date_format
        } = localredux.initData?.general || {}

        this.initdata = {
            "legalname": legalname || "",
            "country": country || "",
            "state": state || "",
            "taxregtype": taxregtype || [],
            "taxid": taxid || [],
            "financialfirstmonth": financialfirstmonth || 4,
            "date_format": date_format || 'DD/MM/YYYY',
            "countryname": country,
        }


        if (this.update) {

            const {
                legalname,
                country,
                state,
                taxregtype,
                taxid,
                financialfirstmonth,
                date_format,
                countryname,
                statename,
                linklogo
            } = props?.general;


            this.initdata = {
                ...this.initdata,
                legalname,
                country,
                state,
                statename,
                taxregtype,
                financialfirstmonth,
                date_format,
                countryname
            }
            if (linklogo) {
                //voucher.data.files[0] = linklogo
            }


            let newTaxID: any = [];
            if (Boolean(taxid)) {
                taxid?.forEach((t: any) => {
                    if (t) {
                        newTaxID.push([t])
                    }
                })
                this.initdata = {
                    ...this.initdata,
                    taxid: [taxid]
                }
            }
        }
        if (this?.initdata?.country) {
            this.getStateAndTaxType(this?.initdata?.country);
        }
    }

    componentDidMount() {

    }


    getStateAndTaxType(country: any, reset?: boolean) {
        let queryString = {country};
        getStateList(country).then((result: any) => {
            if (result.data) {
                this.setState({
                    statelist: Object.keys(result.data).map((k: any) => assignOption(result.data[k].name, k))
                })
            }
        });

        const {workspace}: any = localredux.initData;

        const {token}: any = localredux.authData;

        apiService({
            method: METHOD.GET,
            action: ACTIONS.GETTAXREGISTRATIONTYPE,
            workspace: workspace,
            token: token,
            hideLoader: true,
            other: {url: adminUrl},
            queryString,
        }).then((result) => {
            if (result.data) {
                this.setState({
                    taxtypelist: result.data
                })
            } else {
                this.setState({
                    taxtypelist: []
                })
            }
        })

        if (Boolean(reset)) {
            this.initdata.taxregtype = [];
            this.initdata.taxid = [];
        }

    }


    validate = (values: any) => {

        try {

            this.error = false;
            this.errorMessage = "";


            const {taxtypelist} = this.state;
            let taxes: any = []


            this.initdata?.taxid.map((tax: any) => {

                if (isArray(tax)) {
                    tax?.map((t: any) => {
                        taxes.push(t)
                    })
                }
            })

            values = {
                ...values,
                taxregtype: this.initdata.taxregtype,
                taxid: taxes,
                defaultcountry: values.country,
            }


            const {taxregtype, taxid} = values;

            let taxRegCount = taxtypelist?.length;
            let selectedTaxRegCount = taxregtype?.length;

            if (selectedTaxRegCount < taxRegCount) {
                this.addLineInMessage();
                this.errorMessage += `Please Select ${taxRegCount == 1 ? "" : "All "}Tax Registration Type`;
            }


            if (selectedTaxRegCount > 0) {
                taxregtype.forEach((key: any, index: any) => {
                    if (Boolean(key) && !Boolean(taxid[index])) {

                        taxtypelist[index]?.types[key]?.fields.map((field: any) => {
                            if (field.required) {
                                this.addLineInMessage();
                                this.errorMessage += `Please Enter ${field.name}`;
                            }
                        })
                    }
                })
            }


            this.error = Boolean(this.errorMessage)

            if (!this.error) {
                this.handleSubmit(values)
            } else {
                errorAlert(this.errorMessage);
            }
        } catch (e) {
            appLog('e', e)
        }

    }

    addLineInMessage = () => {
        if (Boolean(this.errorMessage)) {
            this.errorMessage += "\n";
        }
    }

    handleSubmit = (values: any) => {


        try {
            values = {
                ...values,
                //linklogo: voucher?.data?.files[0]
            }
            let settings: any = []
            Object.keys(values).map((keys: any) => {
                settings.push({key: keys, value: values[keys]})
            })


            Keyboard.dismiss();

            const {workspace}: any = localredux.initData;
            const {token}: any = localredux.authData;

            apiService({
                method: METHOD.PUT,
                action: ACTIONS.SETTINGS,
                workspace: workspace,
                token: token,
                other: {url: adminUrl},
                body: {'settingid': 'general', 'settingdata': settings},

            }).then((result) => {
                if (result.status === STATUS.SUCCESS) {
                    this.props.navigation.navigate('BusinessDetails');
                }
            });
        } catch (e) {
            log('e', e)
        }


    }


    render() {

        const {navigation,} = this.props;
        const {statelist, taxtypelist}: any = this.state;


        return (
            <Container>

                <Form
                    onSubmit={this.validate}
                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (

                        <View style={[styles.middle,]}>
                            <View style={[styles.middleForm]}>
                                <KeyboardScroll>


                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                        <View>

                                            <View>

                                                {/*<Paragraph style={[styles.paragraph]}>Let's get started by setting up your company
                                                profile</Paragraph>*/}

                                                <View>
                                                    <Field name="legalname" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Legal/Organization Name'}
                                                                value={props.input.value}
                                                                inputtype={'textbox'}
                                                                autoCapitalize={true}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                            </View>
                                        </View>




                                        {
                                            this.update && <View>
                                                <View>

                                                    <View style={[styles.cardContent, {paddingHorizontal: 0}]}>
                                                        <InputField
                                                            label={'Upload A New Logo'}
                                                            divider={true}
                                                            inputtype={'attachment'}
                                                            singleImage={true}
                                                            navigation={navigation}
                                                            onChange={(data: any) => {
                                                                log("PICK", data);
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        }


                                        </Card.Content>
                                    </Card>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                        <View>

                                            <View>
                                                <View>
                                                    <Field name="country" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Business Location (Country)'}
                                                                selectedValue={props.input.value}
                                                                selectedLabel={`Select Country`}
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
                                                                    props.input.onChange(value);
                                                                    this.getStateAndTaxType(value, true)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    {Boolean(statelist) &&
                                                        <Field name="state" validate={composeValidators(required)}>
                                                            {props => (
                                                                <>
                                                                    <InputField
                                                                        {...props}
                                                                        label={'State'}
                                                                        selectedValue={props.input.value}
                                                                        selectedLabel={`Select State`}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        showlabel={false}
                                                                        appbar={true}
                                                                        key={uuidv4()}
                                                                        search={false}
                                                                        listtype={'other'}
                                                                        list={statelist}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value)
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
                                                        </Field>}
                                                </View>


                                                <View>
                                                    <Field name="financialfirstmonth"
                                                           validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Start of Financial Year From'}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                selectedLabel={`Select Financial Year`}
                                                                showlabel={false}
                                                                appbar={true}
                                                                search={false}
                                                                listtype={'other'}
                                                                list={months}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                <View>
                                                    <Field name="date_format" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Date Format'}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                selectedLabel={`Select Date Format`}
                                                                showlabel={false}
                                                                appbar={true}
                                                                key={uuidv4()}
                                                                search={false}
                                                                listtype={'other'}
                                                                list={dateformats}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                            </View>

                                        </View>
                                        </Card.Content>
                                    </Card>


                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>
                                    <View>
                                        {

                                            (Boolean(values.country) && Boolean(taxtypelist)) &&
                                            taxtypelist.map(({name, types}: any, index: any) => {

                                                return (
                                                    <>

                                                        <InputField
                                                            selectedValue={this.initdata.taxregtype[index]}
                                                            label={'Tax Registration Type'}
                                                            displaytype={'pagelist'}
                                                            selectedLabel={"Select Tax Registration Type"}
                                                            inputtype={'dropdown'}
                                                            showlabel={false}
                                                            appbar={true}
                                                            search={false}
                                                            key={uuidv4()}
                                                            listtype={'other'}
                                                            list={Object.keys(types).filter((k) => types[k].company).map((k) => assignOption(types[k].name, k))}
                                                            onChange={(value: any) => {
                                                                this.initdata.taxregtype[index] = value;
                                                                this.forceUpdate()
                                                            }}
                                                        />

                                                        {
                                                            this.initdata.taxregtype[index] &&
                                                            types[this.initdata.taxregtype[index]]?.fields?.map(
                                                                ({name, required: req}: any, k: number) => {
                                                                    let value;

                                                                    if (this.initdata?.taxid[index] && this.initdata?.taxid[index][k]) {
                                                                        value = this.initdata?.taxid[index][k]
                                                                    }

                                                                    return <>

                                                                        <InputField
                                                                            defaultValue={value}
                                                                            label={name}
                                                                            autoCapitalize = {"characters"}
                                                                            inputtype={'textbox'}
                                                                            onChange={(value: any) => {
                                                                                if (!Boolean(this.initdata.taxid[index])) {
                                                                                    this.initdata.taxid[index] = []
                                                                                }
                                                                                this.initdata.taxid[index][k] = value;

                                                                            }}
                                                                        />

                                                                    </>
                                                                })
                                                        }
                                                    </>
                                                )
                                            })
                                        }


                                    </View>

                                        </Card.Content>
                                    </Card>



                                </KeyboardScroll>
                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color:'white'}} disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}>{this.update ? "Save" : "Next"}</Button>
                                    </View>
                                </KAccessoryView>
                            </View>
                        </View>

                    )}
                >

                </Form>


            </Container>
        );
    }
}


export default withTheme(Index);

