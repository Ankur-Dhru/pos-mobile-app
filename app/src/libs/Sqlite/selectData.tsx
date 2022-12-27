
import {appLog} from "../function";
import {closeDB, getDBConnection} from "./index";
import {TABLE} from "./config";




export const getItemsByWhere = async ({itemgroupid,itemname,itemid,start}:any) => {
    const db:any = await getDBConnection();

    try {
        let items:any=[];
        await db.transaction(function (txn:any) {

            let where=' 1 = 1 ';

            if(Boolean(itemgroupid)){
              where += ` and itemgroupid = '${itemgroupid}' `;
            }
            if(Boolean(itemname)){
                where += ` and (itemname LIKE '%${itemname}%' or uniqueproductcode = '${itemname}') `;
            }
            if(Boolean(itemid)){
                where += ` and (itemid = '${itemid}') `;
            }

           const query = `SELECT * FROM ${TABLE.ITEM} where  ${where}`; // limit ${start*20},20

            txn.executeSql(
                query,
                [],
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
    closeDB(db);
}

export const getAddonByWhere = async ({itemgroupid,itemname,start}:any) => {
    const db:any = await getDBConnection();

    try {
        let items:any={};
        await db.transaction(function (txn:any) {

            let where=' 1 = 1 ';

            const query = `SELECT * FROM ${TABLE.ADDON} where  ${where}`; // limit ${start*20},20

            txn.executeSql(
                query,
                [],
                function (tx:any, res:any) {
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
    closeDB(db);
}

export const getClientsByWhere = async ({displayname,phone,search,clienttype,start}:any) => {
    const db:any = await getDBConnection();

    try {
        let items:any=[];
        await db.transaction(function (txn:any) {

            let where=' 1 = 1 ';

            if(Boolean(phone)){
                where += ` and (phone LIKE '%${phone}%') `;
            }
            if(Boolean(displayname)){
                where += ` and (displayname LIKE '%${displayname}%') `;
            }
            if(Boolean(search)){
                where += ` and ((displayname LIKE '%${search}%') or (phone LIKE '%${search}') or (clientid LIKE '%${search}'))`;
            }
            if(Boolean(clienttype)){
                where += ` and ((clienttype = '${clienttype}'))`;
            }

            const query = `SELECT * FROM ${TABLE.CLIENT} where  ${where}`; // limit ${start*20},20

            txn.executeSql(
                query,
                [],
                function (tx:any, res:any) {
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
    closeDB(db);
}

export const getTempOrdersByWhere = async () => {

    return new Promise<any>(async (resolve, reject)=>{
        const db:any = await getDBConnection();
        let items:any={};

        try {
            await db.transaction(function (txn:any) {

                let where=' 1 = 1 ';
                const query = `SELECT * FROM ${TABLE.TEMPORDER} where  ${where}`;
                txn.executeSql(
                    query,
                    [],
                    function (tx:any, res:any) {
                        for (let i = 0; i < res.rows.length; ++i) {
                            const {tableorderid,data}:any = res.rows.item(i);
                            items[tableorderid] = JSON.parse(data)
                        }
                    }
                );
            });

        } catch (e) {
            appLog('get temp orders', e)
        }

        closeDB(db);
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
    closeDB(db);
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
    closeDB(db);
}
