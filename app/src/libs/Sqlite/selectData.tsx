
import {appLog} from "../function";
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
                    for (let i = 0; i < res.rows.length; ++i) {
                        items.push(JSON.parse(res.rows.item(i).data))
                    }
                }
            );
        });
        return items
    } catch (e) {
        appLog('e', e)
    }
    db.close().then()
}

export const getAddonByWhere = async ({itemgroupid,itemname,start}:any) => {
    const db = await getDBConnection();

    try {
        let items:any={};
        await db.transaction(function (txn) {

            let where=' 1 = 1 ';

            const query = `SELECT * FROM ${TABLE.ADDON} where  ${where}`; // limit ${start*20},20

            txn.executeSql(
                query,
                [],
                function (tx, res) {
                    for (let i = 0; i < res.rows.length; ++i) {
                        const {itemid,data} = res.rows.item(i);
                        items[itemid] = JSON.parse(data)
                    }
                }
            );
        });

        return items
    } catch (e) {
        appLog('e', e)
    }
    db.close().then()
}

export const getClientsByWhere = async ({displayname,phone,search,start}:any) => {
    const db = await getDBConnection();

    try {
        let items:any=[];
        await db.transaction(function (txn) {

            let where=' 1 = 1 ';

            if(Boolean(phone)){
                where += ` and (phone LIKE '%${phone}%') `;
            }
            if(Boolean(displayname)){
                where += ` and (displayname LIKE '%${displayname}%') `;
            }
            if(Boolean(search)){
                where += ` and ((displayname LIKE '%${search}%') or (phone LIKE '%${search}'))`;
            }

            const query = `SELECT * FROM ${TABLE.CLIENT} where  ${where}`; // limit ${start*20},20

            txn.executeSql(
                query,
                [],
                function (tx, res) {
                    for (let i = 0; i < res.rows.length; ++i) {
                        items.push(JSON.parse(res.rows.item(i).data))
                    }
                }
            );
        });
        return items
    } catch (e) {
        appLog('get clients', e)
    }
    db.close().then()
}

export const getTempOrdersByWhere = async () => {
    const db = await getDBConnection();

    try {
        let items:any=[];
        await db.transaction(function (txn) {

            let where=' 1 = 1 ';
            const query = `SELECT * FROM ${TABLE.TEMPORDER} where  ${where}`;
            txn.executeSql(
                query,
                [],
                function (tx, res) {
                    for (let i = 0; i < res.rows.length; ++i) {
                        items.push(JSON.parse(res.rows.item(i).data))
                    }
                }
            );
        });
        return items
    } catch (e) {
        appLog('get temp orders', e)
    }
    db.close().then()
}

export const getOrdersByWhere = async () => {
    const db = await getDBConnection();

    try {
        let items:any=[];
        await db.transaction(function (txn) {

            let where=' 1 = 1 ';
            const query = `SELECT * FROM ${TABLE.ORDER} where  ${where}`;
            txn.executeSql(
                query,
                [],
                function (tx, res) {
                    for (let i = 0; i < res.rows.length; ++i) {
                        items.push(JSON.parse(res.rows.item(i).data))
                    }
                }
            );
        });
        appLog('items.length',items.length)
        return items
    } catch (e) {
        appLog('get orders', e)
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

                    for (let i = 0; i < res.rows.length; ++i) {
                        items.push(JSON.parse(res.rows.item(i).data))
                    }


                }
            );
        });
        return items
    } catch (e) {
        appLog('e', e)
    }
    db.close().then()
}
