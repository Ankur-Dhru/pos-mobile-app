import React from "react";
import {isEmpty, isRestaurant, saveLocalSettings, storeData, syncData} from "../../libs/function";
import {Dimensions, Image, ScrollView, TouchableOpacity, View} from "react-native";
import {Button as PButton, Caption, Card, List, Text, Title} from "react-native-paper";
import {styles} from "../../theme";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {
    ACTIONS, db,
    grecaptcharesponse,
    ItemDivider,
    localredux,
    loginUrl,
    METHOD,
    PRINTER,
    STATUS
} from "../../libs/static";
import apiService from "../../libs/api-service";
import Button from "../../components/Button";
import AddEditCategory from "../Items/AddEditCategory";
import AddEditClient from "../Client/AddEditClient";
import DeleteButton from "../../components/Button/DeleteButton";
import {Container} from "../../components";
import {createTables, deleteDB} from "../../libs/Sqlite";
import {Icon} from "react-native-paper/lib/typescript/components/List/List";
import ProIcon from "../../components/ProIcon";


const ProfileSettings = () => {

    const {avatar_url, companyname, email: aemail, firstname, lastname} = localredux.authData;
    const {password, email, data: {terminal_name}} = localredux.licenseData;

    const {role}: any = localredux.authData

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


    const resetTerminal = async () => {
        await storeData(db.name, {}).then(async () => {
        });

        await storeData(`fusion-dhru-pos-settings`, {}).then(async () => {
        });
        await storeData(`${db.name}-vouchernos`, 0).then(async () => {
        });
        await storeData(`${db.name}-kotno`, 0).then(async () => {
        });

        await deleteDB()

        await createTables().then()

        await saveLocalSettings('synccontact', false).then(() => {

        })

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'SetupStackNavigator'},
                ],
            })
        );
    }

    const closeAccount = async () => {

        let access = {email: email, password: password}
        access = {
            ...access,
            deviceid: 'asdfadsf',
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
                        resetTerminal()
                    }
                });
            } else {
                resetTerminal()
            }
        })


    }


    return <Container>



        <View style={[styles.middle]}>

            <View style={[styles.middleForm]}>



                <ScrollView keyboardShouldPersistTaps='handled' style={[styles.h_100]}>

                    <View style={[styles.absolute,styles.p_4,{right:0}]}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <ProIcon name={'xmark'}/>
                        </TouchableOpacity>
                    </View>

                    <View>

                        <View style={[styles.mb_3]}>

                            <View>

                                <View style={[{justifyContent: 'center', alignItems: 'center',}]}>
                                    <Image
                                        style={[{width: 70, height: 70}]}
                                        source={require('../../assets/dhru-logo-22.png')}
                                    />
                                    <View>

                                        <Title
                                            style={[styles.text_md, styles.textCenter]}>{firstname + ' ' + lastname} </Title>
                                        <Text
                                            style={[styles.paragraph, styles.textCenter, styles.mb_2]}>{aemail}</Text>
                                        <Caption
                                            style={[styles.paragraph, styles.textCenter, styles.mb_10]}>{workspace} ({terminal_name})</Caption>

                                    </View>
                                </View>


                                <View style={[styles.grid, styles.justifyContent]}>
                                    <Button style={[styles.w_auto, styles.noshadow]}
                                            more={{
                                                backgroundColor: styles.accent.color,
                                                color: 'white',
                                                height: 40
                                            }} onPress={() => {
                                        navigation.goBack();
                                        syncData().then()
                                    }}>Sync</Button>
                                    <Button style={[styles.ml_1, styles.w_auto, styles.noshadow]}
                                            more={{
                                                backgroundColor: styles.red.color,
                                                color: 'white',
                                                height: 40
                                            }} onPress={() => {
                                        logoutUser();
                                    }}>Logout</Button>
                                </View>


                            </View>

                        </View>

                        <View>
                            <View>


                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>

                                        <List.Subheader>Reports</List.Subheader>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Sales Report'}
                                            onPress={() => {
                                                navigation.navigate("SalesReport");
                                            }}
                                            left={() => <List.Icon icon="point-of-sale"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Day End Report'}
                                            onPress={() => {
                                                navigation.navigate("DayEndReport");
                                            }}
                                            left={() => <List.Icon icon="point-of-sale"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                    </Card.Content>
                                </Card>


                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>
                                        <List.Subheader>Create a New</List.Subheader>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Item Category'}
                                            onPress={async () => {
                                                navigation.navigate("AddEditCategory");
                                            }}
                                            left={() => <List.Icon icon="playlist-plus"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Item'}
                                            onPress={async () => {
                                                navigation.navigate("AddEditItemNavigator");
                                            }}
                                            left={() => <List.Icon icon="card-plus-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Client'}
                                            onPress={async () => {
                                                navigation.navigate("AddEditClient");
                                            }}
                                            left={() => <List.Icon icon="account-plus"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />


                                    </Card.Content>
                                </Card>

                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>

                                        <List.Subheader>Settings</List.Subheader>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Invoice Printer"
                                            onPress={() => {
                                                navigation.navigate('PrinterSettings', {
                                                    type: {
                                                        name: 'Invoice',
                                                        departmentid: PRINTER.INVOICE
                                                    }
                                                })
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        {isRestaurant() && <List.Item
                                            style={[styles.listitem]}
                                            title="KOT Printer"
                                            onPress={() => {
                                                navigation.navigate("KOTPrinter");
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />}

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="General Settings"
                                            onPress={() => {
                                                navigation.navigate("GeneralSettings");
                                            }}
                                            left={() => <List.Icon icon="cog-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Quick Quantity Unit"
                                            onPress={() => {
                                                navigation.navigate("InputOpenSetting");
                                            }}
                                            left={() => <List.Icon icon="scale-balance"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Quick Quantity & Amount"
                                            onPress={() => {
                                                navigation.navigate("DefaultInputValues");
                                            }}
                                            left={() => <List.Icon icon="currency-inr"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />


                                    </Card.Content>
                                </Card>


                                {role === 'admin' && <View>

                                    <Card style={[styles.card, {marginBottom: 0}]}>
                                        <Card.Content style={[styles.cardContent,]}>

                                            <View style={[styles.mb_5]}>
                                                <DeleteButton
                                                    options={['Reset', 'Cancel']}
                                                    title={'Reset Terminal'}
                                                    buttonTitle={'Reset Terminal'}
                                                    message={`Are you sure want to reset Terminal? All data will be deleted...`}
                                                    render={() => {
                                                        return (
                                                            <PButton

                                                                mode={'text'}
                                                                contentStyle={{
                                                                    borderColor: styles.red.color,
                                                                    borderWidth: 1,
                                                                    borderStyle: 'dashed',
                                                                    borderRadius: 7,
                                                                    color: styles.red.color
                                                                }}
                                                                labelStyle={[styles.capitalize, {color: styles.red.color}]}> Reset
                                                                Terminal </PButton>
                                                        )
                                                    }}
                                                    onPress={(index: any) => {
                                                        if (index === 0) {
                                                            resetTerminal().then()
                                                        }
                                                    }}
                                                />
                                            </View>

                                            <View>
                                                <DeleteButton
                                                    options={['Delete Account', 'Cancel']}
                                                    title={'Close & Delete Account'}
                                                    buttonTitle={'Close & Delete Account'}
                                                    message={`Are you sure want to delete "${email}" account?`}
                                                    onPress={(index: any) => {
                                                        if (index === 0) {
                                                            closeAccount().then()
                                                        }
                                                    }}
                                                />
                                            </View>

                                        </Card.Content>
                                    </Card>

                                </View>}


                                <View style={{marginTop: 'auto'}}>


                                </View>
                            </View>
                        </View>

                    </View>

                </ScrollView>
            </View>
        </View>


    </Container>
}


export default ProfileSettings;


