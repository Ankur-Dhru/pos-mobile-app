import React from "react";
import dataContainer from "../../hoc/dataContainer";

import {View} from "react-native";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Card} from "react-native-paper";
import {ACTIONS, composeValidators, localredux, METHOD, posUrl, required, STATUS} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import {useDispatch} from "react-redux";
import apiService from "../../libs/api-service";
import {appLog, findObject, isEmpty, selectItemObject, storeData, syncData} from "../../libs/function";
import {setLicenseData} from "../../redux-store/reducer/license-data";
import InputField from "../../components/InputField";

const Terminal = (props: any) => {


    const dispatch = useDispatch();

    const {navigation,theme}: any = props;
    const {initData, authData}: any = localredux;


    const handleSubmit = async (values: any) => {


        const location = findObject(locationList, 'value', values.locationid, true)
        const isRestaurant = (location.industrytype === "foodservices");

        values = {...values, timezone: values?.timezone, locationid: values?.locationid}

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.TERMINAL,
            body: values,
            workspace: initData.workspace,
            token: props?.authData?.token,
            other: {url: posUrl},
        }).then(async (response: any) => {

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                const licensedata = {
                    data: response.data,
                    token: response.token
                }

                const locations = initData?.location;
                const localSettingsData = {
                    currentLocation:locations[values?.locationid],
                     isRestaurant:isRestaurant
                }

                localredux.licenseData = licensedata;

                storeData('fusion-pro-pos-mobile', {
                    initData,
                    authData,
                    localSettingsData,
                    licenseData: licensedata,
                    theme,
                    itemsData: {},
                    addonsData: {},
                    orders: {},
                    clientsData: {}
                }).then(async () => {
                    await syncData();
                    navigation.replace('PinStackNavigator');
                });

            }
        })
    }

    const onValidate = (values: any) => {
        let error: any = {};
        if (!Boolean(values?.terminalname)) {
            error.terminalname = "Please Location Name!";
        }
        if (!Boolean(values?.timezone)) {
            error.timezone = "Please Select Timezone!";
        }

        if (!Boolean(values?.locationid)) {
            error.locationid = "Please Select Location!";
        }

        return error;
    }

    let defaultTimeZone = {};
    let locationid = '';

    let itemList: any = isEmpty(initData?.staticdata?.timezone) ? [] :
        Object.keys(initData?.staticdata?.timezone)
            .map((key: any, index: number) => {
                let options = selectItemObject(initData?.staticdata?.timezone[key], key, index + 1);
                if (key === "Asia/Kolkata") {
                    defaultTimeZone = options;
                }
                return options
            });

    let locationList: any = isEmpty(initData?.location) ? [] :
        Object.keys(initData?.location)
            .map((key: any, index: number) => selectItemObject(initData?.location[key].locationname, key, index + 1, initData?.location[key]));

    if(locationList.length === 1){
        locationid = locationList[0].value
    }

    const initialValues = {
        timezone: defaultTimeZone?.value,
        terminalname: initData?.deviceName,
        locationid:locationid
    }



    return <Container config={{title: 'Terminal', subtitle: initData.workspace}}>

        <Card style={[styles.h_100]}>

            <Form
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validate={onValidate}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <>

                        <KeyboardScroll>
                            <View>


                                <View style={[styles.px_5]}>


                                    <View style={[styles.mt_3]}>
                                        <View style={[styles.mb_5]}>
                                            <Field name="terminalname" validate={composeValidators(required)}>
                                                {props => (
                                                    <InputBox
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'Terminal Name'}
                                                        autoFocus={true}
                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[styles.mb_5]}>
                                            <Field name="locationid">
                                                {props => (
                                                    <InputField
                                                        label={'Select Location'}
                                                        mode={'flat'}
                                                        list={locationList}
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
                                        </View>

                                        <View>
                                            <Field name="timezone">
                                                {props => (
                                                    <InputField
                                                        label={'Select Time Zone'}
                                                        mode={'flat'}
                                                        list={itemList}
                                                        value={props.input.value}
                                                        selectedValue={props.input.value}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        listtype={'other'}
                                                        onChange={(value: any) => {
                                                            console.log('value',value)
                                                            props.input.onChange(value);
                                                        }}>
                                                    </InputField>
                                                )}
                                            </Field>
                                        </View>


                                    </View>


                                </View>
                            </View>
                        </KeyboardScroll>


                        <View style={[styles.submitbutton]}>
                            <Button disable={more.invalid} secondbutton={more.invalid}
                                    onPress={() => {
                                        handleSubmit(values)
                                    }}> Finish
                            </Button>
                        </View>
                    </>
                )}
            >

            </Form>
        </Card>

    </Container>
}

export default  Terminal;
