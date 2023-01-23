import React, {memo, useRef} from "react";
import {View} from "react-native";
import {withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";

import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";
import {Container} from "../../components";
import {connect, useDispatch} from "react-redux";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";
import {Field, Form} from "react-final-form";
import {nextFocus} from "../../libs/function";


const Index = (props: any) => {

    const commonkotnote = props.commonkotnote;
    const vouchernotes = props.vouchernotes;
    const vehicleno = props.vehicleno;

    let inputRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const dispatch: any = useDispatch();
    const navigation: any = useNavigation()


    const initialValues = {
        commonkotnote: commonkotnote,
        vouchernotes: vouchernotes,
        vehicleno: vehicleno,
    }

    const handleSubmit = async (values: any) => {
        dispatch(updateCartField(values))
        navigation.goBack()
    }

    return (
        <Container style={styles.bg_white}>

            <Form
                onSubmit={handleSubmit}
                initialValues={initialValues}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View style={[styles.middle,]}>
                        <View style={[styles.middleForm, {maxWidth: 400,}]}>
                            <KeyboardScroll>


                                <View>
                                    <Field name="vehicleno">
                                        {props => (
                                            <InputField
                                                {...props}
                                                returnKeyType={'next'}
                                                onSubmitEditing={() => nextFocus(inputRef[0])}
                                                label={'Vehicle No'}
                                                inputtype={'textbox'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>


                                <View>
                                    <Field name="vouchernotes">
                                        {props => (
                                            <InputField
                                                {...props}
                                                returnKeyType={'next'}
                                                onSubmitEditing={() => nextFocus(inputRef[0])}
                                                label={'Client Note'}
                                                inputtype={'textbox'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>

                                <View>
                                    <Field name="commonkotnote">
                                        {props => (
                                            <InputField
                                                {...props}
                                                returnKeyType={'go'}
                                                label={'Common KOT Note'}
                                                inputtype={'textbox'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>


                            </KeyboardScroll>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid}
                                            more={{color: 'white'}}
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}> Continue
                                    </Button>
                                </View>
                            </KAccessoryView>
                        </View>
                    </View>
                )}
            >

            </Form>

        </Container>
    );
}


const mapStateToProps = (state: any) => ({
    vehicleno:state.cartData.vehicleno,
    vouchernotes:state.cartData.vouchernotes,
    commonkotnote:state.cartData?.commonkotnote,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
