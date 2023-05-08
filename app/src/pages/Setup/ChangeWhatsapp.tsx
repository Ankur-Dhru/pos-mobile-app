import React from "react";
import {View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";

import {setDialog} from "../../redux-store/reducer/component";
import {composeValidators, countrylist, loginUrl, METHOD, mustBeNumber, required, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import InputField from "../../components/InputField";
import {Button, Container} from "../../components";


const Index = (props: any) => {


    const dispatch = useDispatch();
    const initdata = props.initdata;


    const handleSubmit = (values: any) => {

        apiService({
            method: METHOD.PUT,
            action: 'verifywhatsapp',
            other: {url: loginUrl},
            body: values
        }).then((result) => {

            if (result.status === STATUS.SUCCESS) {
                props.updateWhatsapp(values.whatsapp_number)
                dispatch(setDialog({visible: false}))
            }

        });
    }


    return <View>
        <Form
            initialValues={{whatsapp_number:  initdata.whatsapp_number}}
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View>

                        <View style={[styles.mt_5]}>
                            <View>

                                <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                    {/*<View>
                                        <InputField
                                            {...props}

                                            inputtype={'textbox'}
                                            editable={true}
                                            value={'+' + values.code}
                                            onChange={(value: any) => {

                                            }}
                                        />
                                    </View>*/}
                                    <Field name="whatsapp_number"
                                           validate={composeValidators(required, mustBeNumber)}>
                                        {props => (
                                            <View style={[styles.w_auto]}>
                                                <InputField
                                                    {...props}

                                                    keyboardType={'number-pad'}
                                                    label={'Mobile'}
                                                    returnKeyType={'go'}
                                                    inputtype={'textbox'}
                                                    onSubmitEditing={(e: any) => {
                                                        handleSubmit(values)
                                                    }}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            </View>
                                        )}
                                    </Field>
                                </View>
                            </View>
                        </View>




                    </View>


                    <View style={[styles.grid, styles.justifyContent, styles.mt_5]}>
                        <Button more={{backgroundColor:styles.light.color,color:'black'}}
                                onPress={() => dispatch(setDialog({visible: false}))}>Cancel</Button>
                        <Button onPress={() => {
                            handleSubmit(values)
                        }}>Update</Button>
                    </View>

                </>
            )}
        >
        </Form>
    </View>


}


export default withTheme(Index);







