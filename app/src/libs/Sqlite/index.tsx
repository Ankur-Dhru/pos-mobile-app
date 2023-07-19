import {deleteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {
    ADD_COLUMN_ITEM_GROUPID, ADD_COLUMN_ITEM_SKU,ADD_COLUMN_ITEM_TREATBY,
    CREATE_ADDON_TABLE,
    CREATE_CLIENT_TABLE, CREATE_ITEM_INDEX_ITEMGROUPID, CREATE_ITEM_INDEX_ITEMNAME, CREATE_ITEM_INDEX_ITEMUNIQUE,
    CREATE_ITEM_TABLE, CREATE_LOG_TABLE,
    CREATE_ORDER_TABLE, CREATE_SKU_TABLE,
    CREATE_TEMPORDER_TABLE
} from "./config";
import {db} from "../static";
import {appLog} from "../function";

enablePromise(true);

export const getDBConnection = async () => {
    if(Boolean(db?.name)) {
        return await openDatabase({name: `${db.name}-terminal-data.db`, location: 'default'});
    }
    return false
};

export const deleteDB = async () => {
    if(Boolean(db?.name)) {
        return await deleteDatabase({name: `${db.name}-terminal-data.db`, location: 'default'});
    }
    return false
};

export const closeDB = async (db:any) => {
     await db.close()
};


export const createTables = async () => {
    const db:any = await getDBConnection();

    if(Boolean(db)) {

        db.executeSql(CREATE_ITEM_TABLE);
        db.executeSql(CREATE_ADDON_TABLE);
        db.executeSql(CREATE_CLIENT_TABLE);
        db.executeSql(CREATE_ORDER_TABLE);
        db.executeSql(CREATE_TEMPORDER_TABLE);
        db.executeSql(CREATE_LOG_TABLE);

       // db.executeSql(CREATE_SKU_TABLE);

        db.executeSql(ADD_COLUMN_ITEM_GROUPID);
        db.executeSql(ADD_COLUMN_ITEM_SKU);
        db.executeSql(ADD_COLUMN_ITEM_TREATBY);

        db.executeSql(CREATE_ITEM_INDEX_ITEMGROUPID);
        db.executeSql(CREATE_ITEM_INDEX_ITEMNAME);
        db.executeSql(CREATE_ITEM_INDEX_ITEMUNIQUE);

        appLog('table created')
    }
    else{
        appLog('no database found')
    }
}




