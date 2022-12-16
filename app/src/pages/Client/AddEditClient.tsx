import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container} from "../../components";
import {useDispatch} from "react-redux";
import {Caption, Card, Paragraph,} from "react-native-paper";
import {appLog, assignOption, getDefaultCurrency, nextFocus, syncData, updateComponent} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {
    ACTIONS,
    defalut_payment_term,
    isEmail,
    localredux,
    METHOD,
    minLength,
    required,
    STATUS,
    urls
} from "../../libs/static";

import InputField from '../../components/InputField';
import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";

import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import ProIcon from "../../components/ProIcon";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import store from "../../redux-store/store";
import {updateCartField} from "../../redux-store/reducer/cart-data";

let moredetail: any = false
const Index = (props: any) => {

    const dispatch = useDispatch();
    const navigation = useNavigation()
    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const search = props?.route?.params?.search;

    const {pricingtemplate, currency, paymentterms, general} = localredux.initData;
    const {taxtypelist, statelist} = localredux;

    const [displayname, setDisplayname]: any = useState();
    const [loaded, setLoaded] = useState<boolean>(false)

    let inputRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const moreDetailRef = React.useRef<View>(null);

    const initdata: any = {
        customertype: 'individual',
        status: 'active',
        firstname: '',
        lastname: '',
        company: '',
        paymentterm: 'date',
        clientconfig: {pricingtemplate: 'default', taxregtype: ['c'], taxid: []},
        clienttype: 0,
        country: general.country,
        currency: getDefaultCurrency(),
        displayname: search || '',
        state: general.state
    }


    if (!Boolean(initdata?.customertype)) {
        initdata.customertype = 'individual'
    }

    useEffect(() => {

        if (!initdata.clientid) {
            initdata.clientconfig.taxregtype = []
            initdata.clientconfig.taxid = [];

            taxtypelist && taxtypelist?.map(({types}: any, index: any) => {

                if (types) {
                    let findConsumer = Object.keys(types).find((d: any) => d === "c");

                    if (findConsumer) {
                        initdata.clientconfig.taxregtype[index] = findConsumer;
                    }
                }
            })
        }
    }, [])

    const displayName = (field?: any, value?: any) => {
        let displaynames: any = [];
        if (field) {
            initdata[field] = value;
        }
        setDisplayname(displaynames)
    }


    const pricingtemplate_options = Object.keys(pricingtemplate).map((k) => assignOption(pricingtemplate[k].ptname, k));
    const currency_options = Object.keys(currency).map((k) => assignOption(k, k));

    let paymentterms_options: any = Object.keys(paymentterms).map((key: any) => {
        if (Boolean(paymentterms[key])) {
            return {label: paymentterms[key].termname, value: paymentterms[key].termdays}
        }
    }).filter((item: any) => {
        return Boolean(item)
    })
    paymentterms_options = [
        ...paymentterms_options,
        ...defalut_payment_term
    ]


    const handleSubmit = async (values: any) => {

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.CLIENT,
            body: values,
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                dispatch(showLoader());
                try {
                    const client = {...values, ...result.data, label: values.displayname, value: result.data.clientid};

                    await syncData(false).then()

                    if (Boolean(search)) {
                        store.dispatch(updateCartField({clientid: client.clientid, clientname: client.displayname}));
                        navigation.goBack()
                    }

                    navigation.goBack()
                    dispatch(hideLoader());
                } catch (e) {
                    dispatch(hideLoader());
                    appLog('e', e)
                }
            }
        });
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader/>
    }


    return (
        <Container>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm]}>

                                <ScrollView>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>
                                            <View>

                                                <View>
                                                    <Field name="customertype">
                                                        {props => {
                                                            return (<>
                                                                <InputField
                                                                    label={'Client Type'}
                                                                    divider={true}
                                                                    displaytype={'bottomlist'}
                                                                    inputtype={'dropdown'}
                                                                    list={[{
                                                                        value: 'individual',
                                                                        label: 'Individual'
                                                                    }, {value: 'company', label: 'Company'}]}
                                                                    search={false}
                                                                    listtype={'other'}
                                                                    selectedValue={props.input.value}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            </>)
                                                        }}
                                                    </Field>
                                                </View>
                                                <View>
                                                    <Field name="displayname" validate={required}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Display Name'}
                                                                onSubmitEditing={() => nextFocus(inputRef[1])}
                                                                returnKeyType={'next'}
                                                                autoFocus={true}
                                                                disabled={initdata.clientid === '1'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                                <View>
                                                    <Field name="email"
                                                           validate={(value) => Boolean(value) ? isEmail(value) : undefined}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Email'}
                                                                customRef={inputRef[1]}
                                                                onSubmitEditing={() => nextFocus(inputRef[2])}
                                                                returnKeyType={'next'}
                                                                keyboardType={'email-address'}
                                                                inputtype={'textbox'}

                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    <Field
                                                        name="phone"
                                                        validate={(value) => Boolean(value) ? minLength(10)(value) : undefined}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                customRef={inputRef[2]}
                                                                onSubmitEditing={() => handleSubmit(values)}
                                                                value={props.input.value}
                                                                label={'Phone'}
                                                                returnKeyType={"next"}
                                                                keyboardType={'phone-pad'}
                                                                inputtype={'textbox'}

                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                            </View>

                                        </Card.Content>


                                    </Card>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>
                                            <View>
                                                <TouchableOpacity onPress={() => {
                                                    moredetail = !moredetail;
                                                    updateComponent(moreDetailRef, 'display', moredetail ? 'flex' : 'none')
                                                }} style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                    <Caption style={[styles.caption]}>
                                                        More Detail
                                                    </Caption>
                                                    <Paragraph>
                                                        <ProIcon name={!moredetail ? 'chevron-down' : 'chevron-up'}
                                                        />
                                                    </Paragraph>
                                                </TouchableOpacity>
                                            </View>

                                            {<View ref={moreDetailRef} style={{display: 'none'}}>

                                                <View>
                                                    <View>
                                                        <Field name="firstname">
                                                            {props => (
                                                                <InputField
                                                                    value={props.input.value}
                                                                    label={'First Name'}

                                                                    onSubmitEditing={() => nextFocus(inputRef[3])}
                                                                    returnKeyType={'next'}

                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        displayName('firstname', value)
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>

                                                    </View>

                                                    <View>
                                                        <Field name="lastname">
                                                            {props => (
                                                                <InputField
                                                                    value={props.input.value}
                                                                    label={'Last Name'}
                                                                    customRef={inputRef[3]}
                                                                    onSubmitEditing={() => nextFocus(inputRef[4])}
                                                                    returnKeyType={'next'}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        displayName('lastname', value)
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>

                                                </View>

                                                <View>
                                                    <Field name="company">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Company Name'}
                                                                customRef={inputRef[4]}
                                                                onSubmitEditing={() => nextFocus(inputRef[5])}
                                                                returnKeyType={'next'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                    displayName('company', value)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                {/*<View>
                                                        <Field name="country">
                                                            {props => (
                                                                <>
                                                                    <InputField
                                                                        label={'Country'}
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
                                                                            getState(value);
                                                                        }}>
                                                                    </InputField>
                                                                </>
                                                            )}
                                                        </Field>
                                                    </View>*/}

                                                {Boolean(statelist?.length) && <View>
                                                    <Field name="state">
                                                        {props => (
                                                            <InputField
                                                                label={'State'}
                                                                mode={'flat'}
                                                                list={statelist || []}
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
                                                </View>}


                                                <View>
                                                    <Field name="address1">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Address 1'}
                                                                customRef={inputRef[5]}
                                                                onSubmitEditing={() => nextFocus(inputRef[6])}
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
                                                    <Field name="address2">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Address 2'}
                                                                customRef={inputRef[6]}
                                                                onSubmitEditing={() => nextFocus(inputRef[7])}
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
                                                    <Field name="city">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                customRef={inputRef[7]}
                                                                onSubmitEditing={() => nextFocus(inputRef[8])}
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
                                                    <Field name="pin">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                customRef={inputRef[8]}
                                                                returnKeyType={'next'}
                                                                label={'PIN'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                {
                                                    taxtypelist?.map((taxtypes: any, index: any) => {
                                                        const {types} = taxtypes;

                                                        let typelist = Object.keys(types).map((k) => assignOption(types[k]?.name, k));

                                                        if (!Boolean(initdata?.clientconfig && initdata?.clientconfig?.taxregtype)) {
                                                            initdata.clientconfig = {
                                                                ...initdata.clientconfig,
                                                                taxregtype: [],
                                                                taxid: []
                                                            };
                                                        }

                                                        return (

                                                            <>

                                                                <View>
                                                                    <Field
                                                                        name={`clientconfig.taxregtype[${index}]`}>
                                                                        {props => (
                                                                            <>
                                                                                <InputField
                                                                                    label={`Tax Registration Type`}
                                                                                    mode={'flat'}
                                                                                    list={typelist}
                                                                                    value={props.input.value}
                                                                                    selectedValue={props.input.value}
                                                                                    displaytype={'bottomlist'}
                                                                                    inputtype={'dropdown'}
                                                                                    listtype={'other'}
                                                                                    onChange={(value: any) => {
                                                                                        props.input.onChange(value);
                                                                                        initdata.clientconfig.taxregtype[index] = value;

                                                                                    }}>
                                                                                </InputField>
                                                                            </>
                                                                        )}
                                                                    </Field>
                                                                </View>


                                                                <View>
                                                                    {
                                                                        initdata?.clientconfig?.taxregtype[index] &&
                                                                        types[initdata?.clientconfig?.taxregtype[index]]?.fields?.map(({
                                                                                                                                           name,
                                                                                                                                           required
                                                                                                                                       }: any, indexs: number) => {

                                                                            let defaultValue = initdata?.clientconfig?.taxid &&
                                                                                initdata?.clientconfig?.taxid[index] &&
                                                                                initdata?.clientconfig?.taxid[index][indexs];

                                                                            return (
                                                                                <View>
                                                                                    <Field
                                                                                        name={`clientconfig.taxid[${index}][${indexs}]`}
                                                                                        key={`${index}${indexs}`}>
                                                                                        {props => (
                                                                                            <InputField
                                                                                                value={'' + defaultValue ? defaultValue : ''}
                                                                                                label={`${name} ${required ? "*" : ""}`}
                                                                                                inputtype={'textbox'}
                                                                                                onChange={props.input.onChange}
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </View>)
                                                                        })
                                                                    }

                                                                </View>

                                                            </>

                                                        )
                                                    })
                                                }


                                                <View>
                                                    <Field name="paymentterm">
                                                        {props => (
                                                            <InputField
                                                                label={'Payment Term'}
                                                                mode={'flat'}
                                                                list={paymentterms_options || []}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value + '');
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    <Field name="currency">
                                                        {props => (
                                                            <InputField
                                                                label={'Currency'}
                                                                mode={'flat'}
                                                                list={currency_options}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'bottomlist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>

                                                {initdata.clienttype === 0 && <View>
                                                    <Field name="clientconfig.pricingtemplate">
                                                        {props => (
                                                            <InputField
                                                                label={'Pricing Template'}
                                                                mode={'flat'}
                                                                list={pricingtemplate_options}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'bottomlist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>}

                                            </View>}

                                        </Card.Content>

                                    </Card>


                                </ScrollView>


                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Add </Button>
                                    </View>
                                </KAccessoryView>

                            </View>

                        </View>
                    )}
                >

                </Form>

            </SafeAreaView>
        </Container>

    )

}


export default Index;


