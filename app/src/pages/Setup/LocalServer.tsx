import React, {useState} from 'react';
import {FlatList, Keyboard, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Caption, Card, Paragraph} from "react-native-paper";

import {Button, Container, InputBox} from "../../components";
import {Field, Form} from 'react-final-form';


import {composeValidators, ItemDivider, required,} from "../../libs/static";

import KAccessoryView from "../../components/KAccessoryView";
import {chevronRight, connectToLocalServer} from "../../libs/function";
import {useNavigation} from "@react-navigation/native";

export default function LocalServer(props: any) {
    const navigation = useNavigation();

    const [serverip, setServerip] = useState()

    const handleSubmit = (values: any) => {
        Keyboard.dismiss();
        const {serverip}: any = values
        connectToLocalServer(serverip, navigation).then();
    }

    const renderitems = ({item}: any) => {

        return (
            <TouchableOpacity onPress={() => connectToLocalServer(item, navigation).then()} style={[{paddingHorizontal: 5}]}>

                <View style={[styles.grid, styles.justifyContent, styles.py_5]}>
                    <View><Paragraph style={[styles.paragraph, styles.text_md]}>{item}</Paragraph></View>
                    <View>
                        {chevronRight}
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    return (
        <Container>
            <Form
                onSubmit={handleSubmit}
                initialValues={{serverip: serverip}}
                render={({handleSubmit, submitting, values, ...more}: any) => (

                    <>
                        <View style={[styles.middle,]}>
                            <View style={[styles.middleForm]}>

                                <ScrollView>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>


                                            <View>

                                                <Field name="serverip"
                                                       validate={composeValidators(required)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Local Server IP'}
                                                            autoFocus={false}
                                                            autoCapitalize='none'
                                                            /*onSubmitEditing={(e:any) => {
                                                                this.handleSubmit(values)
                                                            }}
                                                            returnKeyType={'go'}
                                                            */
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>

                                            </View>

                                        </Card.Content>
                                    </Card>


                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>

                                            <Caption style={[styles.caption]}>Recently Used</Caption>

                                            <FlatList
                                                data={['10.0.51.61', '192.168.29.10', '10.7.35.57']}
                                                keyboardDismissMode={'on-drag'}
                                                keyboardShouldPersistTaps={'always'}
                                                renderItem={renderitems}
                                                ItemSeparatorComponent={ItemDivider}

                                            />


                                        </Card.Content>
                                    </Card>


                                </ScrollView>

                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}>Next</Button>
                                    </View>
                                </KAccessoryView>

                            </View>
                        </View>


                    </>

                )}
            >

            </Form>
        </Container>
    );
}
