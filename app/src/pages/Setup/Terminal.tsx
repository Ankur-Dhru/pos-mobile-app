import React, {useCallback, useEffect} from "react";

import {ScrollView, View} from "react-native";
import Container from "../../components/Container";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Caption, Card} from "react-native-paper";
import {
    ACTIONS,
    composeValidators, db,
    defaultInputAmounts,
    defaultInputValues,
    localredux,
    METHOD,
    required,
    STATUS,
    urls
} from "../../libs/static";
import Button from "../../components/Button";
import {useDispatch} from "react-redux";
import apiService from "../../libs/api-service";
import {
    appLog,
    base64Encode, createDatabaseName,
    findObject, getStateAndTaxType,
    isEmpty,
    retrieveData, saveDatabaseName,
    saveLocalSettings,
    selectItemObject,
    storeData,
    syncData,
    updateToken
} from "../../libs/function";
import InputField from "../../components/InputField";
import KAccessoryView from "../../components/KAccessoryView"
import {createTables} from "../../libs/Sqlite";

const Terminal = (props: any) => {


    const dispatch = useDispatch();

    const {navigation, theme}: any = props;
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
            token: authData.token,
            other: {url: urls.adminUrl},
        }).then(async (response: any) => {

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {


                const licensedata = {
                    data: response.data,
                    token: response.token
                }

                const locations = initData?.location;


                localredux.licenseData = {
                    ...localredux.licenseData,
                    ...licensedata
                }

                saveLocalSettings("defaultInputValues", defaultInputValues).then()
                saveLocalSettings("defaultInputAmounts", defaultInputAmounts).then();

                db.name =  createDatabaseName({workspace:initData.workspace,locationid:values?.locationid});

                await saveDatabaseName(db.name).then();

                await createTables().then();

                await getStateAndTaxType(initData.general?.country).then()

                await retrieveData(db.name).then(async (data: any) => {
                    let localSettingsData = data?.localSettingsData || {};
                    data = {
                        ...data,
                        localSettingsData: {
                            ...localSettingsData,
                            statelist: localredux?.statelist,
                            taxtypelist: localredux?.taxtypelist,
                            currentLocation: locations[values?.locationid],
                            isRestaurant: isRestaurant,
                            terminalname: values.terminalname
                        }
                    }

                    storeData(db.name, {
                        ...data,
                        initData,
                        authData,
                        localSettingsData,
                        licenseData: localredux.licenseData,
                        theme,
                        itemsData: {},
                        addonsData: {},
                        orders: {},
                        clientsData: {},
                    }).then(async () => {
                        await updateToken(response.token);
                        await syncData();
                        navigation.replace('PinStackNavigator');
                    });
                })


            }
        })
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

    if (locationList.length === 1) {
        locationid = locationList[0].value
    }

    const initialValues = {
        timezone: defaultTimeZone?.value,
        terminalname: initData?.deviceName,
        locationid: locationid
    }


    return <Container>

        <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}

            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View style={[styles.middle,]}>
                        <View style={[styles.middleForm]}>


                            <ScrollView>

                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>
                                        <View>
                                            <Caption style={[styles.caption]}>{initData.workspace}  </Caption>

                                            <View style={[styles.mt_3]}>
                                                <View style={[styles.mb_5]}>
                                                    <Field name="terminalname" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Terminal Name'}
                                                                inputtype={'textbox'}
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
                                                                label={'Location'}
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

                                                {/*<View>
                                            <Field name="timezone">
                                                {props => (
                                                    <InputField
                                                        label={'Time Zone'}
                                                        mode={'flat'}
                                                        list={itemList}
                                                        value={props.input.value}
                                                        selectedValue={props.input.value}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        listtype={'other'}
                                                        onChange={(value: any) => {
                                                            console.log('value', value)
                                                            props.input.onChange(value);
                                                        }}>
                                                    </InputField>
                                                )}
                                            </Field>
                                        </View>*/}

                                            </View>
                                        </View>

                                    </Card.Content>
                                </Card>


                            </ScrollView>


                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button more={{color: 'white'}} disable={more.invalid} secondbutton={more.invalid}
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}> Finish
                                    </Button>
                                </View>
                            </KAccessoryView>

                        </View>
                    </View>

                </>
            )}
        >

        </Form>


    </Container>
}

export default Terminal;
