import React from "react";
import {ScrollView, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";

import {setDialog} from "../../redux-store/reducer/component";
import {composeValidators, countrylist, loginUrl, METHOD, mustBeNumber, required, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import InputField from "../../components/InputField";
import {Button, Container} from "../../components";
import KAccessoryView from "../../components/KAccessoryView";


const Index = (props: any) => {

    const {route} = props

    const dispatch = useDispatch();
    const initdata = route.params.initdata;
    const updateWhatsapp = route.params.updateWhatsapp;

    const country: any = countrylist.find((item: any) => {
        return item.code === initdata.country
    })

    const handleSubmit = (values: any) => {

        apiService({
            method: METHOD.PUT,
            action: 'verifywhatsapp',
            other: {url: loginUrl},
            body: values
        }).then((result) => {

            if (result.status === STATUS.SUCCESS) {
                updateWhatsapp(values)
                props.navigation.goBack()
                //dispatch(setDialog({visible: false}))
            }

        });
    }


    return   <Container    style={styles.bg_white}>


        <Form
            initialValues={{country:  initdata.country,code:country.dial_code}}
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                <View style={[styles.middle]}>
                    <View style={[styles.middleForm, {maxWidth: 400,}]}>

                        <ScrollView>



                            <Card style={[styles.card]}>
                                <Card.Content style={[styles.cardContent]}>
                                    <View style={[styles.mt_5]}>
                                        <View>
                                            <Field name="country" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Country'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Country"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={countrylist.map((item) => {
                                                            return {label: item.name, value: item.code}
                                                        })}
                                                        onChange={(value: any) => {
                                                            const country: any = countrylist.find((item: any) => {
                                                                return item.code === value
                                                            })
                                                            values.code = country.dial_code;
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[styles.mt_5]}>
                                            <View>

                                                <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                    <View>
                                                        <InputField
                                                            {...props}
                                                            inputtype={'textbox'}
                                                            label={'Code'}
                                                            editable={false}
                                                            value={'+' + values.code}
                                                            onChange={(value: any) => {

                                                            }}
                                                        />
                                                    </View>
                                                    <Field name="whatsapp_number"
                                                           validate={composeValidators(required, mustBeNumber)}>
                                                        {props => (
                                                            <View style={[styles.w_auto, styles.ml_2]}>
                                                                <InputField
                                                                    {...props}

                                                                    keyboardType={'number-pad'}
                                                                    label={'Mobile'}
                                                                    returnKeyType={'go'}
                                                                    inputtype={'textbox'}
                                                                    onSubmitEditing={(e: any) => {
                                                                        values.whatsapp_number = values.code  + values.whatsapp_number
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
                                </Card.Content>
                            </Card>
                        </ScrollView>

                        <KAccessoryView>
                            <View style={[styles.w_100]}>

                                <Button onPress={() => {
                                    values.whatsapp_number = values.code  + values.whatsapp_number
                                        handleSubmit(values)
                                }}>Update</Button>
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


export default withTheme(Index);







