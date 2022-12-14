import React from "react";

import {View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {ACTIONS, composeValidators, localredux, METHOD, required, STATUS, urls} from "../../libs/static";
import Button from "../../components/Button";
import apiService from "../../libs/api-service";
import {isEmpty, syncData} from "../../libs/function";
import InputField from "../../components/InputField";
import {v4 as uuid} from "uuid";
import KAccessoryView from '../../components/KAccessoryView';
import {Container} from "../../components";
import {useNavigation} from "@react-navigation/native";
import {Card} from "react-native-paper";


const AddTable = (props: any) => {

    const {initData, authData, localSettingsData}: any = localredux;
    const navigation: any = useNavigation();

    const getOrder = props?.route?.params?.getOrder;

    const handleSubmit = async (values: any) => {

        const currentLocation = localSettingsData.currentLocation;
        currentLocation.tables.push(values);

        apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            workspace: initData.workspace,
            token: authData?.token,
            other: {url: urls.posUrl},
            body: {settingid: 'location', settingdata: [{"key": currentLocation.locationid, "value": currentLocation}]}
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS && !isEmpty(result.data)) {
                syncData(false).then()
                if (Boolean(getOrder)) {
                    await getOrder()
                }
                navigation.goBack()
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


    return <Container>

        <View style={[styles.middle,]}>
            <View style={[styles.middleForm]}>
                <Form
                    initialValues={initialValues}
                    onSubmit={handleSubmit}

                    render={({handleSubmit, submitting, values, ...more}: any) => (

                        <>


                            <KeyboardScroll>

                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>

                                        <View>
                                            <View>
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

                                            <View>
                                                <Field name="paxes" validate={composeValidators(required)}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Paxes'}
                                                            value={props.input.value}
                                                            keyboardType={'numeric'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>


                                        </View>


                                    </Card.Content>
                                </Card>


                            </KeyboardScroll>


                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button more={{color: 'white'}} disable={more.invalid} secondbutton={more.invalid}
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}> Add
                                    </Button>
                                </View>
                            </KAccessoryView>
                        </>
                    )}
                >

                </Form>

            </View>

        </View>

    </Container>

}

export default AddTable;
