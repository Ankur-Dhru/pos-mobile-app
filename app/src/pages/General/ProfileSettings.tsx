import React from "react";
import {
    appLog, errorAlert,
    getDatabaseName, getRoleAccess,
    isEmpty,
    isRestaurant,
    saveLocalSettings,
    storeData,
    syncData
} from "../../libs/function";
import {Dimensions, Image, Linking, Platform, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {Button as PButton, Caption, Card, List, Paragraph, Text, Title} from "react-native-paper";
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
    STATUS, urls
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
import Avatar from "../../components/Avatar";


const ProfileSettings = () => {

    const {avatar_url, companyname, email: aemail, firstname, lastname} = localredux.authData;
    const {password, email, data: {terminal_name}} = localredux.licenseData;

    const {role}: any = localredux.authData

    const clientaccess = getRoleAccess('Clients')
    const itemaccess = getRoleAccess('Items')
    const itemcategoryaccess = getRoleAccess('Item Category')
    const expenseaccess = getRoleAccess('Expenses')
    const paymentreceive = getRoleAccess('Receive Payment')
    const creditnotes = getRoleAccess('Credit Notes')


    const {
        currentLocation: {
            locationname,
        }
    }: any = localredux.localSettingsData;
    const {workspace} = localredux.initData;


    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation()



    const {token}: any = localredux.authData;

    const hasLocalserver = Boolean(urls.localserver);

    const isRes = isRestaurant();

    const logoutUser = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: Boolean(urls.localserver) ? 'SetupStackNavigator':'PinStackNavigator'},
                ],
            })
        );
    }


    const resetTerminal = async () => {

        await storeData(`fusion-dhru-pos-settings`, {}).then(async () => {});
        await storeData(`${db.name}`, {}).then(async () => {});
        /*await storeData(`${db.name}-vouchernos`, 0).then(async () => {});
        await storeData(`${db.name}-kotno`, 0).then(async () => {});*/
        await saveLocalSettings('synccontact', false).then(() => {})
        await deleteDB();
        await getDatabaseName().then(async (dbname:any)=>{
            db.name = dbname;
            await createTables().then();
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

            <View style={[styles.middleForm,{maxWidth:600}]}>



                <ScrollView keyboardShouldPersistTaps='handled' style={[styles.h_100]}>

                    {Platform.OS !== 'ios' && <View style={[styles.absolute,styles.p_4,{right:0,zIndex:99}]}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <ProIcon name={'xmark'}/>
                        </TouchableOpacity>
                    </View>}

                    <View>

                        <View style={[styles.mb_3]}>

                            <View>



                                <View style={[styles.py_6,{justifyContent: 'center', alignItems: 'center',paddingTop: 25}]}>

                                    {<View  style={[styles.middle]}>
                                        <Avatar label={firstname+' '+lastname} value={1}  fontsize={30} size={60}/>
                                        <Paragraph style={[styles.paragraph,styles.bold,{textTransform:'capitalize'}]}>{firstname} {lastname}</Paragraph>
                                    </View>}

                                    <View>
                                        {/*<Text
                                            style={[styles.paragraph, styles.textCenter, styles.mb_2]}>{aemail}</Text>*/}

                                        <Paragraph style={[styles.paragraph,styles.text_xs]}>{workspace} - {locationname} - {terminal_name}</Paragraph>

                                        <TouchableOpacity onPress={()=>{
                                            navigation.navigate('ChangePin')
                                        }}><Paragraph style={[styles.textCenter,{color:styles.primary.color}]}>Change PIN</Paragraph></TouchableOpacity>

                                    </View>
                                </View>


                                <View style={[styles.grid, styles.justifyContent]}>
                                    {!hasLocalserver && <Button style={[styles.w_auto,styles.mr_1, styles.noshadow]}
                                            more={{
                                                backgroundColor: styles.accent.color,
                                                color: 'white',
                                                height: 40
                                            }} onPress={() => {
                                        navigation.goBack();
                                        syncData().then()
                                    }}>Sync</Button> }
                                    <Button style={[ styles.w_auto, styles.noshadow]}
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

                        {!hasLocalserver && <View>
                            <View>

                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>
                                        <List.Subheader>General</List.Subheader>



                                        {(!Boolean(paymentreceive) || paymentreceive?.add) && <><List.Item
                                            style={[styles.listitem]}
                                            title={'Payment Received'}
                                            onPress={async () => {
                                                navigation.navigate("AddEditPaymentReceived");
                                            }}
                                            left={() => <List.Icon icon="currency-inr"/>}
                                            right={()=><List.Icon icon="plus"/>}
                                        />

                                        <ItemDivider/>
                                        </>}


                                        {(!Boolean(creditnotes) || creditnotes?.add) && <><List.Item
                                            style={[styles.listitem]}
                                            title={'Sales Return'}
                                            onPress={async () => {
                                                navigation.navigate("AddEditSalesReturn");
                                            }}
                                            left={() => <List.Icon icon="currency-inr"/>}
                                            right={()=><List.Icon icon="plus"/>}
                                        />
                                            <ItemDivider/>
                                        </>}


                                        {(!Boolean(expenseaccess) || expenseaccess?.add) && <><List.Item
                                            style={[styles.listitem]}
                                            title={'Expenses'}
                                            onPress={async () => {
                                                navigation.navigate("ListExpenses");
                                            }}
                                            left={() => <List.Icon icon="currency-inr"/>}
                                            right={() => <TouchableOpacity onPress={async () => {
                                                navigation.navigate("AddEditExpense");
                                            }}><List.Icon icon="plus"/></TouchableOpacity>}
                                        />
                                        <ItemDivider/>
                                        </>}


                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Item Categories'}
                                            onPress={async () => {
                                                navigation.navigate("ListItemsCategories");
                                            }}
                                            left={() => <List.Icon icon="playlist-plus"/>}
                                            right={() => (!Boolean(itemcategoryaccess) || itemcategoryaccess?.add) &&  <TouchableOpacity onPress={async () => {
                                                navigation.navigate("AddEditCategory");
                                            }}><List.Icon icon="plus"/></TouchableOpacity>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Items'}
                                            onPress={async () => {
                                                navigation.navigate("ListItems");
                                            }}
                                            left={() => <List.Icon icon="card-plus-outline"/>}
                                            right={() => (!Boolean(itemaccess) || itemaccess?.add) &&  <TouchableOpacity onPress={async () => {
                                                navigation.navigate("AddEditItemNavigator");
                                            }}><List.Icon icon="plus"/></TouchableOpacity>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Clients'}
                                            onPress={async () => {
                                                navigation.navigate("ListClients");
                                            }}
                                            left={() => <List.Icon icon="account-plus"/>}
                                            right={() => (!Boolean(clientaccess) ||  clientaccess?.add) && <TouchableOpacity onPress={async () => {
                                                navigation.navigate("AddEditClient");
                                            }}><List.Icon icon="plus"/></TouchableOpacity>}
                                        />


                                    </Card.Content>
                                </Card>

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
                                            title={'Sales Return Report'}
                                            onPress={() => {
                                                navigation.navigate("SalesReturnReport");
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
                                            left={() => <List.Icon icon="receipt"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Current Stocks'}
                                            onPress={() => {
                                                navigation.navigate("StockItemsList");
                                            }}
                                            left={() => <List.Icon icon="inbox-multiple"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />


                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Item Wise Sales'}
                                            onPress={() => {
                                                navigation.navigate("ItemWiseSales");
                                            }}
                                            left={() => <List.Icon icon="point-of-sale"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                       {/* <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title={'Advanced Reports (web)'}
                                            onPress={() => {
                                                const url = `https://${workspace}.dhru.com/reports/sales-summary`;
                                                Linking.openURL(url)
                                            }}
                                            left={() => <List.Icon icon="receipt"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />
*/}
                                    </Card.Content>
                                </Card>


                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>

                                        <List.Subheader>Settings</List.Subheader>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="General"
                                            onPress={() => {
                                                navigation.navigate("GeneralSettings");
                                            }}
                                            left={() => <List.Icon icon="cog-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Invoice / Receipt Printer"
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


                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Sales Return Printer"
                                            onPress={() => {
                                                navigation.navigate('PrinterSettings', {
                                                    type: {
                                                        name: 'Sales Return',
                                                        departmentid: PRINTER.SALESRETURN
                                                    }
                                                })
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>


                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Day End Report Printer"
                                            onPress={() => {
                                                navigation.navigate('PrinterSettings', {
                                                    type: {
                                                        name: 'Day End Report',
                                                        departmentid: PRINTER.DAYENDREPORT
                                                    }
                                                })
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>


                                        {isRestaurant() && <List.Item
                                            style={[styles.listitem]}
                                            title="Kitchen / KOT Printer"
                                            onPress={() => {
                                                navigation.navigate("KOTPrinter");
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />}

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

                                        <ItemDivider/>


                                        {/*<List.Item
                                            style={[styles.listitem]}
                                            title="Advance Settings (Web)"
                                            onPress={() => {
                                                const url = `https://${workspace}.dhru.com/settings/staff`;
                                                Linking.openURL(url)
                                            }}
                                            left={() => <List.Icon icon="cellphone-link"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>*/}

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Contact Us"
                                            onPress={() => {
                                                navigation.navigate("ContactUs");
                                            }}
                                            left={() => <List.Icon icon="help-circle-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />


                                    </Card.Content>
                                </Card>



                                {role === 'admin' &&  <View>


                                    <Card style={[styles.card,styles.bg_light,styles.m_4]} onPress={() => {
                                        navigation.navigate("QRWebsite");
                                    }}>
                                        <Card.Content style={[styles.cardContent]}>
                                            <View style={[styles.grid,styles.justifyContent]}>
                                                <View style={[styles.p_4,]}>
                                                    <Paragraph  style={[styles.paragraph,{color:styles.primary.color}]}>QR Digital menu & website</Paragraph>
                                                    <Paragraph>
                                                        Enrich Your Customer Dine-in Experience With Stunning Digital Menu, QR Stickers for Tables. Show Your Digital Menu With Beautiful Photos & Descriptions.
                                                    </Paragraph>
                                                </View>
                                                <View>

                                                </View>
                                            </View>

                                        </Card.Content>
                                    </Card>


                                    <Card style={[styles.card,styles.bg_light,styles.m_4]}>
                                        <Card.Content style={[styles.cardContent]}>
                                            <View style={[styles.p_4,]}>
                                                <Paragraph  style={[styles.paragraph,{color:styles.primary.color}]}>More settings available on back office</Paragraph>
                                                <Paragraph>
                                                    To Manage Users, Access Roles, Accounting, Multiple Locations, Analytics, Dashboards, Subscription and many more Advanced Settings and Features available at web based back office.
                                                </Paragraph>
                                            </View>

                                            <View style={[styles.grid,styles.justifyContent,styles.middle]}>
                                                <View style={[styles.p_4,styles.bg_white,{borderRadius:5}]}>
                                                    <TouchableOpacity  onPress={()=>{
                                                        const url = `https://${workspace}.dhru.com`;
                                                        Linking.openURL(url)
                                                    }}>
                                                        <View style={[styles.grid,styles.center]}><ProIcon name={'computer'} size={30}/></View>
                                                        <Paragraph style={[]}>{`https://${workspace}.dhru.com`}</Paragraph>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.p_4,styles.bg_white,styles.w_auto,{borderRadius:5,marginLeft:10}]}>
                                                    <TouchableOpacity  onPress={()=>{
                                                        let url = `https://play.google.com/store/apps/details?id=com.dhru.account&hl=en_IN&gl=US`;
                                                        if(Platform.OS === 'ios'){
                                                            url = `https://apps.apple.com/in/app/dhru/id1535749812`;
                                                        }
                                                        Linking.canOpenURL(url).then(
                                                            (supported) => {
                                                                supported && Linking.openURL(url);
                                                            },
                                                            (err) => console.log(err)
                                                        );
                                                        //  Linking.openURL(url)
                                                    }}  style={[styles.center]}>
                                                        <View style={[styles.grid,styles.center]}>
                                                            <ProIcon name={'mobile'}  size={30}/>
                                                        </View>
                                                        <Paragraph style={[styles.textCenter,]}> Download App</Paragraph>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        </Card.Content>
                                    </Card>

                                <View  style={[styles.py_4]}>
                                    <Card style={[styles.card, {marginBottom: 0}]}>
                                        <Card.Content style={[styles.cardContent,]}>

                                            <View style={[styles.p_5,{borderColor: styles.red.color,
                                                borderWidth: 1,
                                                width:'100%',
                                                borderStyle: 'dashed',
                                                borderRadius: 5}]}>
                                                <DeleteButton
                                                    options={['Reset', 'Cancel']}
                                                    title={'Reset Terminal'}
                                                    buttonTitle={'Reset Terminal'}

                                                    message={`Are you sure want to reset Terminal? All data will be deleted...`}
                                                    render={() => {
                                                        return (
                                                            <View style={[styles.p_3]}>
                                                                <Paragraph  style={[styles.paragraph,{color:styles.red.color}]}>Reset Terminal</Paragraph>
                                                                <Paragraph style={[styles.paragraph]}>
                                                                    After reset terminal can resume in future or setup in new device as new terminal too.
                                                                </Paragraph>
                                                            </View>

                                                        )
                                                    }}
                                                    onPress={(index: any) => {
                                                        if (index === 0) {
                                                            resetTerminal().then()
                                                        }
                                                    }}
                                                />
                                            </View>





                                            <View style={[styles.p_5,styles.mt_5,{borderColor: styles.red.color,
                                                borderWidth: 1,
                                                width:'100%',
                                                borderStyle: 'dashed',
                                                borderRadius: 5}]}>
                                                <DeleteButton
                                                    options={['Delete Account', 'Cancel']}
                                                    title={'Close & Delete Account'}
                                                    buttonTitle={'Close & Delete Account'}
                                                    morestyle = {{borderWidth:0}}
                                                    message={`Are you sure want to delete "${email}" account?`}
                                                    onPress={(index: any) => {
                                                        if (index === 0) {
                                                            closeAccount().then()
                                                        }
                                                    }}
                                                    render={() => {
                                                        return (
                                                            <View style={[styles.p_3]}>
                                                                <Paragraph style={[styles.paragraph,{color:styles.red.color}]}>Close & Delete Account</Paragraph>
                                                                <Paragraph style={[styles.paragraph]}>
                                                                    Permanently delete DHRU account and remove workspace with all data and settings.
                                                                </Paragraph>
                                                            </View>

                                                        )
                                                    }}

                                                />
                                            </View>



                                        </Card.Content>
                                    </Card>

                                </View>

                                </View>}

                                <View style={{marginTop: 'auto'}}>


                                </View>
                            </View>
                        </View>}



                    </View>

                </ScrollView>
            </View>
        </View>


    </Container>
}


export default ProfileSettings;


