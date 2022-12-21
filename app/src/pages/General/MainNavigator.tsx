import React, {useEffect} from "react";
import 'react-native-gesture-handler';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import StaffList from "../Pin/Stafflist";
import Terminal from "../Setup/Terminal";
import Workspaces from "../Setup/Workspaces";
import Login from "../Setup/Login";
import Pin from "../Pin";
import {db, device, screenOptionStyle} from "../../libs/static";

import Splash from "../Splash";
import Tables from "../Tables";
import Cart from "../Cart";
import {CheckConnectivity, getOrders, isEmpty, isRestaurant, syncInvoice} from "../../libs/function";
import DetailView from "../Cart/DetailView";
import Payment from "../Cart/Payment";
import SalesReport from "../Report/SalesReport";

import InputOpenSetting from "../InputOpenSetting";
import DefaultInputValues from "../DefaultInputValues";
import {useDispatch} from "react-redux";
import Register from "../Setup/Register";

import Verification from "../Setup/Verification";

import AddWorkspace from "../SetupWorkspace/AddWorkspace";
import OrganizationProfile from "../SetupWorkspace/OrganizationProfile";
import BusinessDetails from "../SetupWorkspace/BusinessDetails";
import CurrencyPreferences from "../SetupWorkspace/CurrencyPreferences";


import KOTPrinter from "../PrinterSettings/KOTPrinter";
import AddEditClient from "../Client/AddEditClient";
import AddEditItem from "../Items/AddEditItem";
import AddEditCategory from "../Items/AddEditCategory";
import DropDownList from "./DropDownList";
import General from "./ProfileSettings";
import ClientAndSource from "../Cart/ClientAndSource";

import PrinterSettings from "../PrinterSettings/Setting";
import SearchItem from "../Items/SearchItem";
import AddTable from "../Tables/AddTable";
import sample from "../sample";
import CancelReason from "../Cart/CancelReason";
import ClientList from "../Client/ClientList";
import KotNote from "../Cart/KotNote";
import GeneralSettings from "../GeneralSettings";
import DayEndReport from "../Report/dayendreport";
import ScanItem from "../Items/ScanItem";
import AddExpense from "../../pages/Expense"
import DateTimePicker from "./DateTimePicker";

const screenOptions = {...screenOptionStyle};


//const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


const MainStackNavigator = () => {


    const dispatch = useDispatch();

    let interval: any = null;
    useEffect(() => {
        if (!interval) {
            interval = setInterval(() => {
                if (Boolean(db.name)) {
                    getOrders().then((orders: any) => {
                        if (!isEmpty(orders)) {
                            let invoice: any = Object.values(orders)[0]
                            syncInvoice(invoice).then()
                        }
                    })
                }
            }, 60000);
        }
        CheckConnectivity()
        return () => {
            clearInterval(interval);
            interval = null;
        };
    }, []);

    return (
        <Stack.Navigator

            initialRouteName={'SplashStackNavigator'}
            screenOptions={{...screenOptions, headerShown: false}}
        >
            <Stack.Screen name="SplashStackNavigator" component={SplashStackNavigator}/>

            <Stack.Screen name="SetupStackNavigator" component={SetupStackNavigator}/>

            <Stack.Screen name="PinStackNavigator" component={PinStackNavigator}/>

            <Stack.Screen name="ClientAreaStackNavigator" component={ClientAreaStackNavigator}/>

            <Stack.Screen name={'ProfileSettingsNavigator'} component={ProfileSettingsNavigator}
                          options={{headerShown: false, presentation: 'modal', headerTitle: 'Settings'}}/>


            <Stack.Screen name="Sample" component={sample}/>


        </Stack.Navigator>
    );
};


const SplashStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Splash'} screenOptions={screenOptions}>
            <Stack.Screen name="Splash" component={Splash}
                          options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const SetupStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Login'} screenOptions={screenOptions}>
            <Stack.Screen name="Login" component={Login}
                          options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={Register} options={{headerTitle: 'Create an account'}}/>

            <Stack.Screen name="Verification" component={Verification} options={{headerTitle: 'Verify Email'}}/>

            <Stack.Screen name="AddWorkspace" component={AddWorkspace} options={{headerTitle: 'Add Workspace'}}/>

            <Stack.Screen name="OrganizationProfile" component={OrganizationProfile}
                          options={{headerTitle: 'Organization Profile'}}/>

            <Stack.Screen name="BusinessDetails" component={BusinessDetails}
                          options={{headerTitle: 'Business Details'}}/>

            <Stack.Screen name="CurrencyPreferences" component={CurrencyPreferences}
                          options={{headerTitle: 'Currency Preferences'}}/>

            <Stack.Screen name="Workspaces" component={Workspaces} options={{headerTitle: 'Workspaces'}}/>

            <Stack.Screen name="Terminal" component={Terminal} options={{headerTitle: 'Terminal'}}/>

            <Stack.Screen name={'DropDownList'} component={DropDownList}
                          options={{headerShown: false, headerTitle: 'Select'}}/>

        </Stack.Navigator>
    );
};

const PinStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'StaffList'} screenOptions={screenOptions}>
            <Stack.Screen name="StaffList" component={StaffList}
                          options={{headerTitle: 'Staff Member', headerLargeTitle: false,}}/>
            <Stack.Screen name="Pin" component={Pin}
                          options={({route}: any) => ({title: route.params.username})}/>

        </Stack.Navigator>
    );
};


const ClientAreaStackNavigator = (props: any) => {
    const {route: {params}}: any = props;
    return (
        <Stack.Navigator initialRouteName={isRestaurant() ? 'ClientAreaStackNavigator' : 'CartStackNavigator'}
                         screenOptions={screenOptions}>
            {isRestaurant() &&
                <Stack.Screen name={'ClientAreaStackNavigator'} component={Tables} options={{headerTitle: 'Tables'}}/>}
            <Stack.Screen name={'CartStackNavigator'} {...params} component={Cart}
                          options={({route}: any) => ({headerShown: !device.tablet, title: route?.params?.tablename})}/>


            <Stack.Screen name={'SearchItem'} component={SearchItem}
                          options={{headerShown: false, headerTitle: 'Search Item'}}/>
            <Stack.Screen name={'ScanItem'} component={ScanItem}
                          options={{headerShown: true, headerTitle: 'Scan Item'}}/>
            <Stack.Screen name={'DetailViewNavigator'} component={DetailView} options={{headerTitle: 'Detail view'}}/>

            <Stack.Screen name={'AddEditItemNavigator'} component={AddEditItem} options={{headerTitle: 'Add Item'}}/>
            <Stack.Screen name={'AddEditCategory'} component={AddEditCategory} options={{headerTitle: 'Add Category'}}/>
            <Stack.Screen name={'AddEditClient'} component={AddEditClient} options={{headerTitle: 'Add Client'}}/>
            <Stack.Screen name={'AddTable'} component={AddTable} options={{headerTitle: 'Add Table'}}/>

            <Stack.Screen name={'ClientList'} component={ClientList}
                          options={{headerShown: false, headerTitle: 'Client List'}}/>

            <Stack.Screen name={'ClientAndSource'} {...params} component={ClientAndSource}
                          options={{headerTitle: 'Order Source'}}/>

            <Stack.Screen name={'KotNote'} component={KotNote} options={{headerTitle: 'KOT Note'}}/>

            <Stack.Screen name={'Payment'} component={Payment} options={{headerTitle: 'Payment'}}/>

            <Stack.Screen name={'CancelReason'} component={CancelReason}
                          options={{presentation: 'modal', headerTitle: 'Cancel Reason'}}/>


            <Stack.Screen name={'DropDownList'} component={DropDownList} options={({route}: any) => ({
                presentation: route?.params?.presentation,
                headerShown: false,
                title: 'select'
            })}/>

            <Stack.Screen name={'DateTimePicker'} component={DateTimePicker}  options={({route}: any) => ({
                presentation: route?.params?.presentation,
            })}/>


        </Stack.Navigator>
    );
};


