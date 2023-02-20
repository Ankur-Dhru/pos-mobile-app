import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container} from "../../components";
import {useDispatch} from "react-redux";
import {appLog, assignOption, syncData} from "../../libs/function";
import {Field, Form} from "react-final-form";

import {ACTIONS, device, localredux, METHOD, required, STATUS, urls} from "../../libs/static";

import InputField from '../../components/InputField';

import KAccessoryView from '../../components/KAccessoryView';
import apiService from "../../libs/api-service";

import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {Card} from "react-native-paper";


const Index = (props: any) => {

    const callback = props?.route?.params?.callback;

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const initdata: any = {"accountstatus":"1","accountmid":'',"accountname":"","accounttype":"expense","accountsubtype":"Other Asset","accountinfo":"","accountno":"","issystemaccount":"0"}


    const handleSubmit = async (values: any) => {

        const {workspace}: any = localredux.initData;
        const {token}: any = localredux.authData;

        await apiService({
            method: METHOD.POST,
            action: ACTIONS.CHARTOFACCOUNT,
            body: values,
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {

            if (result.status === STATUS.SUCCESS) {

                if (Boolean(callback)) {
                    await callback({...values,accountid:result.data?.accountid})
                    navigation.goBack()
                }
                navigation.goBack()
            }
            device.searchlist = ''
        });
    }



    const {chartofaccount,staticdata:{accounttypes}}: any = localredux.initData;

    const option_chartofaccount = chartofaccount?.filter((account:any)=>{
        return account.accounttype === 'expense'
    }).map((account:any)=>{
        return {label:account.accountname,value:account.accountid,more:account}
    });


    const optionAccounttypes = Object.keys(accounttypes).map((k) => assignOption(k, k));

    let optionAccountSubtype: any = [];
    if (initdata.accounttype) {
        optionAccountSubtype = Object.keys(accounttypes[initdata.accounttype])
            .filter((k: any) => !(k === "Accounts Payable" || k === "Accounts Receivable"))
            .map((k) => assignOption(k, k))
    }



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
        <Container style={styles.bg_white}>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm,{maxWidth:400}]}>
                                <ScrollView>
                                    <Card style={[styles.card]}>

                                        <Card.Content style={[styles.cardContent]}>
                                            <View>

                                                <Field name="accountname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}

                                                            label={'Name'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>


                                                <Field name="accounttype"  validate={required}>
                                                    {props => (
                                                        <InputField
                                                            label={'Account Type'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={optionAccounttypes}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="accountsubtype"  validate={required}>
                                                    {props => (
                                                        <InputField
                                                            label={'Account Sub Type'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={optionAccountSubtype}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>


                                                <Field name="accountinfo">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}

                                                            label={'Account Info'}
                                                            multiline={true}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="accountmid">
                                                    {props => (
                                                        <InputField
                                                            label={'Listed in Account'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={option_chartofaccount}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="accountno">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}

                                                            label={'Account Code'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
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
                                        }}> Save </Button>
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


