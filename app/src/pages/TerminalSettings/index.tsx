import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Caption, Card, List, Paragraph} from "react-native-paper"
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import CheckBox from "../../components/CheckBox";
import {Field, Form} from "react-final-form";

import {getLocalSettings, retrieveData, saveLocalSettings, setAPIUrl} from "../../libs/function";
import {setSettings} from "../../redux-store/reducer/local-settings-data";
import InputField from "../../components/InputField";
import {localredux} from "../../libs/static";


const Index = () => {

    const dispatch = useDispatch();

    const initdata = {}
    const {password, email, data: {terminal_name}} = localredux.licenseData;

    const {workspace} = localredux.initData


    const handleSubmit = () => {

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


                                <List.Item
                                    style={[styles.listitem]}
                                    title="Workspace"
                                    onPress={() => {
                                        navigation.navigate("TerminalSettings");
                                    }}
                                    right={() => <Paragraph style={[styles.p_4]}>{workspace}</Paragraph> }
                                />



                                <View style={[styles.grid,styles.justifyContent]}>
                                    <Paragraph>Location</Paragraph>
                                    <Paragraph>{workspace}</Paragraph>
                                </View>

                                <View style={[styles.grid,styles.justifyContent]}>
                                    <Paragraph>Terminal</Paragraph>
                                    <Paragraph>{terminal_name}</Paragraph>
                                </View>




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

