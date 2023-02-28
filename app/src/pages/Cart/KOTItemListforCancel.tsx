import React, {memo} from "react";
import {ScrollView, View} from "react-native";
import {Caption, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import CheckBox from "../../components/CheckBox";
import {Field, Form} from "react-final-form";
import Button from "../../components/Button";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {appLog, clone} from "../../libs/function";


const Index = memo((props: any) => {

    let {kot, cancelKOTDialog}: any = props;
    const {ticketitems}: any = clone(kot);

    const dispatch = useDispatch()

    const handleSubmit = (values: any) => {
        dispatch(setBottomSheet({visible: false}))
        cancelKOTDialog({...kot,...values});
    }

    return (
        <View style={[{minWidth: '100%',}]}>

            <Form
                initialValues={{ticketitems}}
                onSubmit={handleSubmit}
                render={({handleSubmit, submitting, values, ...more}: any) => (

                    <View>

                        <Caption style={[styles.caption, styles.px_6]}>KOT : {kot.kotid}</Caption>

                        <ScrollView>

                            <View style={[styles.mt_2,styles.px_5]}>
                                {
                                    values?.ticketitems?.filter((item: any) => {
                                        return true
                                    })?.map((item: any, index: any) => {


                                        return <View key={index}>
                                            <Field name={`ticketitems[${index}].selected`}>
                                                {props => (
                                                    <><CheckBox
                                                        disabled={item.cancelled}
                                                        value={props.input.value}
                                                        label={`${item.productdisplayname}`}
                                                        onChange={(value: any) => {
                                                            more.form.change(`ticketitems[${index}].selected`, value);
                                                        }}
                                                    /></>
                                                )}
                                            </Field>

                                        </View>
                                    })
                                }
                            </View>

                        </ScrollView>

                        <View style={[styles.submitbutton, styles.px_5, styles.mb_3]}>
                            {<View style={[styles.grid, styles.justifyContent]}>
                                <View style={[styles.w_auto]}>
                                    <Button disable={more.invalid}
                                            more={{color: 'black', backgroundColor: styles.secondary.color, height: 50}}
                                            secondbutton={true} onPress={() => {
                                        dispatch(setBottomSheet({visible: false}))
                                    }}> Close </Button>
                                </View>

                                <View style={[styles.w_auto, styles.ml_2]}>
                                    <Button more={{color: 'white', backgroundColor: styles.red.color, height: 50}}
                                            disable={more.invalid} secondbutton={more.invalid}
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}> Cancel Items
                                    </Button>
                                </View>

                            </View>}
                        </View>

                    </View>

                )}
            >

            </Form>
        </View>
    );
}, (r1, r2) => {
    return r1.item === r2.item;
})

const mapStateToProps = (state: any) => ({
    kots: state.cartData.kots,
})
export default connect(mapStateToProps)(withTheme(Index));
