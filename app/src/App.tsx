import * as React from 'react';
import {
    Appearance, Dimensions,
    LogBox,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import {Provider} from "react-redux";
import store from "./redux-store/store";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import ActivityIndicator from "./components/ActivityIndicator";
import BottomSheet from "./components/BottomSheet";
import PageSheet from "./components/PageSheet";
import NetworkStatus from "./components/NetworkStatus"
import Modal from "./components/Modal";
import 'react-native-get-random-values';

import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import {
    Appbar,
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';


import {configureFontAwesomePro} from "react-native-fontawesome-pro";
import {MainStackNavigator} from "./pages/Navigation/MainNavigator";
import SnackBar from "./components/SnackBar";
import {device} from "./libs/static";
import Dialog from "./components/Dialog";
import {appLog, isEmpty, retrieveData} from './libs/function';
import {useEffect} from "react";
import {showLoader} from "./redux-store/reducer/component";
import Page from "./components/Page";
import {styles} from "./theme";


configureFontAwesomePro();

LogBox.ignoreAllLogs();


const {height, width} = Dimensions.get('window');
const aspectRatio = height / width;

if (aspectRatio > 1.6) {
    device.tablet = false
}


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
            primary: '#222A55',
            accent: '#2d71d2',
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
            <PaperProvider theme={CombinedDefaultTheme}>
                <SafeAreaProvider>
                <StatusBar barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
                           backgroundColor={CombinedDefaultTheme.colors.primary}/>
                <NetworkStatus/>
                <SafeAreaView  style={[styles.h_100]}  edges={['top', 'left', 'right','bottom']}>

                        <NavigationContainer>
                            <MainStackNavigator/>
                        </NavigationContainer>


                    {/*<PageSheet/>*/}
                    <Page/>
                    <Modal/>
                    <BottomSheet/>
                    <Dialog/>
                    <SnackBar/>
                    <ActivityIndicator/>
                </SafeAreaView>
                </SafeAreaProvider>
            </PaperProvider>
        </Provider>
    );
};


export default App;
