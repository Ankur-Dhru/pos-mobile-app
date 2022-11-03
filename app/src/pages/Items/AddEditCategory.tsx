import React, {Component, useState} from 'react';
import {Platform, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container} from "../../components";
import {connect, useDispatch} from "react-redux";
import {Card, Title, withTheme,} from "react-native-paper";
import {assignOption, objToArray, selectItem, syncData} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {ACTIONS, adminUrl, localredux, METHOD, PRODUCTCATEGORY, required, STATUS} from "../../libs/static";

import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";

import {setBottomSheet, setModal, setPageSheet} from "../../redux-store/reducer/component";


const Index = ({pagesheet,callback}:any) => {

    const dispatch = useDispatch();


    const initdata: any = {
        itemgroupcolor: "#000000",
        itemgroupid: uuidv4(),
        itemgroupmid: "0",
        itemgroupname: "",
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
                syncData(false).then()
                if(!pagesheet){
                    dispatch(setModal({visible:false}))
                }
                else {
                    dispatch(setPageSheet({visible: false}))
                }
                await callback(values)
            }
        });
    }


    const {itemgroup}:any = localredux.initData;

    const option_itemgroups = Object.keys(itemgroup).filter((group:any)=>{
        return group.itemgroupid !==  initdata.itemgroupid
    }).map((group:any,key:any) => assignOption(group.itemgroupname, group.itemgroupid));



    return (
        <View style={[styles.h_100,styles.middle]}>

            <Form
                onSubmit={handleSubmit}
                initialValues={{...initdata}}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View  style={[styles.h_100,styles.middleForm,]}>

                        <KeyboardScroll>

                            <Title style={[styles.mt_5,{marginLeft:10}]}> Add Item Category </Title>
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
                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                    handleSubmit(values)
                                }}>  Add  </Button>
                            </View>
                        </KAccessoryView>
                    </View>
                )}
            >

            </Form>


        </View>

    )

}




export default  Index;


