//import {v4 as uuidv4} from "uuid";

import {SQLiteDatabase} from "react-native-sqlite-storage";
import {appLog,  errorAlert} from "../function";
import {getDBConnection} from "./index";
import {TABLE} from "./config";




export const getItemsByWhere = async ({itemgroupid,itemname,start}:any) => {
    const db = await getDBConnection();

    try {
        let items:any=[];
        await db.transaction(function (txn) {

            let where=' 1 = 1 ';

            if(Boolean(itemgroupid)){
              where += ` and itemgroupid = '${itemgroupid}' `;
            }
            if(Boolean(itemname)){
                where += ` and (itemname LIKE '%${itemname}%' or uniqueproductcode = '${itemname}') `;
            }

           const query = `SELECT * FROM ${TABLE.ITEM} where  ${where}`; // limit ${start*20},20

            txn.executeSql(
                query,
                [],
                function (tx, res) {

                    for (let i = 0; i < res.rows.length; ++i)
                        items.push(res.rows.item(i))

                }
            );
        });
        return items
    } catch (e) {
        appLog('e', e)
    }
    db.close().then()
}

export const readTable = async (tablename:any,{start}:any) => {
    const db = await getDBConnection();
    try {
        let items:any=[];
        await db.transaction(function (txn) {
            txn.executeSql(
                `SELECT * FROM ${tablename}  limit ?*100,100`,
                [start],
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