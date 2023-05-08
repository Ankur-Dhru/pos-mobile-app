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
import {appLog} from "../../libs/function";


const Index = (props: any) => {


    const dispatch = useDispatch()

    const handleSubmit = (values: any) => {

        apiService({
            method: METHOD.PUT,
            action: 'verifyemail',
            other: {url: loginUrl},
            body: values
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                console.log('values.new_email',values.new_email)
                props.updateEmail(values.new_email)
                dispatch(setDialog({visible: false}))
            }

        });
    }


    return <View>
        <Form
            initialValues={{new_email: ''}}
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View>

                        <Field name="new_email">
                            {props => (
                                <InputBox
                                    value={props.input.value}
                                    label={'Change Email'}
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







