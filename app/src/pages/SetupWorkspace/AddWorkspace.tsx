import React, {Component} from 'react';
import {Keyboard, ScrollView, TextInput, View} from 'react-native';
import {styles} from "../../theme";

import {Card, Paragraph, Title, withTheme} from "react-native-paper";

import {Button, Container, InputBox} from "../../components";
import {Field, Form} from 'react-final-form';


import {composeValidators, localredux, loginUrl, METHOD, required, startWithString, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import {appLog, errorAlert, findObject, isEmpty, prelog, selectWorkspace} from "../../libs/function";
import KAccessoryView from "../../components/KAccessoryView";

class AddWorkspace extends Component<any> {


    constructor(props: any) {
        super(props);
    }

    workspaceAdded = (data:any,workspace:any) => {

        const {navigation}: any = this.props;

        let workspacelogin = data?.workspace_login;

        const params = queryStringToJSON(workspacelogin);

        localredux.authData.token = params['t'];

        selectWorkspace({name: workspace}, navigation).then(r => {})

    }


    createNewWorkspace = (workspacename:any) => {
        apiService({
            method: METHOD.POST,
            action: 'order',
            other: {url: loginUrl},
            queryString:{registerfrommobile:true},
            body: {itemid: '3d44bcb5-afbc-4153-af6a-aa3457ebe119', domain: workspacename,registerfrommobile:true},
        }).then((result) => {
            console.log('result',result)
            try {
                if (result.status === STATUS.SUCCESS) {
                    this.workspaceAdded(result?.data[0],workspacename)
                }
            } catch (e) {
                appLog('e', e)
            }
        });
    }


    handleSubmit = (values: any) => {

        Keyboard.dismiss();
        const staffaccess = this.props?.route?.params?.staffaccess;
        values.companyname = values?.companyname?.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
        const workspacename = values.companyname;

        if(staffaccess){
            console.log('staff')
            apiService({
                method: METHOD.GET,
                action: 'workspace',
                queryString:{workspace:workspacename},
                other: {url: loginUrl},
            }).then((result) => {
                try {
                    if (result.status === STATUS.SUCCESS) {
                        const find = findObject(result?.data,'name',workspacename,true);
                        if(isEmpty(find)){
                             this.createNewWorkspace(workspacename)
                        }
                        else {
                            this.workspaceAdded(find, workspacename)
                        }
                    }
                } catch (e) {
                    appLog('e', e)
                }
            });
        }
        else {
            console.log('else')
            this.createNewWorkspace(workspacename)
        }
    }


    render() {

        return (
            <Container    style={styles.bg_white}>
                <Form
                    onSubmit={this.handleSubmit}

                    render={({handleSubmit, submitting, values, ...more}: any) => (

                        <>

                            <View style={[styles.middle,]}>
                                <View style={[styles.middleForm, {maxWidth: 400,}]}>

                                    <ScrollView>

                                        <Card style={[styles.card]}>
                                            <Card.Content style={[styles.cardContent]}>


                                        <View>

                                            <Field name="companyname"
                                                   validate={composeValidators(required, startWithString)}>
                                                {props => (
                                                    <InputBox
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'Workspace'}
                                                        autoFocus={true}
                                                        autoCapitalize='none'
                                                        /*onSubmitEditing={(e:any) => {
                                                            this.handleSubmit(values)
                                                        }}
                                                        returnKeyType={'go'}
                                                        */
                                                        affix={'.dhru.com'}
                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>

                                            <Paragraph
                                                style={[styles.paragraph, styles.red, styles.text_xs, styles.py_2]}>Workspace
                                                name must start with an alphabet</Paragraph>

                                        </View>

                                            </Card.Content>
                                        </Card>



                                    </ScrollView>

                                    <KAccessoryView>
                                        <View style={[styles.submitbutton]}>
                                            <Button more={{color:'white'}} disable={more.invalid} secondbutton={more.invalid} onPress={() => {
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

        )
    }
}


export default withTheme(AddWorkspace);


const queryStringToJSON = (qs: any) => {
    qs = qs || location.search.slice(1);

    var pairs = qs.split(/[&?]+/);

    var result: any = {};
    pairs.forEach(function (p: any) {
        var pair = p.split('=');
        var key = pair[0];
        var value = decodeURIComponent(pair[1] || '');

        if (result[key]) {
            if (Object.prototype.toString.call(result[key]) === '[object Array]') {
                result[key].push(value);
            } else {
                result[key] = [result[key], value];
            }
        } else {
            result[key] = value;
        }
    });

    return JSON.parse(JSON.stringify(result));
};
