import React, {Component, useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container} from "../../components";
import {connect, useDispatch} from "react-redux";
import {Appbar, Card, Paragraph, Title, withTheme,} from "react-native-paper";
import {
    appLog,
    assignOption,
    getDefaultCurrency,
    getStateList,
    objToArray,
    selectItem,
    syncData, updateComponent
} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {
    ACTIONS,
    adminUrl, countrylist,
    defalut_payment_term, device,
    isEmail,
    localredux,
    METHOD, minLength,
    PRODUCTCATEGORY,
    required,
    STATUS
} from "../../libs/static";

import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";

import {closePage, hideLoader, setModal, showLoader} from "../../redux-store/reducer/component";
import ProIcon from "../../components/ProIcon";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";

let moredetail:any = false
const Index = ({callback,pageKey}:any) => {

    const dispatch = useDispatch();
    const navigation = useNavigation()
    const {workspace}:any = localredux.initData;
    const {token}:any = localredux.authData;

    const {pricingtemplate, currency, paymentterms,general} = localredux.initData;
    const [loading,setLoading]:any = useState(false);
    const [displayname,setDisplayname]:any = useState();
   // const [country,setCountry]:any = useState(general.country);


    let statelist:any = [];
    const taxtypelist: any = [];
    const refstate: any = '';
    const moreDetailRef = React.useRef<View>(null);

    const initdata: any = {
        customertype: 'individual',
        status: 'active',
        firstname: '',
        lastname: '',
        company: '',
        paymentterm: 'date',
        clientconfig: {pricingtemplate: 'default', taxregtype: ['c']},
        clienttype: 0,
        country: general.country,
        currency: getDefaultCurrency(),
        displayname:device.searchlist?device.searchlist:'',
        state: general.state
    }



    if (!Boolean(initdata?.customertype)) {
        initdata.customertype = 'individual'
    }

    useEffect(()=>{

        setTimeout(()=>{
            getState(initdata.country);

            apiService({
                method: METHOD.GET,
                action: ACTIONS.GETTAXREGISTRATIONTYPE,
                workspace:workspace,
                token:token,
                other: {url: adminUrl},
                queryString: {country: initdata.country}
            }).then((result) => {
                let taxtypelist = []
                if (!initdata.clientid) {
                    initdata.clientconfig.taxregtype = []
                    initdata.clientconfig.taxid = []
                }
                if (result.data) {
                    taxtypelist = result.data;
                    if (!initdata.clientid) {
                        taxtypelist && taxtypelist.map(({types}: any, index: any) => {

                            if (types) {
                                let findConsumer = Object.keys(types).find((d: any) => d === "c");

                                if (findConsumer) {
                                    initdata.clientconfig.taxregtype[index] = findConsumer;
                                }
                            }
                        })
                    }
                }
            })

        })

    },[])

    const displayName = (field?: any, value?: any) => {
        let displaynames: any = [];
        if (field) {
            initdata[field] = value;
        }
        setDisplayname(displaynames)
    }

    const getState = (country: any) => {
        setLoading(false)
        country && getStateList(country).then((result) => {
            if (result.data) {
                statelist = Object.keys(result.data).map((k) => assignOption(result.data[k].name, k));
                setLoading(true)
            }
        });
    }


    const pricingtemplate_options = Object.keys(pricingtemplate).map((k) => assignOption(pricingtemplate[k].ptname, k));
    const currency_options = Object.keys(currency).map((k) => assignOption(k, k));

    let paymentterms_options:any = Object.keys(paymentterms).map((key: any) => {
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


    const  handleSubmit = async (values: any) => {

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.CLIENTS,
            body: values,
            workspace:workspace,
            token:token,
            other: {url: adminUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                dispatch(showLoader());
                try {
                    const client = {...values, ...result.data,label:values.displayname,value:result.data.clientid};
                    Boolean(callback) && await callback(client)
                    await syncData(false).then()
                    navigation.goBack()
                    //dispatch(closePage(pageKey))
                    dispatch(hideLoader());
                }
                catch (e) {
                    dispatch(hideLoader());
                    appLog('e',e)
                }
            }
        });
    }

    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader  />
    }


    return (
        <Container >
            <SafeAreaView>
            <Form
                onSubmit={handleSubmit}
                initialValues={initdata}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View  style={[styles.middle]}>
                        <View  style={[styles.middleForm]}>

                        <KeyboardScroll>

                            <View>
                                <View>
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
                                                        returnKeyType={"next"}
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
                                                        returnKeyType={"next"}
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

                                </View>


                                <View>
                                    <View>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                moredetail=!moredetail;
                                                updateComponent(moreDetailRef, 'display', moredetail?'flex':'none')
                                            }} style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                <Paragraph style={[styles.paragraph, styles.caption]}>
                                                    More Detail
                                                </Paragraph>
                                                <Paragraph>
                                                    <ProIcon name={!moredetail ? 'chevron-down' : 'chevron-up'}
                                                             action_type={'text'} size={16}/>
                                                </Paragraph>
                                            </TouchableOpacity>
                                        </View>

                                        {<View ref={moreDetailRef} style={{display:'none'}}>

                                            <View>
                                                <View>
                                                    <Field name="firstname">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'First Name'}
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
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                                displayName('company', value)
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>


                                            <View>
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
                                            </View>

                                            {Boolean(statelist?.length) && <View>
                                                <Field name="state">
                                                    {props => (
                                                        <InputField
                                                            label={'State'}
                                                            mode={'flat'}
                                                            ref={refstate}
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
                                                taxtypelist.map((taxtypes: any, index: any) => {
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
                                                                <Field name={`clientconfig.taxregtype[${index}]`}>
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

                                    </View>

                                </View>


                            </View>

                        </KeyboardScroll>



                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                    handleSubmit(values)
                                }}>   Add  </Button>
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




export default  Index;


