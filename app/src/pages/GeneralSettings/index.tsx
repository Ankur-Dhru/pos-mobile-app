import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Card} from "react-native-paper"
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import CheckBox from "../../components/CheckBox";
import {Field, Form} from "react-final-form";

import {appLog, getLocalSettings, saveLocalSettings} from "../../libs/function";

const Index = () => {

    const dispatch = useDispatch();
    let [sources,setSources]:any = useState({homedelivery:false,takeaway:false})
    const [loading,setLoading]:any = useState(false)


    useEffect(()=>{
        getLocalSettings('asksources').then(r => {
            setSources(r);
            setLoading(true)
        });
    },[])

    const handleSubmit = () => {

    }

    if(!loading){
        return <></>
    }

    return <Container>

        <Form
            initialValues={sources}
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
                                        sources = {
                                            ...sources,
                                            homedelivery:value
                                        }
                                        saveLocalSettings("asksources", sources).then();
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
                                        sources = {
                                            ...sources,
                                            takeaway:value
                                        }
                                        saveLocalSettings("asksources", sources).then();
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

