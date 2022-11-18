import React from "react";
import {appLog, isEmpty, isRestaurant, storeData, syncData} from "../../libs/function";
import {Dimensions, Image, ScrollView, View} from "react-native";
import {Caption, Card, Divider, List, Title,Text} from "react-native-paper";
import {styles} from "../../theme";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {ACTIONS, grecaptcharesponse, localredux, loginUrl, METHOD, PRINTER, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import Button from "../../components/Button";
import AddEditCategory from "../Items/AddEditCategory";
import AddEditClient from "../Client/AddEditClient";
import DeleteButton from "../../components/Button/DeleteButton";
import {Container, ProIcon} from "../../components";
import {Button as PButton} from 'react-native-paper';


const ProfileSettings = () => {

    const {avatar_url, companyname, email: aemail, firstname, lastname} = localredux.authData;
    const {password, email,data:{terminal_name}} = localredux.licenseData;

    const {workspace} = localredux.initData

    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation()

    const isRes = isRestaurant();

    const logoutUser = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'PinStackNavigator'},
                ],
            })
        );
    }

    const navigatToSetup = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'SetupStackNavigator'},
                ],
            })
        );
    }

    const resetTerminal = async () => {
        await storeData('fusion-pro-pos-mobile', []).then(async () => {});
        await storeData('fusion-pro-pos-mobile-tableorder',{}).then(async () => {});
        await storeData('fusion-pro-pos-mobile-settings',{}).then(async () => {});
        await storeData('fusion-pro-pos-mobile-vouchernos',0).then(async () => {});
        await storeData('fusion-pro-pos-mobile-kotno',0).then(async () => {});

        navigatToSetup()
    }

    const closeAccount = async () => {

        let access = {email: email, password: password}
        access = {
            ...access,
            "g-recaptcha-response": grecaptcharesponse
        }
        await apiService({
            method: METHOD.POST,
            action: ACTIONS.LOGIN,
            other: {url: loginUrl},
            body: access
        }).then((response: any) => {

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                apiService({
                    method: METHOD.DELETE,
                    action: ACTIONS.REGISTER,
                    other: {url: loginUrl},
                    token: response.token
                }).then((result) => {
                    if (result.status === STATUS.SUCCESS) {
                        navigatToSetup()
                    }
                });
            } else {
                navigatToSetup()
            }
        })


    }


    return <Container>

        <ScrollView keyboardShouldPersistTaps='handled' style={[styles.h_100]}>

            <View style={[styles.middle]}>

                <View style={[styles.middleForm]}>

                    <View style={[styles.px_4]}>

                    <View style={[styles.mt_5,styles.mb_5]}>
                        <View>

                            <View style={[{justifyContent: 'center', alignItems: 'center',}]}>
                                <Image
                                    style={[{width: 70, height: 70}]}
                                    source={require('../../assets/dhru-logo-22.png')}
                                />
                                <View>

                                    <Title
                                        style={[styles.text_md, styles.textCenter]}>{firstname + ' ' + lastname} </Title>
                                    <Text style={[styles.paragraph, styles.textCenter,styles.mb_2]}>{aemail}</Text>
                                    <Caption  style={[styles.paragraph, styles.textCenter, styles.mb_10]}>{workspace} ({terminal_name})</Caption>

                                </View>
                            </View>


                            <View style={[styles.grid, styles.justifyContent]}>
                                <Button style={[styles.w_auto, styles.noshadow]}
                                        more={{backgroundColor: styles.accent.color,color:'white'}} onPress={() => {
                                    navigation.goBack();
                                    syncData().then()
                                }}>Sync</Button>
                                <Button style={[styles.ml_2, styles.w_auto, styles.noshadow]}
                                        more={{backgroundColor: styles.red.color,color:'white'}} onPress={() => {
                                    logoutUser();
                                }}>Logout</Button>
                            </View>


                        </View>
                    </View>

                    <View>
                        <View>

                            <List.Section>


                            <List.Subheader>Create a New</List.Subheader>

                            <List.Item

                                title={'+ Item Category'}
                                onPress={async () => {
                                    navigation.navigate("AddEditCategory");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />

                            <Divider/>

                            <List.Item

                                title={'+ Item'}
                                onPress={async () => {
                                    navigation.navigate("AddEditItemNavigator");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />

                            <Divider/>

                            <List.Item

                                title={'+ Client'}
                                onPress={async () => {
                                    navigation.navigate("AddEditClient");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />


                            <Divider/>


                                <List.Subheader>Reports</List.Subheader>

                            <List.Item

                                title={'Sales Invoices'}
                                onPress={() => {
                                    navigation.goBack()
                                    navigation.navigate("SalesReportNavigator");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />

                            <Divider/>


                                <List.Subheader>Settings</List.Subheader>

                            <List.Item

                                title="Invoice Printer"
                                onPress={() => {
                                    navigation.navigate('PrinterSettings', {type: {name: 'Invoice', departmentid: PRINTER.INVOICE}})
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />

                                <Divider/>

                            <List.Item
                                title="KOT Printer"
                                onPress={() => {
                                    navigation.navigate("KOTPrinter");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />

                                <Divider/>

                            <List.Item

                                title="Quick Quantity Unit"
                                onPress={() => {
                                    navigation.navigate("InputOpenSetting");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />

                                <Divider/>

                            <List.Item

                                title="Quick Quantity & Amount"
                                onPress={() => {
                                    navigation.navigate("DefaultInputValues");
                                }}
                                right={() =>  <List.Icon icon="chevron-right"/>}
                            />


                            </List.Section>



                            <Divider/>


                            <View style={[styles.mt_5]}>

                                <View style={[styles.mb_5]}>
                                    <DeleteButton
                                        options={['Reset','Cancel']}
                                        title={'Reset Terminal'}
                                        buttonTitle={'Reset Terminal'}
                                        message={`Are you sure want to reset Terminal?`}
                                        render={()=>{
                                            return (
                                                <PButton

                                                    mode={'text'}
                                                    contentStyle={{borderColor: styles.red.color,borderWidth:1,borderStyle:'dashed',borderRadius:7,color:styles.red.color}}
                                                    labelStyle={[styles.capitalize, {color: styles.red.color}]}> Reset Terminal </PButton>
                                            )
                                        }}
                                        onPress={(index: any) => {
                                            if (index === 0) {
                                                resetTerminal()
                                            }
                                        }}
                                    />
                                </View>

                                <View style={[styles.mb_5]}>
                                    <DeleteButton
                                        options={['Delete Account','Cancel']}
                                        title={'Close & Delete Account'}
                                        buttonTitle={'Close & Delete Account'}
                                        message={`Are you sure want to delete "${email}" account?`}
                                        onPress={(index: any) => {
                                            if (index === 0) {
                                                closeAccount()
                                            }
                                        }}
                                    />
                                </View>

                            </View>

                            <View style={{height: 50}}>

                            </View>


                            <View style={{marginTop: 'auto'}}>


                            </View>
                        </View>
                    </View>

                    </View>
                </View>
            </View>

        </ScrollView>


    </Container>
}


export default ProfileSettings;


