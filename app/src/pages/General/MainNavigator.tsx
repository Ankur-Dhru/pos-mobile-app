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
import {
    appLog,
    CheckConnectivity,
    getOrders,
    intervalInvoice,
    isEmpty,
    isRestaurant,
    syncInvoice
} from "../../libs/function";
import DetailView from "../Cart/DetailView";
import Payment from "../Cart/Payment";
import SalesReport from "../Report/SalesReport";

import InputOpenSetting from "../InputOpenSetting";
import DefaultInputValues from "../DefaultInputValues";
import {useDispatch} from "react-redux";
import Register from "../Setup/Register";

import EmailVerification from "../Setup/EmailVerification";
import WhatsappVerification from "../Setup/WhatsappVerification";

import AddWorkspace from "../SetupWorkspace/AddWorkspace";
import OrganizationProfile from "../SetupWorkspace/OrganizationProfile";
import BusinessDetails from "../SetupWorkspace/BusinessDetails";
import CurrencyPreferences from "../SetupWorkspace/CurrencyPreferences";


import KOTPrinter from "../PrinterSettings/KOTPrinter";

import ListClients from "../Client/List_clients";
import ListItems from "../Items/List_items";
import ListItemsCategories from "../Items/List_category";
import ListExpenses from "../Expense/List_expenses";

import AddEditClient from "../Client/AddEditClient";
import AddEditItem from "../Items/AddEditItem";
import AddEditCategory from "../Items/AddEditCategory";


import DropDownList from "./DropDownList";
import General from "./ProfileSettings";
import ClientAndSource from "../Cart/ClientAndSource";

import PrinterSettings from "../PrinterSettings/Setting";
import SearchItem from "../Items/SearchItem";
import AddTable from "../Tables/AddTable";
import Sample from "../sample";
import CancelReason from "../Cart/CancelReason";
import ClientList from "../Client/ClientList";
import KotNote from "../Cart/KotNote";
import KOTDetail from "../Cart/KOTDetail";
import GeneralSettings from "../GeneralSettings";
import DayEndReport from "../Report/dayendreport";
import CurrentStock from "../Report/CurrentStock";
import ScanItem from "../Items/ScanItem";
import AddEditExpense from "../../pages/Expense/AddEditExpense"
import AddEditPaymentReceived from "../../pages/PaymentReceived/AddEditPaymentReceived";
import DateTimePicker from "./DateTimePicker";
import AskPermission from "../Pin/AskPermission";
import BlueToothList from "../PrinterSettings/BlueToothList";
import Preview from "../Preview";
import InvoicePreview from "../Report/preview";

import LocalServer from "../Setup/LocalServer";
import GettingStarted from "../Splash/GettingStarted";
import AddEditAccount from "../Expense/AddEditAccount";
import ContactUs from "../SetupWorkspace/ContactUs";
import TerminalSettings from "../TerminalSettings";
import ChangePin from "../Pin/ChangePin";
import QRWebsite from "../QRWebsite";
import PrintQR from "../QRWebsite/PrintQR";
import OtherSettings from "../QRWebsite/OtherSettings";
import VerifyOTP from "../Setup/VerifyOTP";
import ChangeWhatsapp from "../Setup/ChangeWhatsapp";
import ItemWiseSales from "../Report/ItemWiseSales";
import AddEditSalesReturn from "../SalesReturn/AddEditSalesReturn";
import SalesReturnReport from "../Report/SalesReturnReport";
import StockItemsList from "../Report/StockItemsList";
import UpdateOrderInfo from "../Cart/UpdateOrderInfo";
import SwitchItems from "../Cart/SwitchItems";
import PrinterFor from "../PrinterSettings/PrinterFor";
import ItemDetail from "../Items/ItemDetail";
import AddEditPaymentMade from "../PaymentMade/AddEditPaymentMade";
import ScanSerialno from "../Items/ScanSerialno";


const screenOptions = {...screenOptionStyle};


//const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


const MainStackNavigator = () => {

    intervalInvoice();



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


            <Stack.Screen name="Sample" component={Sample}/>


        </Stack.Navigator>
    );
};


const SplashStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Splash'} screenOptions={screenOptions}>
            <Stack.Screen name="Splash" component={Splash}
                          options={{headerShown: false}}/>

            <Stack.Screen name="GettingStarted" component={GettingStarted}  options={{headerShown: false}}/>

        </Stack.Navigator>
    );
};

const SetupStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Login'} screenOptions={screenOptions}>

            <Stack.Screen name="Login" component={Login}  options={{headerShown: false}}/>

            <Stack.Screen name="LocalServer" component={LocalServer}  options={{headerTitle: 'Remote Terminal'}}/>

            <Stack.Screen name="Register" component={Register} options={{headerTitle: 'Create an account'}}/>

            <Stack.Screen name="EmailVerification" component={EmailVerification} options={{headerTitle: 'Verify Email'}}/>

            <Stack.Screen name="WhatsappVerification" component={WhatsappVerification} options={{headerTitle: 'Verify Whatsapp'}}/>

            <Stack.Screen name="ChangeWhatsapp" component={ChangeWhatsapp} options={{headerTitle: 'Change Whatsapp Number'}}/>

            <Stack.Screen name="AddWorkspace" component={AddWorkspace} options={{headerTitle: 'Add Workspace'}}/>

            <Stack.Screen name="OrganizationProfile" component={OrganizationProfile}
                          options={{headerTitle: 'Organization Profile'}}/>

            <Stack.Screen name="BusinessDetails" component={BusinessDetails}
                          options={{headerTitle: 'Business Details'}}/>

            <Stack.Screen name="CurrencyPreferences" component={CurrencyPreferences}
                          options={{headerTitle: 'Currency Preferences'}}/>

            <Stack.Screen name="Workspaces" component={Workspaces} options={{headerTitle: 'Workspaces'}}/>

            <Stack.Screen name="VerifyOTP" component={VerifyOTP} options={{headerTitle: 'Verify OTP'}}/>

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
                          options={({route}: any) => ({title: 'Pin'})}/>
        </Stack.Navigator>
    );
};


const ClientAreaStackNavigator = (props: any) => {
    const {route: {params}}: any = props;
    return (
        <Stack.Navigator initialRouteName={isRestaurant() ? 'TableStackNavigator' : 'CartStackNavigator'}
                         screenOptions={screenOptions}>
            {isRestaurant() &&
                <Stack.Screen name={'TableStackNavigator'} component={Tables} options={{headerTitle: 'Tables'}}/>}
            <Stack.Screen name={'CartStackNavigator'} {...params} component={Cart}
                          options={({route}: any) => ({headerShown: !device.tablet, title: route?.params?.tablename})}/>


            <Stack.Screen name={'SearchItem'} component={SearchItem}
                          options={{headerShown: false, headerTitle: 'Search Item'}}/>
            <Stack.Screen name={'ScanItem'} component={ScanItem}
                          options={{headerShown: true, headerTitle: 'Scan Item'}}/>

            <Stack.Screen name={'ScanSerialno'} component={ScanSerialno}
                          options={{headerShown: true, headerTitle: 'Scan IMEI/Serial'}}/>

            <Stack.Screen name={'DetailViewNavigator'} component={DetailView} options={{headerTitle: 'Detail view'}}/>


            <Stack.Screen name={'ListItems'} component={ListItems} options={{headerTitle: 'Items'}}/>
            <Stack.Screen name={'ListItemsCategories'} component={ListItemsCategories} options={{headerTitle: 'Categories'}}/>
            <Stack.Screen name={'ListClients'} component={ListClients} options={{headerTitle: 'Clients'}}/>
            <Stack.Screen name={'ListExpenses'} component={ListExpenses} options={{headerTitle: 'Expenses'}}/>


            <Stack.Screen name={'AddEditItemNavigator'} component={AddEditItem} options={{headerTitle: 'Add Item'}}/>
            <Stack.Screen name={'AddEditCategory'} component={AddEditCategory} options={{headerTitle: 'Add Category'}}/>
            <Stack.Screen name={'AddEditExpense'} component={AddEditExpense} options={{headerTitle: 'Add Expense'}}/>
            <Stack.Screen name={'AddEditPaymentReceived'} component={AddEditPaymentReceived} options={{headerTitle: 'Add Payment Received'}}/>
            <Stack.Screen name={'AddEditPaymentMade'} component={AddEditPaymentMade} options={{headerTitle: 'Add Payment Made'}}/>
            <Stack.Screen name={'AddEditSalesReturn'} component={AddEditSalesReturn} options={{headerTitle: 'Add Sales Return'}}/>
            <Stack.Screen name={'AddEditAccount'} component={AddEditAccount} options={{headerTitle: 'Add Account'}}/>
            <Stack.Screen name={'AddEditClient'} component={AddEditClient} options={{headerTitle: 'Add Client'}}/>

            <Stack.Screen name={'AddTable'} component={AddTable} options={{headerTitle: 'Add Table'}}/>

            <Stack.Screen name={'ClientList'} component={ClientList}
                          options={{headerShown: false, headerTitle: 'Client List'}}/>

            <Stack.Screen name={'ClientAndSource'} {...params} component={ClientAndSource}
                          options={{headerTitle: 'Order Source'}}/>

            <Stack.Screen name={'KotNote'} component={KotNote} options={{headerTitle: 'Notes'}}/>

            <Stack.Screen name={'ItemDetail'} component={ItemDetail} options={{headerTitle: 'Item Detail'}}/>


            <Stack.Screen name={'KOTDetail'} component={KOTDetail} options={{headerTitle: 'KOT Detail'}}/>

            <Stack.Screen name={'Payment'} component={Payment} options={{headerTitle: 'Payment'}}/>

            <Stack.Screen name={'UpdateOrderInfo'} component={UpdateOrderInfo} options={{headerTitle: 'Update Info'}}/>

            <Stack.Screen name={'SwitchItems'} component={SwitchItems} options={{headerTitle: 'Move Items'}}/>



            <Stack.Screen name={'CancelReason'} component={CancelReason}
                          options={{  headerTitle: 'Cancel Reason'}}/>

            <Stack.Screen name={'InvoicePreview'} component={InvoicePreview} options={({route}: any) => ({
                presentation: 'modal',
                title: 'Preview'
            })} />


            <Stack.Screen name={'Preview'} component={Preview} options={({route}: any) => ({
                presentation: 'modal',
                title: 'Preview'
            })} />


            <Stack.Screen name={'DropDownList'} component={DropDownList} options={({route}: any) => ({
                presentation: route?.params?.presentation,
                headerShown: false,
                title: 'select'
            })}/>

            <Stack.Screen name={'DateTimePicker'} component={DateTimePicker} options={({route}: any) => ({
                presentation: route?.params?.presentation,
            })}/>


            <Stack.Screen name="AskPermission" component={AskPermission} options={{title: 'Ask Permission'}}/>


        </Stack.Navigator>
    );
};


