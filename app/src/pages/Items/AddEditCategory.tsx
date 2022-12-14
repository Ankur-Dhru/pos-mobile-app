import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container} from "../../components";
import {useDispatch} from "react-redux";
import {assignOption, syncData} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {ACTIONS, device, localredux, METHOD, required, STATUS, urls} from "../../libs/static";

import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";
import {setGroup} from "../../redux-store/reducer/group-list";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {Card} from "react-native-paper";


const Index = (props: any) => {

    const callback = props?.route?.params?.callback;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const initdata: any = {
        itemgroupcolor: "#000000",
        itemgroupid: uuidv4(),
        itemgroupmid: "0",
        itemgroupname: '',
        itemgroupstatus: "1",
    }


    const handleSubmit = async (values: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.CATEGORY,
            body: values,
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                dispatch(setGroup(values))

                dispatch(setSelected({value: values.itemgroupid, field: 'group'}))
                await syncData(false).then()

                if (Boolean(callback)) {
                    await callback(values)
                    navigation.goBack()
                }
                navigation.goBack()
            }
            device.searchlist = ''
        });
    }


    const {itemgroup}: any = localredux.initData;


    const option_itemgroups = Object.values(itemgroup).filter((group: any) => {
        return group.itemgroupid !== initdata.itemgroupid
    }).map((group: any) => {
        return assignOption(group.itemgroupname, group.itemgroupid)
    });

    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader/>
    }


    return (
        <Container>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm]}>
                                <ScrollView>
                                    <Card style={[styles.card]}>

                                        <Card.Content style={[styles.cardContent]}>
                                            <View>

                                                <Field name="itemgroupname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            autoFocus={true}
                                                            label={'Category Name'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>


                                                <Field name="itemgroupmid">
                                                    {props => (
                                                        <InputField
                                                            label={'Parent Category'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={option_itemgroups}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>


                                            </View>

                                        </Card.Content>

                                    </Card>
                                </ScrollView>

                                <KAccessoryView>

                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Add </Button>
                                    </View>

                                </KAccessoryView>
                            </View>
                        </View>
                    )}
                >

                </Form>
            </SafeAreaView>
        </Container>

    )

}


export default Index;


