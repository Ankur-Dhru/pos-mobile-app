/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
//import App from './App';
import {name as appName} from './app.json';

import firebase from '@react-native-firebase/app';

const credentials = {
    clientId: '83240213505-96i3jb62c2gmt806r040fi0jnal7vn9a.apps.googleusercontent.com',
    appId: '1:383240213505:android:22b924af76622bec429c00',
    apiKey: 'AIzaSyDP76ZTYH7qfx_b-ez5bdEzO-C3MwhC3fo',
    databaseURL: '',
    storageBucket: 'dhru-pos-44ea7.appspot.com',
    messagingSenderId: '',
    projectId: 'dhru-pos-44ea7',
};

if (!firebase?.apps?.length) {
    firebase.initializeApp(credentials).then();
}
else{
     firebase.app();
}


AppRegistry.registerComponent(appName, () => App);
