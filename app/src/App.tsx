
import * as React from 'react';
import {Appearance, Dimensions, LogBox, TouchableOpacity, useColorScheme, View,} from 'react-native';

import {Provider} from "react-redux";
import store from "./redux-store/store";



import ActivityIndicator from "./components/ActivityIndicator";
import BottomSheet from "./components/BottomSheet";
import Modal from "./components/Modal";
import 'react-native-get-random-values';

import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import {
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme, Paragraph,
    Provider as PaperProvider,
} from 'react-native-paper';


import {configureFontAwesomePro} from "react-native-fontawesome-pro";

import SnackBar from "./components/SnackBar";
import {db, device} from "./libs/static";
import Dialog from "./components/Dialog";
import Page from "./components/Page";
import NetworkStatus from "./components/NetworkStatus";
import {styles} from "./theme";
import {MainStackNavigator} from "./pages/General/MainNavigator";
//import {firebase} from "@react-native-firebase/analytics";

import {
    SafeAreaView,
    StatusBar,
    Platform,
    Linking,
} from 'react-native';

//import BackgroundService from "react-native-background-actions"



import {appLog, CheckConnectivity, getOrders, isEmpty, retrieveData, syncInvoice} from "./libs/function";
import {useEffect} from "react";

// Add this code on your app.js


configureFontAwesomePro();

LogBox.ignoreAllLogs();


const {height, width} = Dimensions.get('window');
const aspectRatio = height / width;

if (width < 960) {
    device.tablet = false
}


//firebase.analytics().setAnalyticsCollectionEnabled(true).then(r => {});


const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));


export let options = {
    taskName: 'Invoice',
    taskTitle: 'Invoice Created',
    taskDesc: '',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: '',
    parameters: {
        delay: 30000,
    },
};

retrieveData(`fusion-dhru-pos-settings`).then(async (data: any) => {
    const {syncinvoiceintervaltime} = data;
    options = {
        ...options,
        parameters: {
            delay: +syncinvoiceintervaltime,
        },
    }
})

/*BackgroundService.on('expiration', () => {
    console.log('I am being closed :(');
});*/

/*export const backgroundSync = async (taskData: any) => {

    await new Promise(async (resolve) => {
        const { delay } = taskData;

        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log('delay',delay)
            await sleep(delay);
            if (Boolean(db?.name)) {
                CheckConnectivity().then((connection)=>{
                    getOrders().then(async (orders: any) => {
                        if (!isEmpty(orders)) {
                            let invoice: any = Object.values(orders)[0];
                            if(connection) {
                                syncInvoice({...invoice, savingmode: 'sync', version: '3.6.8'}).then();
                            }
                        }
                        else{
                            console.log('stop background')
                            await BackgroundService.stop();
                        }
                    })
                })
            }
        }
        resolve(true)
    });
};*/

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    // StatusBar.setHidden(true);

    const CombinedDefaultTheme = {
        ...PaperDefaultTheme,
        ...NavigationDefaultTheme,
        roundness: 5,
        dark: false,
        colors: {
            ...PaperDefaultTheme.colors,
            ...NavigationDefaultTheme.colors,
            backdrop: '#eee',
            bottomNavigation: 'white',
            inputbox: 'black',
            inputLabel: '#666',
            backgroundColor: 'transparent',
            elevation: 2,
            screenbg: '#f4f4f4',
            surface: '#fff',
            primary: '#0E4194',
            accent: '#0E4194',
            secondary: '#c4dcff',
            thirdary: '#fbb360',
            forthary: '#6eabfd',
            divider: '#eee',
            filterbox: '#E6EFFE',
            loadersecondary: '#eeeeee',
            loaderprimary: '#ddd',
            walkthroughbg: "#fff"
        },
    };
    const CombinedDarkTheme = {
        ...PaperDarkTheme,
        ...NavigationDarkTheme,
        dark: true,
        mode: 'adaptive',
        colors: {
            ...PaperDarkTheme.colors,
            ...NavigationDarkTheme.colors,
            backdrop: '#000',
            bottomNavigation: 'black',
            backgroundColor: 'transparent',
            elevation: 2,
            inputbox: 'white',
            screenbg: '#000',
            inputLabel: '#ccc',
            surface: '#121212',
            primary: '#eee',
            accent: '#fff',
            secondary: '#c4dcff',
            thirdary: '#fbb360',
            divider: '#464646',
            filterbox: '#000',
            loadersecondary: '#222',
            loaderprimary: '#000',
            walkthroughbg: "#333"
        },
    };

    const colorScheme = Appearance.getColorScheme();

    let theme = colorScheme;


    let themeis: any = (theme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme);


    return (
        <Provider store={store}>
            <SafeAreaView style={[styles.h_100]}>
                <PaperProvider theme={CombinedDefaultTheme}>

                    <StatusBar backgroundColor={styles.primary.color} />

                      <NavigationContainer>
                           <MainStackNavigator/>
                        </NavigationContainer>


                     <Page/>
                    <Modal/>
                    <BottomSheet/>
                    <Dialog/>
                    <SnackBar/>
                    <ActivityIndicator/>
                    <NetworkStatus/>




                </PaperProvider>
            </SafeAreaView>
        </Provider>
    );
};


export default App;
