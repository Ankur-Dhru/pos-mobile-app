import React from "react";
import {View} from "react-native";
import {withTheme} from "react-native-paper";
import {useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import Button from "../../components/Button";
import {setDialog} from "../../redux-store/reducer/component";
import {loginUrl, METHOD, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";


const Index = (props: any) => {


    const dispatch = useDispatch()

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
            initialValues={{whatsapp_number: ''}}
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View>

                        <Field name="whatsapp_number">
                            {props => (
                                <InputBox
                                    value={props.input.value}
                                    label={'Change Whatsapp Number'}
                                    autoFocus={true}
                                    autoCapitalize='none'
                                    onSubmitEditing={(e: any) => {
                                        handleSubmit(props.values)
                                    }}
                                    returnKeyType={'go'}
                                    onChange={props.input.onChange}
                                />
                            )}
                        </Field>

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







