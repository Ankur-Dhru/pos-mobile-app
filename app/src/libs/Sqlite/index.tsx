import {deleteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {
    CREATE_ADDON_TABLE,
    CREATE_CLIENT_TABLE, CREATE_ITEM_INDEX_ITEMGROUPID, CREATE_ITEM_INDEX_ITEMNAME, CREATE_ITEM_INDEX_ITEMUNIQUE,
    CREATE_ITEM_TABLE,
    CREATE_ORDER_TABLE,
    CREATE_TEMPORDER_TABLE
} from "./config";
import {db} from "../static";

enablePromise(true);

export const getDBConnection = async () => {
    return await openDatabase({name: `${db.name}-terminal-data.db`, location: 'default'});
};

export const deleteDB = async () => {
    return await deleteDatabase({name: `${db.name}-terminal-data.db`, location: 'default'});
};


export const createTables = async () => {
    const db:any = await getDBConnection();

    db.executeSql(CREATE_ITEM_TABLE);
    db.executeSql(CREATE_ADDON_TABLE);
    db.executeSql(CREATE_CLIENT_TABLE);
    db.executeSql(CREATE_ORDER_TABLE);
    db.executeSql(CREATE_TEMPORDER_TABLE);

    db.executeSql(CREATE_ITEM_INDEX_ITEMGROUPID);
    db.executeSql(CREATE_ITEM_INDEX_ITEMNAME);
    db.executeSql(CREATE_ITEM_INDEX_ITEMUNIQUE);
}




