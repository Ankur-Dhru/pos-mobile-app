import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container, ProIcon} from "../../components";
import {useDispatch} from "react-redux";
import {appLog, assignOption, errorAlert, getRoleAccess} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {ACTIONS, device, localredux, METHOD, required, STATUS, urls} from "../../libs/static";

import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";
import {setGroup} from "../../redux-store/reducer/group-list";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {Card} from "react-native-paper";


const Index = (props: any) => {

    const callback = props?.route?.params?.callback;
    const editdata = props?.route?.params?.data;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const access = getRoleAccess('Item Category')


    const initdata: any = {
        itemgroupcolor: "#000000",
        itemgroupid: uuidv4(),
        itemgroupmid: "0",
        itemgroupname: '',
        itemgroupstatus: "1",
        ...editdata
    }

    const colors = ['#cdb4db','#ffc8dd','#ffafcc','#bde0fe','#a2d2ff',
        '#9b5de5','#f15bb5','#fee440','#00bbf9','#00f5d4',
        '#ef476f','#ffd166','#06d6a0','#118ab2','#073b4c',
        '#9381ff','#b8b8ff','#f8f7ff','#ffeedd','#ffd8be',
        '#003049','#d62828','#f77f00','#fcbf49','#eae2b7',
        '#8e9aaf','#cbc0d3','#efd3d7','#feeafa','#dee2ff',
    ]


    const handleSubmit = async (values: any) => {

        if((access?.add && !initdata.edit) || (access?.update && initdata.edit)) {
            const {workspace}: any = localredux.initData;
            const {token}: any = localredux.authData;

            values.edit = false

            await apiService({
                method: initdata.edit ? METHOD.PUT : METHOD.POST,
                action: ACTIONS.CATEGORY,
                body: values,
                workspace: workspace,
                token: token,
                other: {url: urls.posUrl},
            }).then(async (result) => {

                if (result.status === STATUS.SUCCESS) {

                    await dispatch(setGroup(values))

                    if (Boolean(callback)) {
                        await callback(values)
                        navigation.goBack()
                    }
                    navigation.goBack()
                } else {
                    errorAlert(result.message)
                }
                device.searchlist = ''
            });
        }
        else{
            errorAlert('You do not have an Access')
        }
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

    if (initdata.edit) {
        navigation.setOptions({headerTitle: `Edit ${initdata.itemgroupname}`})
    }


    return (
        <Container style={styles.bg_white}>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values,form, ...more}: any) => (
                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm, {maxWidth: 400}]}>
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


                                            <View style={[styles.grid,]}>
                                                {
                                                    colors.map((color:any)=>{
                                                        return <>
                                                            <TouchableOpacity style={[styles.flexGrow,styles.center,styles.middle,{minWidth:60,height:60,backgroundColor:color}]} onPress={()=>{
                                                                form.change('itemgroupcolor',color)
                                                            }}>
                                                                {values.itemgroupcolor === color &&  <ProIcon name={'check'} color={'white'}/>}
                                                            </TouchableOpacity>
                                                        </>
                                                    })
                                                }
                                            </View>

                                        </Card.Content>

                                    </Card>
                                </ScrollView>

                                <KAccessoryView>

                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> {Boolean(initdata.edit) ? 'Update' : 'Save'}  </Button>
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


