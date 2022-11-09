import React, {useEffect} from "react";
import 'react-native-gesture-handler';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import StaffList from "../Pin/Stafflist";
import Terminal from "../Setup/Terminal";
import Workspaces from "../Setup/Workspaces";
import Login from "../Setup/Login";
import Pin from "../Pin";
import {ACTIONS, localredux, METHOD, posUrl, screenOptionStyle, STATUS} from "../../libs/static";

import Splash from "../Splash";
import {createDrawerNavigator} from "@react-navigation/drawer";
import DrawerNavigatorContent from ".//DrawerNavigatorContent"
import Tables from "../Tables";
import Cart from "../Cart";
import {appLog, CheckConnectivity, isEmpty, isRestaurant, retrieveData, storeData} from "../../libs/function";
import DetailView from "../Cart/DetailView";
import Payment from "../Cart/Payment";
import Report from "../Report";

import InputOpenSetting from "../InputOpenSetting";
import DefaultInputValues from "../DefaultInputValues";
import apiService from "../../libs/api-service";
import {setOrder} from "../../redux-store/reducer/orders-data";
import {useDispatch} from "react-redux";
import Register from "../Setup/Register";

import Verification from "../Setup/Verification";

import AddWorkspace from "../SetupWorkspace/AddWorkspace";
import OrganizationProfile from "../SetupWorkspace/OrganizationProfile";
import BusinessDetails from "../SetupWorkspace/BusinessDetails";
import CurrencyPreferences from "../SetupWorkspace/CurrencyPreferences";

import InvoicePrinter from "../PrinterSettings/InvoicePrinter";
import KOTPrinter from "../PrinterSettings/KOTPrinter";
import ProfileSettings from "../ProfileSettings";
import AddEditClient from "../Client/AddEditClient";
import AddEditItem from "../Items/AddEditItem";
import AddEditCategory from "../Items/AddEditCategory";
import DropDownList from "../Items/DropDownList";
import General from "../General";
import ClientAndSource from "../Cart/ClientAndSource";

import PrinterSettings from "../PrinterSettings/Setting";

const screenOptions = {...screenOptionStyle};


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


const MainStackNavigator = () => {


    const dispatch = useDispatch();

    let interval: any = null;


    const syncInvoice = (invoiceData: any) => {
        return new Promise((resolve) => {
            let {
                initData,
                licenseData,
            }: any = localredux;
            apiService({
                method: METHOD.POST,
                action: ACTIONS.INVOICE,
                body: invoiceData,
                workspace: initData.workspace,
                token: licenseData?.token,
                hideLoader: true,
                hidealert: true,
                other: {url: posUrl},
            }).then((response: any) => {
                appLog("SYNC REPOSNE", response);
                if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                    retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
                        let localOrder: any = data?.orders
                        delete localOrder[invoiceData?.orderid];
                        storeData('fusion-pro-pos-mobile', data).then(async () => {
                            dispatch(setOrder({...invoiceData, synced: true}))
                        });
                    })
                } else {
                    resolve({status: "ERROR"})
                }
            }).catch(() => {
                resolve({status: "TRY CATCH ERROR"})
            })
        })
    }

    useEffect(() => {
        if (!interval) {
            interval = setInterval(() => {
                retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
                    if (!isEmpty(data.orders)) {
                        let invoice: any = Object.values(data.orders)[0]
                        let response = await syncInvoice(invoice)
                        appLog("invoice data call", response);
                    }
                })
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

            {/*<Stack.Screen name={'ClientAreaStackNavigator'} component={ClientAreaStackNavigator}/>*/}

        </Stack.Navigator>
    );
};


const SplashStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Splash'}>
            <Stack.Screen name="Splash" component={Splash}
                          options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const SetupStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Login'}>
            <Stack.Screen name="Login" component={Login}
                          options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={Register}
                          options={{headerShown: false}}/>

            <Stack.Screen name="Verification" component={Verification}
                          options={{headerShown: false}}/>

            <Stack.Screen name="AddWorkspace" component={AddWorkspace}
                          options={{headerShown: false, headerTitle: 'AddWorkspace', headerLargeTitle: false}}/>

            <Stack.Screen name="OrganizationProfile" component={OrganizationProfile}
                          options={{  headerTitle: '', headerLargeTitle: false}}/>

            <Stack.Screen name="BusinessDetails" component={BusinessDetails}
                          options={{ headerTitle: '', headerLargeTitle: false}}/>

            <Stack.Screen name="CurrencyPreferences" component={CurrencyPreferences}
                          options={{ headerTitle: '', headerLargeTitle: false}}/>

            <Stack.Screen name="Workspaces" component={Workspaces}
                          options={{ headerTitle: 'Workspaces', headerLargeTitle: false}}/>

            <Stack.Screen name="Terminal" component={Terminal}
                          options={{headerShown: false, headerTitle: '', headerLargeTitle: false}}/>

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


const ClientAreaStackNavigator = (props:any) => {
    const {route: {params}}: any = props;
    return (
        <Stack.Navigator initialRouteName={'ClientAreaStackNavigator'} >
            <Stack.Screen name={'ClientAreaStackNavigator'}  component={Tables} options={{headerShown: false}}/>
            <Stack.Screen name={'CartStackNavigator'} {...params}  component={Cart} options={({route}: any) => ({title: route.params.tablename})}   />
            <Stack.Screen name={'DetailViewNavigator'} component={DetailView}  options={{headerTitle:'Detail view'}}  />


            <Stack.Screen name={'ClientAndSource'} {...params}   component={ClientAndSource}  options={{headerTitle:'Order Source'}}  />
            <Stack.Screen name={'ProfileSettingsNavigator'} component={ProfileSettingsNavigator}   options={{headerShown:true,presentation:'modal',headerTitle:'Settings'}}  />
            <Stack.Screen name={'DropDownList'} component={DropDownList}   options={{presentation:'modal',headerTitle:'Select'}}  />
            <Drawer.Screen name={'Payment'} component={Payment} options={{headerTitle: 'Payment'}}/>


            <Stack.Screen name={'SalesReportNavigator'}  component={Report} options={{title: 'Sales Report'}}   />


        </Stack.Navigator>
    );
};



const ProfileSettingsNavigator = (props:any) => {

    return (
        <Stack.Navigator initialRouteName={'ProfileSettingsNavigator'} >
            <Stack.Screen name={'ProfileSettingsNavigator'}  component={General} options={{headerShown: false}}/>
            <Stack.Screen name={'AddEditItemNavigator'} component={AddEditItem}  options={{headerTitle:'Add Item'}}/>
            <Stack.Screen name={'AddEditCategory'} component={AddEditCategory}  options={{headerTitle:'Add Category'}} />
            <Stack.Screen name={'AddEditClient'} component={AddEditClient}  options={{headerTitle:'Add Client'}}  />
            <Stack.Screen name={'KOTPrinter'} component={KOTPrinter} options={{title: 'KOT Printer'}}/>
            <Stack.Screen name={'InvoicePrinter'} component={InvoicePrinter} options={{title: 'Invoice Printer'}}/>
            <Stack.Screen name={'InputOpenSetting'} component={InputOpenSetting} options={{title: 'Quick Quantity Unit'}}/>
            <Stack.Screen name={'DefaultInputValues'} component={DefaultInputValues} options={{title: 'Quick Quantity & Amount'}}/>

            <Stack.Screen name={'PrinterSettings'} component={PrinterSettings} options={{title: ''}}/>
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
