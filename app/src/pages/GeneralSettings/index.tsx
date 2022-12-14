import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Card} from "react-native-paper"
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import CheckBox from "../../components/CheckBox";
import {Field, Form} from "react-final-form";

import {getLocalSettings, saveLocalSettings, setAPIUrl} from "../../libs/function";


const Index = () => {

    const dispatch = useDispatch();
    let [initdata, setInitdata]: any = useState({homedelivery: false, takeaway: false, betamode: false})

    const [loading, setLoading]: any = useState(false)


    useEffect(() => {
        getLocalSettings('generalsettings').then(r => {
            setInitdata(r);
            setLoading(true)
        });

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

                                <Field name="homedelivery">
                                    {props => (
                                        <><CheckBox
                                            value={props.input.value}
                                            label={'Order sources optional for Homedelivery'}
                                            onChange={(value: any) => {
                                                initdata = {
                                                    ...initdata,
                                                    homedelivery: value
                                                }
                                                saveLocalSettings("generalsettings", initdata).then();
                                            }}
                                        /></>
                                    )}
                                </Field>


                                <Field name="takeaway">
                                    {props => (
                                        <><CheckBox
                                            value={props.input.value}
                                            label={'Order sources optional for Takeaway'}
                                            onChange={(value: any) => {
                                                initdata = {
                                                    ...initdata,
                                                    takeaway: value
                                                }
                                                saveLocalSettings("generalsettings", initdata).then();
                                            }}
                                        /></>
                                    )}
                                </Field>


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
                                                saveLocalSettings("generalsettings", initdata).then();
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

