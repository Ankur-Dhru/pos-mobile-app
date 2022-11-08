import React, {Component, useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container} from "../../components";
import {connect, useDispatch} from "react-redux";
import {Appbar, Card, Title, withTheme,} from "react-native-paper";
import {appLog, assignOption, objToArray, selectItem, syncData} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {ACTIONS, adminUrl, device, localredux, METHOD, PRODUCTCATEGORY, required, STATUS} from "../../libs/static";

import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";

import {closePage,  } from "../../redux-store/reducer/component";
import {setGroup} from "../../redux-store/reducer/group-list";
import {setSelected} from "../../redux-store/reducer/selected-data";
import store from "../../redux-store/store";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";


const Index = ({callback,pageKey}:any) => {

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const initdata: any = {
        itemgroupcolor: "#000000",
        itemgroupid: uuidv4(),
        itemgroupmid: "0",
        itemgroupname:  device.searchlist?device.searchlist:'',
        itemgroupstatus: "1",
    }



    const  handleSubmit = async (values: any) => {

        const {workspace}:any = localredux.initData;
        const {token}:any = localredux.authData;

        await apiService({
            method: METHOD.PUT,
            action: ACTIONS.SETTINGS,
            body: {settingid: 'itemgroup', settingdata: [{"key": values.itemgroupid, "value": values}]},
            workspace:workspace,
            token:token,
            other: {url: adminUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                dispatch(setGroup(values))
                //dispatch(closePage(pageKey))
                dispatch(setSelected({value:values.itemgroupid,field:'group'}))
                await syncData(false).then()
                Boolean(callback) && await callback(values)
                navigation.goBack()
            }
            device.searchlist = ''
        });
    }


    const {itemgroup}:any = localredux.initData;


    const option_itemgroups = Object.values(itemgroup).filter((group:any)=>{
        return group.itemgroupid !==  initdata.itemgroupid
    }).map((group:any) => {
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
        return <PageLoader  />
    }


    return (
        <Container config={{title:'Add Item Category'}} >

            <Form
                onSubmit={handleSubmit}
                initialValues={{...initdata}}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View  style={[styles.h_100]}>

                        {/*<Appbar.Header style={[styles.bg_white]}>
                            <Appbar.BackAction    onPress={() => {dispatch(closePage(pageKey))} }/>
                            <Appbar.Content  title={'Add Item Category'}   />
                        </Appbar.Header>*/}

                        <KeyboardScroll>


                            <Card style={[styles.card]}>

                                <Card.Content>
                                    <View>

                                        {/*<Field name="itemgroupstatus">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Active'}
                                                    value={Boolean(props.input.value)}
                                                    inputtype={'switch'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value ? 1 : 0);
                                                    }}>
                                                </InputField>
                                            )}
                                        </Field>*/}


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
                        </KeyboardScroll>

                        <KAccessoryView>

                            <View style={[styles.grid, styles.justifyContent,styles.p_5]}>
                                {/*<View style={[styles.w_auto]}>
                                    <Button more={{backgroundColor: styles.light.color, color: 'black'}}
                                            onPress={() => {
                                                dispatch(closePage(pageKey))
                                            }}> Cancel
                                    </Button>
                                </View>*/}
                                <View style={[styles.w_auto]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}>  Add  </Button>
                                </View>
                            </View>


                        </KAccessoryView>
                    </View>
                )}
            >

            </Form>


        </Container>

    )

}




export default  Index;


