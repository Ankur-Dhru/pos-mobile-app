import React from "react";

import {SafeAreaView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Appbar, Title} from "react-native-paper";
import {ACTIONS, adminUrl, composeValidators, localredux, METHOD, required, STATUS} from "../../libs/static";
import Button from "../../components/Button";
import {useDispatch} from "react-redux";
import apiService from "../../libs/api-service";
import {isEmpty, syncData} from "../../libs/function";
import InputField from "../../components/InputField";
import {setModal, setPageSheet} from "../../redux-store/reducer/component";
import {v4 as uuid} from "uuid";
import KAccessoryView from '../../components/KAccessoryView';


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


    return  <View style={[styles.h_100]}>


        <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}

            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View  style={[styles.h_100]}>

                    <Appbar.Header style={[styles.bg_white]}>
                        <Appbar.BackAction    onPress={() => {dispatch(setModal({visible:false}))} }/>
                        <Appbar.Content  title={'Add Table'}   />
                    </Appbar.Header>

                    <KeyboardScroll>

                        <View style={[styles.p_6]}>
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


                    </KeyboardScroll>

                    <KAccessoryView>
                        <View style={[styles.grid, styles.justifyContent,styles.p_5]}>
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
                    </KAccessoryView>

                </View>
            )}
        >

        </Form>


    </View>

}

export default AddTable;
