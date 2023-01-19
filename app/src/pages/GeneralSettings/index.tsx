import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Card} from "react-native-paper"
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import CheckBox from "../../components/CheckBox";
import {Field, Form} from "react-final-form";

import {getLocalSettings, retrieveData, saveLocalSettings, setAPIUrl} from "../../libs/function";
import {setSettings} from "../../redux-store/reducer/local-settings-data";
import InputField from "../../components/InputField";


const Index = () => {

    const dispatch = useDispatch();
    let [initdata, setInitdata]: any = useState({disabledDefaultSourceHomeDelivery: false, disabledDefaultSourceTakeAway: false, betamode: false,disabledpax:false,kotongenerateinvoice:'Enable'})

    const [loading, setLoading]: any = useState(false)


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
                    <View style={[styles.middleForm]}>


                        <Card style={[styles.card]}>
                            <Card.Content style={[styles.cardContent]}>

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


                                <View>
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


                            </Card.Content>
                        </Card>


                        <Card style={[styles.card]}>
                            <Card.Content style={[styles.cardContent]}>

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

                            </Card.Content>
                        </Card>

                    </View>

                </View>

            )}
        >

        </Form>


    </Container>

}


const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(Index);

