import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';
import {
    CREATE_CLIENT_TABLE,
   CREATE_ITEM_TABLE,
    CREATE_ORDER_TABLE,

} from "./config";

enablePromise(true);

export const getDBConnection = async () => {
    return await openDatabase({name: 'fusion-pro-pos-terminal-data.db', location: 'default'});
};


const createAllTable = async (db: SQLiteDatabase) => {

    await db.executeSql(CREATE_ITEM_TABLE);

    /*await db.executeSql(CREATE_CLIENT_TABLE);
    await db.executeSql(CREATE_DRAWER_TABLE);
    await db.executeSql(CREATE_ITEM_TABLE);
    await db.executeSql(CREATE_ORDER_TABLE);
    await db.executeSql(CREATE_PAYMENT_RECEIVE);
    await db.executeSql(CREATE_SETTING_TABLE);
    await db.executeSql(CREATE_SKU_TABLE);
    await db.executeSql(CREATE_STAFF_TABLE);
    await db.executeSql(CREATE_TABLES_ORDER_TABLE);*/

}



