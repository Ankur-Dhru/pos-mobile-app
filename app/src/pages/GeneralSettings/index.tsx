import React, {useEffect, useState} from "react";
import {Dimensions, ScrollView, View} from "react-native";
import {Card, RadioButton, ToggleButton} from "react-native-paper"
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import CheckBox from "../../components/CheckBox";
import {Field, Form} from "react-final-form";

import {appLog, getLocalSettings, nextFocus, retrieveData, saveLocalSettings, setAPIUrl} from "../../libs/function";
import {setSettings} from "../../redux-store/reducer/local-settings-data";
import InputField from "../../components/InputField";

import {device, localredux, required} from "../../libs/static";


const Index = () => {

    const dispatch = useDispatch();


    const {terminal_name}: any = localredux.licenseData.data;


    let [initdata, setInitdata]: any = useState({disabledDefaultSourceHomeDelivery: false, disabledDefaultSourceTakeAway: false, betamode: false,disabledpax:false,kotongenerateinvoice:'Enable',advancecartview:false,terminalname:terminal_name})

    const [loading, setLoading]: any = useState(false);

    const {height, width} = Dimensions.get('window');
    const aspectRatio = height / width;


    useEffect(() => {
         retrieveData(`fusion-dhru-pos-settings`).then(async (data: any) => {
            setInitdata(data);
            setLoading(true);
        })
    }, [])

    const handleSubmit = () => {

    }

    if (!loading) {
        return <></>
    }

    return <Container>

        <Form
            initialValues={initdata}
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.middle]}>
                    <View style={[styles.middleForm,styles.px_5,{maxWidth:400}]}>

                        <ScrollView>



                                <Field name="disabledDefaultSourceHomeDelivery">
                                    {props => (
                                        <><CheckBox
                                            value={props.input.value}
                                            label={'Order sources optional for Homedelivery'}
                                            onChange={(value: any) => {
                                                initdata = {
                                                    ...initdata,
                                                    disabledDefaultSourceHomeDelivery: value
                                                }
                                                dispatch(setSettings(initdata));
                                                saveLocalSettings("disabledDefaultSourceHomeDelivery", value).then();
                                            }}
                                        /></>
                                    )}
                                </Field>


                                <Field name="disabledDefaultSourceTakeAway">
                                    {props => (
                                        <><CheckBox
                                            value={props.input.value}
                                            label={'Order sources optional for Takeaway'}
                                            onChange={(value: any) => {
                                                initdata = {
                                                    ...initdata,
                                                    disabledDefaultSourceTakeAway: value
                                                }
                                                dispatch(setSettings(initdata));
                                                saveLocalSettings("disabledDefaultSourceTakeAway", value).then();
                                            }}
                                        /></>
                                    )}
                                </Field>

                                <Field name="disabledpax">
                                    {props => (
                                        <><CheckBox
                                            value={props.input.value}
                                            label={'Disable Paxes'}
                                            onChange={(value: any) => {
                                                initdata = {
                                                    ...initdata,
                                                    disabledpax: value
                                                }
                                                dispatch(setSettings(initdata));
                                                saveLocalSettings("disabledpax", value).then();
                                            }}
                                        /></>
                                    )}
                                </Field>





                            {aspectRatio <= 1.6 &&  <Field name="advancecartview">
                                {props => (
                                    <><CheckBox
                                        value={props.input.value}
                                        label={'Advance Cart View'}
                                        onChange={(value: any) => {
                                            initdata = {
                                                ...initdata,
                                                advancecartview: value
                                            }
                                            dispatch(setSettings(initdata));
                                            saveLocalSettings("advancecartview", value).then();
                                        }}
                                    /></>
                                )}
                            </Field>}


                            <Field name="betamode">
                                {props => (
                                    <><CheckBox
                                        value={props.input.value}
                                        label={'Enable Beta Mode'}
                                        onChange={(value: any) => {
                                            initdata = {
                                                ...initdata,
                                                betamode: value
                                            }
                                            setAPIUrl(value)
                                            dispatch(setSettings(initdata));
                                            saveLocalSettings("betamode", value).then();
                                        }}
                                    /></>
                                )}
                            </Field>

                                <View style={[styles.mt_5]}>
                                    <Field name="kotongenerateinvoice">
                                        {props => {
                                            return (<>
                                                <InputField
                                                    label={'KOT print on generate Invoice'}
                                                    divider={true}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'dropdown'}
                                                    list={[
                                                        {value: 'Enable',label: 'Enable'},
                                                        {value: 'Disable', label: 'Disable'},
                                                        {value: 'Ask On Place', label: 'Ask On Place'}
                                                    ]}
                                                    search={false}
                                                    listtype={'other'}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        initdata = {
                                                            ...initdata,
                                                            kotongenerateinvoice: value
                                                        }
                                                        dispatch(setSettings(initdata));
                                                        saveLocalSettings("kotongenerateinvoice", value).then();
                                                    }}
                                                />
                                            </>)
                                        }}
                                    </Field>
                                </View>


                                {/*<View>
                                    <Field name="terminalname" validate={required}>
                                        {props => {
                                            return (<>
                                                <InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'Terminal name'}
                                                    inputtype={'textbox'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            </>)
                                        }}
                                    </Field>
                                </View>*/}

                        </ScrollView>

                        {/*<KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button more={{color: 'white'}} disable={more.invalid}
                                        secondbutton={more.invalid} onPress={() => {
                                    handleSubmit(values)
                                }}> Save </Button>
                            </View>
                        </KAccessoryView>*/}

                    </View>

                </View>

            )}
        >

        </Form>


    </Container>

}


const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(Index);

