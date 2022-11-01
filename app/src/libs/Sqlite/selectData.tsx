//import {v4 as uuidv4} from "uuid";

import {SQLiteDatabase} from "react-native-sqlite-storage";
import {appLog,  errorAlert} from "../function";
import {getDBConnection} from "./index";
import {TABLE} from "./config";




export const getItemsByWhere = async ({itemgroupid,itemname}:any) => {
    const db = await getDBConnection();
    try {
        let items:any=[];
        await db.transaction(function (txn) {
            txn.executeSql(
                `SELECT * FROM ${TABLE.ITEM} where  (itemgroupid = ?) or (itemname LIKE '%'&?&'%')`,
                [itemgroupid,itemname],
                function (tx, res) {

                    for (let i = 0; i < res.rows.length; ++i)
                        items.push(res.rows.item(i))

                    appLog('item:', res.rows.length);
                }
            );
        });
        return items
    } catch (e) {
        appLog('e', e)
    }
    db.close().then()
}

export const readTable = async (tablename:any) => {
    const db = await getDBConnection();
    try {
        let items:any=[];
        await db.transaction(function (txn) {
            txn.executeSql(
                `SELECT * FROM ${tablename}`,
                [],
                function (tx, res) {

                    for (let i = 0; i < res.rows.length; ++i)
                        items.push(res.rows.item(i))

                    appLog('item:', res.rows.length);
                }
            );
        });
        return items
    } catch (e) {
        appLog('e', e)
    }
    db.close().then()
}
