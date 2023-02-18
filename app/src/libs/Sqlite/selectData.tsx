
import {appLog, objToArray} from "../function";
import {closeDB, getDBConnection} from "./index";
import {TABLE} from "./config";
import {localredux, METHOD, urls} from "../static";
import apiService from "../api-service";
import moment from "moment";




export const getItemsByWhere = async ({itemgroupid,itemname,itemid,groupid,start,sku}:any) => {


    if(Boolean(urls.localserver)){

        let querystring = {}

        return new Promise(resolve => {

            if(Boolean(itemgroupid)){
                querystring = {
                    ...querystring,
                    itemgroupid: itemgroupid
                }
            }
            else if(Boolean(groupid)){
                querystring = {
                    ...querystring,
                    groupid: groupid
                }
            }
            else if(Boolean(itemname)){
                querystring = {
                    ...querystring,
                    search: itemname,
                    sku:Boolean(sku)
                }
            }

            apiService({
                method: METHOD.GET,
                action: 'item',
                queryString: querystring,
                hidealert:true,
                other: {url: urls.localserver},
            }).then((response: any) => {

                if(Boolean(response?.data)) {
                    let items = Object.values(response?.data).map((item:any)=>{
                        return item
                    })
                    resolve(items)
                }
            })
        })

    }
    else {

        const db: any = await getDBConnection();

        try {
            let items: any = [];
            await db.transaction(function (txn: any) {

                let where = ' 1 = 1 ';

                if (Boolean(itemgroupid)) {
                    where += ` and itemgroupid = '${itemgroupid}' `;
                }
                if (Boolean(groupid)) {
                    where += ` and groupid = '${groupid}' `;
                }
                if (Boolean(itemname)) {
                    where += ` and (itemname LIKE '%${itemname}%' or uniqueproductcode = '${itemname}') `;
                }
                if (Boolean(itemid)) {
                    where += ` and (itemid = '${itemid}') `;
                }

                const query = `SELECT *
                               FROM ${TABLE.ITEM}
                               where ${where}  order by itemname`; // limit ${start*20},20

                txn.executeSql(
                    query,
                    [],
                    function (tx: any, res: any) {
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
        await closeDB(db);

    }

}

export const getAddonByWhere = async ({itemgroupid,itemname,start}:any) => {

    if(Boolean(urls.localserver)){

        let querystring = {}

        return new Promise(resolve => {

            apiService({
                method: METHOD.GET,
                action: 'addon',
                queryString: querystring,
                hidealert:true,
                other: {url: urls.localserver},
            }).then((response: any) => {
                if(Boolean(response?.data)) {
                    resolve(response?.data)
                }
                resolve([])
            })
        })

    }
    else {

        const db: any = await getDBConnection();

        try {
            let items: any = {};
            await db.transaction(function (txn: any) {

                let where = ' 1 = 1 ';

                const query = `SELECT *
                               FROM ${TABLE.ADDON}
                               where ${where}  order by itemname`; // limit ${start*20},20

                txn.executeSql(
                    query,
                    [],
                    function (tx: any, res: any) {
                        for (let i = 0; i < res.rows.length; ++i) {
                            const {itemid, data} = res.rows.item(i);
                            items[itemid] = JSON.parse(data)
                        }
                    }
                );
            });

            return items
        } catch (e) {
            appLog('e', e)
        }
        await closeDB(db);
    }
}

export const getClientsByWhere = async ({displayname,phone,search,clienttype,start}:any) => {


    if(Boolean(urls.localserver)){

        return new Promise(resolve => {
            let querystring = {}
            if(Boolean(search) || Boolean(phone)){
                querystring = {
                    ...querystring,
                    search: search || phone,
                    clienttype:0
                }
            }

            apiService({
                method: METHOD.GET,
                action: 'client',
                hidealert:true,
                queryString:querystring,
                other: {url: urls.localserver},
            }).then((response: any) => {
                if(Boolean(response?.data)) {
                    let clients = Object.values(response?.data).map((client:any)=>{
                        return client
                    })
                    resolve(clients)
                }
                resolve([])
            })
        })

    }
    else {


        const db: any = await getDBConnection();

        try {
            let items: any = [];
            await db.transaction(function (txn: any) {

                let where = ' 1 = 1 ';

                if (Boolean(phone)) {
                    where += ` and (phone LIKE '%${phone}%') `;
                }
                else if (Boolean(displayname)) {
                    where += ` and (displayname LIKE '%${displayname}%') `;
                }
                else if (Boolean(search)) {
                    where += ` and ((displayname LIKE '%${search}%') or (phone LIKE '%${search}') or (clientid LIKE '%${search}'))`;
                }
                else if (Boolean(clienttype)) {
                    where += ` and ((clienttype = '${clienttype}'))`;
                }

                const query = `SELECT *
                               FROM ${TABLE.CLIENT}
                               where ${where} order by displayname`; // limit ${start*20},20

                txn.executeSql(
                    query,
                    [],
                    function (tx: any, res: any) {
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
        await closeDB(db);
    }
}

export const getTempOrdersByWhere = async () => {

    return new Promise<any>(async (resolve, reject)=>{

        let items: any = {};

        if(Boolean(urls.localserver)) {

           await apiService({
                method: METHOD.GET,
                action: 'tableorder',
                hidealert:true,
                hideLoader:true,
                other: {url: urls.localserver},
            }).then((response: any) => {
                if(Boolean(response?.data)) {
                    Object.values(response?.data).map((item:any)=>{
                         items[item.tableorderid] = item;
                    })
                }
            })
            resolve(items)
        }
        else{

            const db: any = await getDBConnection();

            try {
                await db.transaction(function (txn: any) {

                    let where = ' 1 = 1 ';
                    const query = `SELECT *
                                   FROM ${TABLE.TEMPORDER}
                                   where ${where}`;
                    txn.executeSql(
                        query,
                        [],
                        function (tx: any, res: any) {
                            for (let i = 0; i < res.rows.length; ++i) {
                                const {tableorderid, data}: any = res.rows.item(i);
                                items[tableorderid] = JSON.parse(data)
                            }
                        }
                    );
                });

            } catch (e) {
                appLog('get temp orders', e)
            }

            await closeDB(db);

        }

        resolve(items)



    })


}

export const getOrdersByWhere = async () => {
    const db:any = await getDBConnection();

    try {
        let items:any={};
        await db.transaction(function (txn:any) {

            let where=' 1 = 1 ';
            const query = `SELECT * FROM ${TABLE.ORDER} where  ${where}`;
            txn.executeSql(
                query,
                [],
                function (tx:any, res:any) {
                    for (let i = 0; i < res.rows.length; ++i) {
                        const {orderid,data}:any = res.rows.item(i);
                        items[orderid] = JSON.parse(data)
                    }
                }
            );
        });

        return items
    } catch (e) {
        appLog('get orders', e)
    }
    await closeDB(db);
}


export const readTable = async (tablename:any,{start}:any) => {
    const db:any = await getDBConnection();
    try {
        let items:any=[];
        await db.transaction(function (txn:any) {
            txn.executeSql(
                `SELECT * FROM ${tablename}  limit ?*100,100`,
                [start],
                function (tx:any, res:any) {

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
    await closeDB(db);
}
