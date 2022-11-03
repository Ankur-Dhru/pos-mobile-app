import React from "react";

import {SafeAreaView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Title} from "react-native-paper";
import {ACTIONS, adminUrl, composeValidators, localredux, METHOD, required, STATUS} from "../../libs/static";
import Button from "../../components/Button";
import {useDispatch} from "react-redux";
import apiService from "../../libs/api-service";
import {isEmpty, syncData} from "../../libs/function";
import InputField from "../../components/InputField";
import {setModal} from "../../redux-store/reducer/component";
import {v4 as uuid} from "uuid";


const AddTable = ({getOrder}: any) => {

    const {initData, authData, localSettingsData}: any = localredux;
    const dispatch = useDispatch()

    const handleSubmit = async (values: any) => {

        const currentLocation = localSettingsData.currentLocation;
        currentLocation.tables.push(values);

        apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            workspace: initData.workspace,
            token: authData?.token,
            other: {url: adminUrl},
            body: {settingid: 'location', settingdata: [{"key": currentLocation.locationid, "value": currentLocation}]}
        }).then((result) => {
            if (result.status === STATUS.SUCCESS && !isEmpty(result.data)) {
                syncData(false)
                getOrder()
                dispatch(setModal({visible: false}))
            }
        });
    }


    const initialValues = {
        tableid: uuid(),
        ordertype: 'table',
        area: 'Default',
        tablename: '',
        paxes: '',
    }


    return <SafeAreaView><View style={[styles.h_100, styles.middle]}>


        <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}

            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.h_100, styles.middleForm, {maxWidth: 360}]}>
                    <KeyboardScroll>

                        <Title style={[styles.mt_5]}>Add Table </Title>

                        <View>
                            <View>


                                <View style={[styles.mt_3]}>
                                    <View style={[styles.mb_5]}>
                                        <Field name="tablename" validate={composeValidators(required)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Table Name'}
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

                                    <View style={[styles.mb_5]}>
                                        <Field name="paxes" validate={composeValidators(required)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Paxes'}
                                                    value={props.input.value}
                                                    keyboardType={'numpad'}
                                                    inputtype={'textbox'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value)
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>


                                </View>


                            </View>
                        </View>

                        <View style={[styles.grid, styles.justifyContent]}>
                            <View style={[styles.w_auto]}>
                                <Button more={{backgroundColor: styles.light.color, color: 'black'}}
                                        onPress={() => {
                                            dispatch(setModal({visible: false}))
                                        }}> Cancel
                                </Button>
                            </View>
                            <View style={[styles.w_auto, styles.ml_2]}>
                                <Button disable={more.invalid} secondbutton={more.invalid}
                                        onPress={() => {
                                            handleSubmit(values)
                                        }}> Add
                                </Button>
                            </View>
                        </View>
                    </KeyboardScroll>

                </View>
            )}
        >

        </Form>


    </View>
    </SafeAreaView>
}

export default AddTable;