const ProfileSettingsNavigator = (props: any) => {

    return (
        <Stack.Navigator initialRouteName={'ProfileSettingsNavigator'} screenOptions={screenOptions}>
            <Stack.Screen name={'ProfileSettingsNavigator'} component={General} options={{headerShown: false}}/>

            <Stack.Screen name={'SalesReport'} component={SalesReport} options={{headerTitle: 'Sales Report'}}/>
            <Stack.Screen name={'DayEndReport'} component={DayEndReport} options={{headerTitle: 'Day End Report'}}/>

            {/*<Stack.Screen name={'Preview'} component={Preview} options={{headerTitle: 'Preview'}}/>*/}

            <Stack.Screen name={'AddEditItemNavigator'} component={AddEditItem} options={{headerTitle: 'Add Item'}}/>
            <Stack.Screen name={'AddEditCategory'} component={AddEditCategory} options={{headerTitle: 'Add Category'}}/>
            <Stack.Screen name={'AddEditClient'} component={AddEditClient} options={{headerTitle: 'Add Client'}}/>

            <Stack.Screen name={'AddExpense'} component={AddExpense} options={{headerTitle: 'Add Expense'}}/>


            <Stack.Screen name={'KOTPrinter'} component={KOTPrinter} options={{title: 'KOT Printer'}}/>
            <Stack.Screen name={'InputOpenSetting'} component={InputOpenSetting}
                          options={{title: 'Quick Quantity Unit'}}/>
            <Stack.Screen name={'DefaultInputValues'} component={DefaultInputValues}
                          options={{title: 'Quick Quantity & Amount'}}/>

            <Stack.Screen name={'GeneralSettings'} component={GeneralSettings} options={{title: 'General Settings'}}/>

            <Stack.Screen name={'PrinterSettings'} component={PrinterSettings} options={{title: ''}}/>
            <Stack.Screen name={'DropDownList'} component={DropDownList}
                          options={{headerShown: false, headerTitle: 'Select'}}/>

            <Stack.Screen name={'DateTimePicker'} component={DateTimePicker}
                          options={{headerTitle: ''}}/>

        </Stack.Navigator>
    );
};


/*const ClientAreaStackNavigator = () => {

    return (
        <Drawer.Navigator  drawerContent={(props) => <DrawerNavigatorContent {...props}/>} initialRouteName={isRestaurant() ? 'TablesStackNavigator' : 'CartStackNavigator'} screenOptions={{...screenOptions, headerShown: false}}>
            {isRestaurant() && <Drawer.Screen name={'TablesStackNavigator'} component={TablesStackNavigator} options={{headerShown: false, headerTitle: 'Tables'}}/>}
            <Drawer.Screen name={'CartStackNavigator'} component={CartStackNavigator} options={({route}: any) => ({ headerShown: false, title: route?.params?.tablename || 'POS' })}/>
            <Drawer.Screen name={'DetailViewNavigator'} component={DetailViewNavigator} options={{headerShown: false, headerTitle: 'Detail View'}}/>
            <Drawer.Screen name={'Payment'} component={Payment} options={{headerShown: false, unmountOnBlur: true, headerTitle: 'Payment'}}/>

            <Drawer.Screen name={'ProfileSettingsNavigator'} component={ProfileSettingsNavigator} options={{headerShown: false,  headerTitle: 'Profile'}}/>

            <Drawer.Screen name={'SalesReportNavigator'} component={SalesReportNavigator} options={({route}: any) => ({  headerShown: false,title: route?.params?.tablename || 'POS'})}/>


            <Drawer.Screen name={'InvoicePrinter'} component={InvoicePrinter} options={{headerShown: false}}/>

            <Drawer.Screen name={'AddEditCategory'} component={AddEditCategory} options={{headerShown: false}}/>
            <Drawer.Screen name={'AddEditClient'} component={AddEditClient} options={{headerShown: false}}/>
            <Drawer.Screen name={'AddEditItem'} component={AddEditItem} options={{headerShown: false}}/>

            <Drawer.Screen name={'AddEditItemNavigator'} component={AddEditItemNavigator} options={{headerShown: false}}/>

            <Drawer.Screen name={'KOTPrinter'} component={KOTPrinter} options={{headerShown: false}}/>
            <Drawer.Screen name={'InvoicePrinter'} component={InvoicePrinter} options={{headerShown: false}}/>
            <Drawer.Screen name={'InputOpenSetting'} component={InputOpenSetting} options={{headerShown: false}}/>
            <Drawer.Screen name={'DefaultInputValues'} component={DefaultInputValues} options={{headerShown: false}}/>


        </Drawer.Navigator>
    );
};*/


export {
    MainStackNavigator,
};
