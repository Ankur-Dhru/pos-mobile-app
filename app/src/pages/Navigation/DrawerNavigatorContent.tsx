import React from "react";
import {appLog, isEmpty, isRestaurant, retrieveData, storeData, syncData, updateComponent} from "../../libs/function";
import {Dimensions, Image, ScrollView, TouchableOpacity, View} from "react-native";
import {Card, List, Text, Paragraph, Divider} from "react-native-paper";
import {styles} from "../../theme";
import Avatar from "../../components/Avatar";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {ACTIONS, APP_NAME, localredux, METHOD, posUrl, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import Button from "../../components/Button";
import store from "../../redux-store/store";
import {openPage } from "../../redux-store/reducer/component";
import AddEditItem from "../Items/AddEditItem";
import AddEditCategory from "../Items/AddEditCategory";
import AddEditClient from "../Client/AddEditClient";


const Index = () => {

    const {avatar_url, companyname, email, firstname, lastname} = localredux.authData;

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


    return <View style={[styles.h_100]}>


        <Card>
            <Card.Content>

                <TouchableOpacity onPress={() => {
                    try {
                        navigation.navigate("ProfileSettingsNavigator");
                    }
                    catch (e) {
                        appLog('e',e)
                    }
                }}>
                    <View style={[styles.grid, styles.middle, styles.noWrap]}>

                        <Image
                            style={[{width: 50, height: 50}]}
                            source={require('../../assets/dhru-logo-22.png')}
                        />

                        <View style={[styles.ml_2]}>
                            <View>
                                <Paragraph style={[styles.paragraph, styles.bold, styles.text_lg]}>Dhru POS</Paragraph>
                            </View>
                            <Text style={[styles.paragraph, styles.text_md, {
                                lineHeight: 20,
                                fontSize: 16
                            }]}>{firstname + ' ' + lastname}</Text>

                            {/*{Boolean(email) &&
                                <Text style={[styles.paragraph, styles.muted, styles.text_xs]}>{email}</Text>}*/}
                        </View>
                    </View>
                </TouchableOpacity>


                <View style={[styles.grid,styles.justifyContent,styles.mt_5]}>
                    <Button style={[styles.w_auto,styles.noshadow]} compact={true} more={{backgroundColor:styles.accent.color}} onPress={() => {syncData().then()}}  >Sync</Button>
                    <Button style={[styles.ml_2,styles.w_auto,styles.noshadow]} compact={true} more={{backgroundColor:styles.red.color}}   onPress={() => {logoutUser();}} >Logout</Button>
                </View>



            </Card.Content>
        </Card>


        <Card style={[styles.flex, styles.h_100,]}>
            <View>
                <ScrollView keyboardShouldPersistTaps='handled' style={[styles.h_100]}>

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={[styles.bold,{marginLeft: 0, paddingLeft: 0}]}
                        title={'Create a New'}
                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'+ Item Category'}
                        onPress={async () => {
                            navigation.navigate("AddEditCategory");
                            /*store.dispatch(openPage({
                                visible: true,
                                hidecancel: true,
                                width: 300,
                                component: (props:any) => <AddEditCategory {...props} />
                            }))*/
                        }}
                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'+ Item'}
                        onPress={async () => {
                            navigation.navigate("AddEditItemNavigator");
                            /*store.dispatch(openPage({
                                visible: true,
                                hidecancel: true,
                                width: 300,
                                component: (props:any) => <AddEditItem {...props} item={{}} />
                            }))*/
                        }}
                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'+ Client'}
                        onPress={async () => {
                            navigation.navigate("AddEditClient");
                            /*store.dispatch(openPage({
                                visible: true,
                                hidecancel: true,
                                width: 300,
                                component: (props:any) => <AddEditClient {...props}  />
                            }))*/
                        }}
                    />


                    <Divider/>

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={[styles.bold,{marginLeft: 0, paddingLeft: 0}]}
                        title={'Reports'}
                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Sales Invoices'}
                        onPress={() => {
                            navigation.navigate("SalesReportNavigator");
                        }}
                    />

                    <Divider/>

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={[styles.bold,{marginLeft: 0, paddingLeft: 0}]}
                        title={'Setting'}
                    />

             {/*       <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Print'}
                        onPress={() => {
                            navigation.navigate("PrinterNavigator");
                        }}
                    />*/}

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title="Invoice Printer"
                        onPress={()=>{
                            navigation.navigate("InvoicePrinter");
                        }}
                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title="KOT Printer"
                        onPress={()=>{
                            navigation.navigate("KOTPrinter");
                        }}

                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title="Quick Quantity Unit"
                        onPress={()=>{
                            navigation.navigate("InputOpenSetting");
                        }}

                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title="Quick Quantity & Amount"
                        onPress={()=>{
                            navigation.navigate("DefaultInputValues");
                        }}

                    />


                   {/* <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Quick Quantity Unit'}
                        onPress={() => {
                            navigation.navigate("InputOpenNavigator");
                        }}
                    />
                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Quick Quantity & Amount'}
                        onPress={() => {
                            navigation.navigate("InputValueNavigator");
                        }}
                    />*/}

                    <View style={{height:50}}>

                    </View>


                </ScrollView>

                <View style={{marginTop: 'auto'}}>



                </View>
            </View>
        </Card>


    </View>
}


export default Index;


