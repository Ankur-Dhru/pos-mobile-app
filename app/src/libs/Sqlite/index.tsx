import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
    return await openDatabase({name: 'fusion-pro-pos-terminal-data.db', location: 'default'});
};