const ProfileSettingsNavigator = (props: any) => {

    return (
        <Stack.Navigator initialRouteName={'ProfileSettingsNavigator'} screenOptions={screenOptions}>
            <Stack.Screen name={'ProfileSettingsNavigator'} component={General} options={{headerShown: false}}/>

            <Stack.Screen name={'SalesReport'} component={SalesReport} options={{headerTitle: 'Sales Report'}}/>
            <Stack.Screen name={'SalesReturnReport'} component={SalesReturnReport} options={{headerTitle: 'Sales Return Report'}}/>
            <Stack.Screen name={'DayEndReport'} component={DayEndReport} options={{headerTitle: 'Day End Report'}}/>
            <Stack.Screen name={'CurrentStock'} component={CurrentStock} options={{headerTitle: 'Current Stock'}}/>
            <Stack.Screen name={'StockItemsList'} component={StockItemsList} options={{headerTitle: 'Items'}}/>
            <Stack.Screen name={'ItemWiseSales'} component={ItemWiseSales} options={{headerTitle: 'Item Wise Sales'}}/>


            <Stack.Screen name={'ListItems'} component={ListItems} options={{headerTitle: 'Items'}}/>
            <Stack.Screen name={'ListItemsCategories'} component={ListItemsCategories} options={{headerTitle: 'Categories'}}/>
            <Stack.Screen name={'ListClients'} component={ListClients} options={{headerTitle: 'Clients'}}/>
            <Stack.Screen name={'ListExpenses'} component={ListExpenses} options={{headerTitle: 'Expenses'}}/>


            <Stack.Screen name={'AddEditItemNavigator'} component={AddEditItem} options={{headerTitle: 'Add Item'}}/>
            <Stack.Screen name={'AddEditCategory'} component={AddEditCategory} options={{headerTitle: 'Add Category'}}/>
            <Stack.Screen name={'AddEditAccount'} component={AddEditAccount} options={{headerTitle: 'Add Account'}}/>
            <Stack.Screen name={'AddEditClient'} component={AddEditClient} options={{headerTitle: 'Add Client'}}/>
            <Stack.Screen name={'AddEditExpense'} component={AddEditExpense} options={{headerTitle: 'Add Expense'}}/>
            <Stack.Screen name={'AddEditPaymentReceived'} component={AddEditPaymentReceived} options={{headerTitle: 'Add Payment Received'}}/>

            <Stack.Screen name={'PrinterFor'} component={PrinterFor} options={{headerTitle: 'Printer For'}}/>

            <Stack.Screen name={'KOTPrinter'} component={KOTPrinter} options={{title: 'KOT Printer'}}/>
            <Stack.Screen name={'InputOpenSetting'} component={InputOpenSetting}
                          options={{title: 'Quick Quantity Unit'}}/>
            <Stack.Screen name={'DefaultInputValues'} component={DefaultInputValues}
                          options={{title: 'Quick Quantity & Amount'}}/>

            <Stack.Screen name={'GeneralSettings'} component={GeneralSettings} options={{title: 'General'}}/>

            <Stack.Screen name={'TerminalSettings'} component={TerminalSettings} options={{title: 'Terminal'}}/>

            <Stack.Screen name={'ChangePin'} component={ChangePin} options={{title: 'Change Pin'}}/>

            <Stack.Screen name={'ContactUs'} component={ContactUs} options={{title: 'Contact Us'}}/>

            <Stack.Screen name={'PrinterSettings'} component={PrinterSettings} options={{title: ''}}/>

            <Stack.Screen name={'BlueToothList'} component={BlueToothList} options={{title: 'Bluetooth Devices'}}/>

            <Stack.Screen name={'Preview'} component={Preview} options={({route}: any) => ({title: 'Preview'})} />

            <Stack.Screen name={'InvoicePreview'} component={InvoicePreview} options={({route}: any) => ({
                title: 'Preview'
            })} />

            <Stack.Screen name={'QRWebsite'} component={QRWebsite} options={({route}: any) => ({title: 'Website & Digital Menu'})} />

            <Stack.Screen name={'PrintQR'} component={PrintQR} options={({route}: any) => ({title: 'QR Preview'})} />

            <Stack.Screen name={'OtherSettings'} component={OtherSettings} options={({route}: any) => ({title: 'More Settings'})} />

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
