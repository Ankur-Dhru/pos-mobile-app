//import {v4 as uuidv4} from "uuid";

import {SQLiteDatabase} from "react-native-sqlite-storage";
import {appLog,  errorAlert} from "../function";
import {getDBConnection} from "./index";




export const readTable = async (tablename:any,itemgroupid?:any) => {
    const db = await getDBConnection();
    try {
        let items:any=[];
        await db.transaction(function (txn) {
            txn.executeSql(
                `SELECT * FROM ${tablename} where itemgroupid = ?`,
                [itemgroupid],
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
