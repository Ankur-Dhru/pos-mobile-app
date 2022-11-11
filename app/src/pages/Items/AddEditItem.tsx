import React, {useEffect, useState} from 'react';
import {SafeAreaView, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";

import {Button, Container, ProIcon} from "../../components";
import {useDispatch} from "react-redux";
import {Divider, Paragraph, TextInput as TI,} from "react-native-paper";
import {
    appLog,
    assignOption,
    findObject,
    getCurrencySign,
    isRestaurant,
    selectItem,
    updateComponent
} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {
    ACTIONS,
    adminUrl,
    composeValidators,
    device,
    inventoryOption,
    localredux,
    METHOD,
    mustBeNumber,
    options_itc,
    pricing,
    PRODUCTCATEGORY,
    required,
    STATUS
} from "../../libs/static";


import InputField from '../../components/InputField';

import KeyboardScroll from "../../components/KeyboardScroll";


import KAccessoryView from '../../components/KAccessoryView';


import apiService from "../../libs/api-service";
import CheckBox from "../../components/CheckBox";
import {insertItems} from "../../libs/Sqlite/insertData";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";

import ItemCategoryList from "./ItemCategoryList";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";


const Index = (props: any) => {

    const {item, pageKey} = props;


    let isShow: any = false;
    const dispatch = useDispatch()
    const navigation = useNavigation()

    let initdata: any = {
        veg:'veg',
        allowmultipleorders: "1",
        defaultitc: "eligible",
        inventoryaccount: 45,
        inventorytype: "fifo",
        inwardaccount: 63,
        isaddon: 0,
        pricing: pricing,
        itemconfig: [],
        itemdepartmentid: PRODUCTCATEGORY.DEPARTMENT,
        itemgroupid: store.getState()?.selectedData?.group?.value || PRODUCTCATEGORY.DEFAULT,
        itemhsncode: '',
        itemname: Boolean(device.search) ? device.search : '',
        itemstatus: "active",
        itemtaxgroupid: PRODUCTCATEGORY.TAXGROUPID,
        itemtype: "product",
        itemunit: PRODUCTCATEGORY.ITEMUNIT,
        longinfo: "",
        notifyqntreorder: "1",
        openingunit: "",
        outwardaccount: 13,
        preventstock: "1",
        pricingtype: "onetime",
        privatekey: "",
        publickey: "",
        retail: "1",
        uniqueproductcode: '',
        retailconfig: "",
        salesunit: PRODUCTCATEGORY.ITEMUNIT,
        sellingcost: '',
        mrp: '',
        shortinfo: "",
        rate: '',
        pricealert: 0,
        trackinventory: false,
        identificationtype: 'auto',
        warrantyperiod: "day",
        warrantytoclient: false,
    }


    const {staticdata: {itemtype}, itemgroup, unit, tax, general, chartofaccount}: any = localredux.initData;

    if (Boolean(item?.itemid)) {
        initdata = {...initdata, ...item}
    }

    let isTypeProduct = initdata.itemtype === 'product';
    let isTypeService = initdata.itemtype === 'service';
    let isTypeLicensing = initdata.itemtype === 'licensing';
    let itemTypeConfig = itemtype[initdata.itemtype] && itemtype[initdata.itemtype].config;

    const advanceRef = React.createRef()

    const options_itemtypes = Object.keys(itemtype).filter((k: any) => {
        return k === 'product' || k === 'licensing' || k === "service"
    }).map((k) => assignOption(itemtype[k].description, k, '', '', (k === 'product' || k === 'licensing' || k === "service") ? false : true));

    const option_inventory = Object.keys(inventoryOption).filter((k: any) => {
        return k === 'specificidentification' || k === 'fifo'
    }).map((k) => assignOption(inventoryOption[k].name, k, '', '', inventoryOption[k].disabled));


    const option_units = Object.keys(unit).map((k) => assignOption(`${unit[k].unitname} (${unit[k].unitcode})`, k));

    const option_taxes = tax && Object.values(tax).map((t: any) => assignOption(t.taxgroupname, t.taxgroupid));

    let defaultTax: any = Object.values(tax).filter((t: any) => {
        return t.defaulttax
    })

    initdata.itemtaxgroupid = defaultTax[0]?.taxgroupid || option_taxes[0].value;

    let option_salesunit: any = [];
    if (Boolean(initdata.itemunit)) {
        let unittype = unit[initdata.itemunit] && unit[initdata.itemunit].unittype;
        option_salesunit = Object.values(unit)
            .filter((a: any) => Boolean(a) && a.unittype === unittype)
            .map((a: any) => assignOption(`${a.unitname} (${a.unitcode})`, a.unitid))
    }

    const onlyForRegistered = Boolean((general?.taxregtype[0] === "grr" || general?.taxregtype[0] === "grc"));
    const onlyForIndia = (general.country === 'IN');


    const handleSubmit = async (values: any) => {

        values.trackinventory = Boolean(values.trackinventory) ? 1 : 0
        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: Boolean(initdata.itemid) ? METHOD.PUT : METHOD.POST,
            action: ACTIONS.ITEMS,
            body: values,
            workspace: workspace,
            token: token,
            other: {url: adminUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                dispatch(showLoader())
                const grouplist: any = store.getState()?.groupList || {}
                try {
                    const item = {...values, ...result.data, groupname: grouplist[values?.itemgroupid].itemgroupname};
                    await insertItems([item], 'onebyone').then(async () => {


                        await selectItem(item);

                        const selectedGroup = store.getState().selectedData.group?.value;
                        await dispatch(setSelected({value: '', field: 'group'}))
                        setTimeout(async () => {
                            await dispatch(setSelected({value: selectedGroup, field: 'group'}))
                            dispatch(hideLoader())
                            navigation?.goBack()
                        }, 100)

                    });
                } catch (e) {
                    appLog('e', e)
                }
            }
            device.search = ''
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
        return <PageLoader/>
    }

    let isRetailIndustry = !isRestaurant();
    return (

        <Container>

            <Form
                onSubmit={handleSubmit}
                initialValues={{...initdata}}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <>

                        <View style={[styles.middle,]}>
                            <View style={[styles.middleForm]}>

                                <KeyboardScroll>


                                    <View style={[styles.px_6]}>
                                        <View>
                                            <View>
                                                <View>

                                                    <Paragraph style={[styles.paragraph, styles.caption, styles.mt_5]}>
                                                        Basic
                                                    </Paragraph>


                                                    {!isRetailIndustry &&
                                                        <View>
                                                            <Field name="veg" >
                                                                {props => (
                                                                    <>
                                                                        <InputField
                                                                            {...props}
                                                                            label={'Diet'}
                                                                            mode={'flat'}
                                                                            list={[{
                                                                                label: 'Veg',
                                                                                value: 'veg'
                                                                            }, {
                                                                                label: 'Non-Veg',
                                                                                value: 'nonveg'
                                                                            }, {
                                                                                label: 'Contain Egg',
                                                                                value: 'egg'
                                                                            }]}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            listtype={'other'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value)
                                                                            }}>
                                                                        </InputField>
                                                                    </>
                                                                )}
                                                            </Field>

                                                        </View>
                                                    }

                                                    <View>
                                                        <Field name="itemtype">
                                                            {props => (
                                                                <InputField
                                                                    label={'Item Type'}
                                                                    mode={'flat'}
                                                                    list={options_itemtypes}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);

                                                                        isTypeProduct = value === 'product'
                                                                        isTypeService = value === 'service'
                                                                        isTypeLicensing = value === 'licensing'

                                                                        if (isTypeProduct) {
                                                                            if (!Boolean(values.inventoryaccount)) {
                                                                                const defaultInward = findObject(chartofaccount, "accountname", "Inventory Asset", true);
                                                                                values.inventoryaccount = defaultInward.accountid;
                                                                            }
                                                                        }
                                                                        itemTypeConfig = itemtype[value] && itemtype[value].config;
                                                                    }}
                                                                >
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <Field name="itemgroupid">
                                                            {props => (
                                                                <><ItemCategoryList navigation={navigation} fieldprops={props}/></>
                                                            )}
                                                        </Field>
                                                    </View>

                                                    <View>
                                                        <Field name="itemname" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'Name'}
                                                                    inputtype={'textbox'}
                                                                    onChange={props.input.onChange}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <Field name="otherlanguagename">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Other Language Name'}
                                                                inputtype={'textbox'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>

                                                    <View>
                                                        <Field name="uniqueproductcode">
                                                            {props => (
                                                                <InputField
                                                                    value={props.input.value}
                                                                    label={'SKU or Item Code'}
                                                                    inputtype={'textbox'}
                                                                    onChange={props.input.onChange}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <Field name="pricing.price.default[0].onetime.baseprice"
                                                               validate={composeValidators(required, mustBeNumber)}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'Selling Price  '}
                                                                    keyboardType='numeric'
                                                                    inputtype={'textbox'}
                                                                    left={<TI.Affix text={getCurrencySign()}/>}
                                                                    onChange={props.input.onChange}
                                                                />
                                                            )}
                                                        </Field>

                                                    </View>


                                                    <View>
                                                        <Field name="itemtaxgroupid" validate={required}>
                                                            {props => (
                                                                <>
                                                                    <InputField
                                                                        {...props}
                                                                        label={'Tax Rate'}
                                                                        mode={'flat'}
                                                                        list={option_taxes}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value)
                                                                        }}>
                                                                    </InputField>
                                                                </>
                                                            )}
                                                        </Field>

                                                    </View>


                                                    {onlyForIndia && onlyForRegistered &&
                                                        <Field name="itemhsncode"
                                                               validate={composeValidators(required, mustBeNumber)}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    keyboardType='numeric'
                                                                    label={`${isTypeService ? "SAC" : "HSN"} Code `}
                                                                    onChange={props.input.onChange}
                                                                    inputtype={'textbox'}
                                                                />
                                                            )}
                                                        </Field>
                                                    }

                                                    {
                                                        Array.isArray(itemTypeConfig) && itemTypeConfig.map((configObject: any, index: any) => {
                                                            if (!Boolean(initdata.itemconfig)) {
                                                                initdata.itemconfig = []
                                                            }
                                                            if (!Boolean(initdata.itemconfig[index])) {
                                                                initdata.itemconfig[index] = {value: ''}
                                                            }
                                                            const {
                                                                type,
                                                                name,
                                                                options,
                                                                description,
                                                                required: req
                                                            } = configObject;

                                                            return <View key={index}>
                                                                {
                                                                    type && <>
                                                                        {
                                                                            (type === "text" || type === "password" || type === "textarea") &&
                                                                            <Field name={name}
                                                                                   validate={req ? required : undefined}>
                                                                                {props => (
                                                                                    <><InputField
                                                                                        {...props}
                                                                                        value={initdata.itemconfig[index].value}
                                                                                        label={name}
                                                                                        inputtype={'textbox'}
                                                                                        secureTextEntry={type === "password"}
                                                                                        multiline={type === "textarea"}
                                                                                        onChange={(value: any) => {
                                                                                            props.input.onChange(value);
                                                                                            initdata.itemconfig[index].value = value
                                                                                        }}
                                                                                    />
                                                                                        <Paragraph
                                                                                            style={[styles.paragraph, styles.text_xs]}>{description}</Paragraph>
                                                                                    </>
                                                                                )}
                                                                            </Field>
                                                                        }

                                                                        {
                                                                            type === "dropdown" &&
                                                                            <Field name={name}
                                                                                   validate={req ? required : undefined}>
                                                                                {props => (
                                                                                    <>
                                                                                        <InputField
                                                                                            {...props}
                                                                                            label={name}
                                                                                            mode={'flat'}
                                                                                            list={Object.values(options).map((t: any) => assignOption(t, t))}
                                                                                            value={initdata.itemconfig[index].value}
                                                                                            selectedValue={props.input.value}
                                                                                            displaytype={'pagelist'}
                                                                                            inputtype={'dropdown'}
                                                                                            listtype={'other'}
                                                                                            onChange={(value: any) => {
                                                                                                props.input.onChange(value);
                                                                                                initdata.itemconfig[index].value = value
                                                                                            }}>
                                                                                        </InputField>
                                                                                        <Paragraph
                                                                                            style={[styles.paragraph, styles.text_xs]}>{description}</Paragraph>
                                                                                    </>

                                                                                )}
                                                                            </Field>
                                                                        }

                                                                        {
                                                                            type === 'checkbox' && <Field name={name}>
                                                                                {props => (
                                                                                    <><CheckBox
                                                                                        value={Boolean(initdata.itemconfig[index].value)}
                                                                                        label={name} onChange={(value: any) => {
                                                                                        values.itemconfig[index].value = value;
                                                                                    }}/>
                                                                                    </>
                                                                                )}
                                                                            </Field>
                                                                        }
                                                                    </>
                                                                }
                                                            </View>

                                                        })
                                                    }

                                                </View>
                                            </View>


                                            {isTypeProduct && <View>
                                                <View>

                                                    {<View style={[styles.fieldspace]}>
                                                        <Field name={'trackinventory'}>
                                                            {props => (<View style={{
                                                                marginLeft: -25,
                                                                marginTop: -10,
                                                                marginBottom: 5
                                                            }}><CheckBox
                                                                value={props.input.value}
                                                                label={'Track Inventory for this item'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}/></View>)}
                                                        </Field>
                                                        <Divider
                                                            style={[styles.divider]}/>
                                                    </View>}


                                                    {Boolean(values.trackinventory) && <>

                                                        {Boolean(values.trackinventory) && <View>
                                                            <Field name="inventorytype">
                                                                {props => (
                                                                    <InputField
                                                                        label={'Stock Valuation Method '}
                                                                        mode={'flat'}
                                                                        list={option_inventory}
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


                                                        {values.inventorytype === 'specificidentification' && <View>
                                                            <Field name="identificationtype" validate={required}>
                                                                {props => (
                                                                    <InputField
                                                                        label={'Unique serial number'}
                                                                        mode={'flat'}
                                                                        list={[{
                                                                            label: 'Auto',
                                                                            value: 'auto'
                                                                        }, {
                                                                            label: 'Manual',
                                                                            value: 'manual'
                                                                        }, {
                                                                            label: 'Ask On Place',
                                                                            value: 'askonplace'
                                                                        }]}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value)
                                                                        }}>
                                                                    </InputField>
                                                                )}
                                                            </Field>
                                                        </View>}

                                                        {values.inventorytype === 'fifo' && <>


                                                            <View>
                                                                <Field name="openingunitamount">
                                                                    {props => (
                                                                        <InputField
                                                                            value={props.input.value}
                                                                            label={'Opening Stock'}
                                                                            keyboardType='numeric'
                                                                            inputtype={'textbox'}
                                                                            onChange={props.input.onChange}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </View>


                                                            <View>
                                                                <Field name="openingstockrate">
                                                                    {props => (
                                                                        <InputField
                                                                            value={props.input.value}
                                                                            keyboardType='numeric'
                                                                            left={<TI.Affix text={getCurrencySign()}/>}
                                                                            label={'Opening Stock rate per unit'}
                                                                            inputtype={'textbox'}
                                                                            onChange={props.input.onChange}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </View>

                                                        </>}

                                                        {<View>
                                                            <Field name="inventoryaccount">
                                                                {props => (
                                                                    <InputField
                                                                        label={'Inventory Account  '}
                                                                        mode={'flat'}
                                                                        list={chartofaccount.filter((account: any) => {
                                                                            return account.accounttype === 'assets' && account.accountsubtype === 'Stock'
                                                                        }).map((t: any) => assignOption(t.accountname, t.accountid))}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value)
                                                                        }}>
                                                                    </InputField>
                                                                )}
                                                            </Field>
                                                        </View>}

                                                    </>}
                                                </View>
                                            </View>}

                                            <View>
                                                <View>


                                                    <TouchableOpacity
                                                        style={[styles.grid, styles.middle, styles.justifyContent]}
                                                        onPress={() => {
                                                            isShow = !isShow;
                                                            updateComponent(advanceRef, 'display', isShow ? 'flex' : 'none')
                                                        }}>
                                                        <Paragraph style={[styles.paragraph, styles.caption]}>
                                                            Advance
                                                        </Paragraph>
                                                        <Paragraph>
                                                            <ProIcon name={!isShow ? 'chevron-down' : 'chevron-up'}
                                                                     action_type={'text'} size={16}/>
                                                        </Paragraph>
                                                    </TouchableOpacity>

                                                    <View style={[{display: 'none'}]} ref={advanceRef}>


                                                        <View>

                                                            {onlyForIndia && isTypeProduct && isRetailIndustry &&
                                                                <View>
                                                                    <Field name="mrp"
                                                                           validate={composeValidators(mustBeNumber)}>
                                                                        {props => (
                                                                            <InputField
                                                                                {...props}
                                                                                value={props.input.value}
                                                                                label={'MRP'}
                                                                                keyboardType='numeric'
                                                                                inputtype={'textbox'}
                                                                                left={<TI.Affix
                                                                                    text={getCurrencySign()}/>}
                                                                                onChange={props.input.onChange}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </View>}


                                                            {onlyForIndia && onlyForRegistered && <View>
                                                                <Field name="defaultitc"
                                                                       validate={onlyForRegistered ? required : undefined}>
                                                                    {props => (
                                                                        <>
                                                                            <InputField
                                                                                {...props}
                                                                                label={`Default ITC (Input Tax Credit) Selection`}
                                                                                list={options_itc}
                                                                                mode={'flat'}
                                                                                value={props.input.value}
                                                                                selectedValue={props.input.value}
                                                                                displaytype={'pagelist'}
                                                                                inputtype={'dropdown'}
                                                                                listtype={'other'}
                                                                                onChange={(value: any) => {
                                                                                    appLog('value', value)
                                                                                    props.input.onChange(value)
                                                                                }}>
                                                                            </InputField>
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            </View>}


                                                            <View>
                                                                <Field name="outwardaccount">
                                                                    {props => (
                                                                        <InputField
                                                                            label={'Outward Account'}
                                                                            mode={'flat'}
                                                                            list={chartofaccount.filter((account: any) => {
                                                                                return account.accounttype === 'income'
                                                                            }).map((t: any) => assignOption(t.accountname, t.accountid))}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            listtype={'other'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value)
                                                                            }}>
                                                                        </InputField>
                                                                    )}
                                                                </Field>
                                                            </View>


                                                            <View>
                                                                <Field name="inwardaccount">
                                                                    {props => (
                                                                        <InputField
                                                                            label={'Inward Account '}
                                                                            mode={'flat'}
                                                                            list={chartofaccount.filter((account: any) => {
                                                                                return account.accounttype === 'expense'
                                                                            }).map((t: any) => assignOption(t.accountname, t.accountid))}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            listtype={'other'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value)
                                                                            }}>
                                                                        </InputField>
                                                                    )}
                                                                </Field>
                                                            </View>

                                                        </View>


                                                        {isTypeProduct && <View>


                                                            <View>
                                                                <View>


                                                                    <Field name="itemunit" validate={required}>
                                                                        {props => (
                                                                            <InputField
                                                                                {...props}
                                                                                label={'Purchase Unit'}
                                                                                mode={'flat'}
                                                                                list={option_units}
                                                                                value={props.input.value}
                                                                                selectedValue={props.input.value}
                                                                                displaytype={'pagelist'}
                                                                                inputtype={'dropdown'}
                                                                                listtype={'other'}
                                                                                onChange={(value: any) => {
                                                                                    props.input.onChange(value);
                                                                                    initdata.itemunit = value;
                                                                                    if (Boolean(initdata.itemunit)) {
                                                                                        let unittype = unit[initdata.itemunit] && unit[initdata.itemunit].unittype;
                                                                                        option_salesunit = Object.values(unit)
                                                                                            .filter((a: any) => Boolean(a) && a.unittype === unittype)
                                                                                            .map((a: any) => assignOption(`${a.unitname} (${a.unitcode})`, a.unitid))
                                                                                    }
                                                                                }}>
                                                                            </InputField>
                                                                        )}
                                                                    </Field>

                                                                    <View>
                                                                        <Field name="salesunit" validate={required}>
                                                                            {props => (
                                                                                <>
                                                                                    <InputField
                                                                                        {...props}
                                                                                        label={'Sales Unit'}
                                                                                        mode={'flat'}
                                                                                        list={option_salesunit}
                                                                                        value={props.input.value}
                                                                                        selectedValue={props.input.value}
                                                                                        displaytype={'pagelist'}
                                                                                        inputtype={'dropdown'}
                                                                                        listtype={'other'}
                                                                                        onChange={(value: any) => {
                                                                                            props.input.onChange(value)
                                                                                        }}>
                                                                                    </InputField>
                                                                                </>

                                                                            )}
                                                                        </Field>
                                                                    </View>

                                                                </View>
                                                            </View>

                                                        </View>}

                                                        {onlyForIndia && !onlyForRegistered &&
                                                            <Field name="itemhsncode">
                                                                {props => (
                                                                    <InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        keyboardType='numeric'
                                                                        label={`${isTypeService ? "SAC" : "HSN"} Code `}
                                                                        onChange={props.input.onChange}
                                                                        inputtype={'textbox'}
                                                                    />
                                                                )}
                                                            </Field>
                                                        }

                                                        {!isTypeService && <View>
                                                            <Field name="purchasecost">
                                                                {props => (
                                                                    <InputField
                                                                        value={props.input.value}
                                                                        label={'Cost Price'}
                                                                        keyboardType='numeric'
                                                                        inputtype={'textbox'}
                                                                        left={<TI.Affix text={getCurrencySign()}/>}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </View>}


                                                    </View>

                                                </View>
                                            </View>

                                        </View>
                                    </View>

                                </KeyboardScroll>


                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Add </Button>
                                    </View>
                                </KAccessoryView>

                            </View>
                        </View>

                    </>
                )}
            />

        </Container>

    )

}


export default Index;


