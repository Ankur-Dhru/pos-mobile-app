import React from "react";
import 'react-native-gesture-handler';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import StaffList from "../Pin/Stafflist";
import Terminal from "../Setup/Terminal";
import Workspaces from "../Setup/Workspaces";
import Login from "../Setup/Login";
import Pin from "../Pin";
import {localredux, screenOptionStyle} from "../../libs/static";

import Splash from "../Splash";
import {createDrawerNavigator} from "@react-navigation/drawer";
import DrawerNavigatorContent from ".//DrawerNavigatorContent"
import Tables from "../Tables";
import Cart from "../Cart";
import {isRestaurant} from "../../libs/function";
import DetailView from "../Cart/DetailView";
import Payment from "../Cart/Payment";
import Preview from "../Cart/Preview";
import SearchItem from "../Items/SearchItem";
import Report from "../Report";

const screenOptions = {...screenOptionStyle};


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


const MainStackNavigator = () => {
    return (
        <Stack.Navigator

            initialRouteName={'SplashStackNavigator'}
            screenOptions={{...screenOptions, headerShown: false}}
        >
            <Stack.Screen name="SplashStackNavigator" component={SplashStackNavigator}/>

            <Stack.Screen name="SetupStackNavigator" component={SetupStackNavigator}/>

            <Stack.Screen name="PinStackNavigator" component={PinStackNavigator}/>

            <Stack.Screen name={'DrawerStackNavigator'} component={DrawerStackNavigator}/>

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
            <Stack.Screen name="Workspaces" component={Workspaces}
                          options={{headerShown: false, headerTitle: 'Workspaces', headerLargeTitle: false}}/>

            <Stack.Screen name="Terminal" component={Terminal}
                          options={{headerShown: false, headerTitle: 'Terminal', headerLargeTitle: false}}/>

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


const TablesStackNavigator = (props:any) => {
    const {route: {params}}:any = props
    return (
        <Stack.Navigator initialRouteName={'Tables'}>
            <Stack.Screen name={'Tables'} {...params} component={Tables} options={{headerShown: false}}/>
            <Stack.Screen name={'CartStackNavigator'} {...params} component={CartStackNavigator}
                          options={({route}: any) => ({headerShown: false, title: route?.params?.tablename})}/>
        </Stack.Navigator>
    );
};

const CartStackNavigator = (props:any) => {
    const {route: {params}}:any = props
    return (
        <Stack.Navigator initialRouteName={'Cart'} >
            <Stack.Screen name={'Cart'} component={()=><Cart tabledetails={params}/>}  options={{headerShown: false}}/>
            <Stack.Screen name={'SearchItem'} component={()=><SearchItem />}  options={{headerShown: false}}/>
            <Stack.Screen name={'DetailView'} component={DetailView}   options={{headerShown: false, headerTitle: 'Detail View'}}/>
            <Stack.Screen name={'Payment'} component={Payment} options={{headerShown: false, headerTitle: 'Payment'}}/>
            <Stack.Screen name={'Preview'} component={Preview} options={{headerShown: false, headerTitle: 'Preview'}}/>
        </Stack.Navigator>
    );
};


const SalesReportNavigator = (props:any) => {
    const {route: {params}}:any = props
    return (
        <Stack.Navigator initialRouteName={'Report'} >
            <Stack.Screen name={'Report'} component={Report}  options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const DrawerStackNavigator = () => {

    const {firstname, lastname}: any = localredux.authData;

    const screenOption: any = {
        ...screenOptionStyle,
        /*headerLeft:()=><View style={[styles.px_5]}><TouchableOpacity onPress={()=>{}}>
            <Avatar label={firstname + ' ' +lastname} value={1} size={28}  />
        </TouchableOpacity>
        </View>,*/
    };
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerNavigatorContent {...props}/>}
            initialRouteName={isRestaurant() ? 'TablesStackNavigator' : 'CartStackNavigator'}
            screenOptions={{...screenOption, headerShown: false}}>
            <Drawer.Screen name={'TablesStackNavigator'} component={TablesStackNavigator}
                           options={{headerShown: false, headerTitle: 'Tables'}}/>
            <Drawer.Screen name={'CartStackNavigator'} component={CartStackNavigator} options={({route}: any) => ({
                headerShown: false,
                title: route?.params?.tablename || 'POS'
            })}/>
            <Drawer.Screen name={'SalesReportNavigator'} component={SalesReportNavigator} options={({route}: any) => ({
                headerShown: false,
                title: route?.params?.tablename || 'POS'
            })}/>
        </Drawer.Navigator>
    );
};


export {
    MainStackNavigator,
};
