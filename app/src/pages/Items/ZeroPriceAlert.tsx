import React from "react";
import {View} from "react-native";
import {withTheme} from "react-native-paper";
import {useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import Button from "../../components/Button";
import {setDialog} from "../../redux-store/reducer/component";
import {appLog, selectItem} from "../../libs/function";


const Index = (props: any) => {

    const item = props.item
    const dispatch = useDispatch()

    const handleSubmit = (values: any) => {

        const pricingtype = item?.pricing?.type;
        item.pricing.price.default[0] = {[pricingtype]:{baseprice:values.price}};
        selectItem(item).then(()=>{
            dispatch(setDialog({visible: false}))
        });

    }


    return <View>
        <Form
            initialValues={{price: ''}}
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View>

                        <Field name="price">
                            {props => (
                                <InputBox
                                    value={props.input.value}
                                    label={'Item Price'}
                                    autoFocus={true}
                                    keyboardType={'numeric'}
                                    onSubmitEditing={(e: any) => {
                                        handleSubmit(props.values)
                                    }}
                                    returnKeyType={'go'}
                                    onChange={props.input.onChange}
                                />
                            )}
                        </Field>

                    </View>


                    <View style={[styles.mt_5]}>
                        <Button onPress={() => {
                            handleSubmit(values)
                        }}>Done</Button>
                    </View>

                </>
            )}
        >
        </Form>
    </View>


}


export default withTheme(Index);







