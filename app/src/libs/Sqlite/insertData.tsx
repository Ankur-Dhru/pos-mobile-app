import {appLog} from "../function";
import {closeDB, getDBConnection} from "./index";
import apiService from "../api-service";
import {device, METHOD, STATUS, urls} from "../static";


export const insertInit = async (  initdata?: any) => {
    const db:any = await getDBConnection();

    let insertQuery:any = [];

    if(initdata) {

        Object.keys(initdata).map((key:any)=>{

            let values = `(${key},   '${JSON.stringify(initdata[key])}' )`;

            insertQuery = `INSERT OR REPLACE INTO tblInit("id","data") values ${values}`;

            try {
                 db.executeSql(insertQuery);
            }
            catch (e) {
                appLog('ERROR',insertQuery)
                appLog('e',e)
            }

        })


    }
    await closeDB(db);
};


export const insertItems = async (  itemsdata?: any,type:any = 'all') => {

    const db:any = await getDBConnection();
    const regx = /[^a-zA-Z0-9_. -]/g;

    let insertQuery:any = [];

  if(itemsdata?.length > 0) {

      for (const data of itemsdata) {

          data.itemname = data?.itemname?.replace(regx," ");
          data.groupname =  data?.groupname?.replace(regx," ");
          let values = `(${data?.itemid}, "${data?.itemname}", "${data?.itemgroupid}", "${data?.uniqueproductcode}","${data?.sku}", '${JSON.stringify(data)}', "${data?.itemstatus}", ${data?.pricealert}, "${data?.groupid}", "${data?.treatitem}")`;

          if(type === 'all'){
              insertQuery.push(values);
          }
          else{
              insertQuery = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","sku","data","itemstatus","pricealert","groupid","treatby") values ${values}`;
              try {
                  const results = await db.executeSql(insertQuery);
              }
              catch (e) {
                  appLog('ERROR',insertQuery)
              }
          }
      }

      if(type === 'all'){

          try {
              const query = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","sku","data","itemstatus","pricealert","groupid","treatby") values ${insertQuery.join(', ')}`;
              try {
                  const results = await db.executeSql(query);
              }
              catch (e) {
                  appLog('ERROR',query)
              }
          }
          catch (e) {
              appLog('insertItems e',e)
          }



      }
  }
    await closeDB(db);
};


export const insertAddons = async (  itemsdata?: any,type:any = 'all') => {
    const db:any = await getDBConnection();
    const regx = /[^a-zA-Z0-9_. -]/g;

    let insertQuery:any = [];

    if(itemsdata?.length > 0) {

        for (const data of itemsdata) {

            data.itemname = data?.itemname?.replace(regx," ");
            data.groupname =  data?.groupname?.replace(regx," ");
            let values = `(${data?.itemid}, "${data?.itemname}", "${data?.itemgroupid}", "${data?.uniqueproductcode}", '${JSON.stringify(data)}', "${data?.itemstatus}", ${data?.pricealert})`;

            if(type === 'all'){
                insertQuery.push(values);
            }
            else{
                insertQuery = `INSERT OR REPLACE INTO tblAddon("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${values}`;
                try {
                    await db.executeSql(insertQuery);
                }
                catch (e) {
                    appLog('ERROR',insertQuery)
                }
            }
        }

        if(type === 'all'){
            const query = `INSERT OR REPLACE INTO tblAddon("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${insertQuery.join(', ')}`;
            try {
                const results = await db.executeSql(query);
            }
            catch (e) {
                appLog('ERROR',query)
            }

        }
    }
    await closeDB(db);
};


export const insertClients = async (  clientsdata?: any,type:any = 'all') => {
    const db:any = await getDBConnection();

    let insertQuery:any = [];

    if(clientsdata?.length > 0) {

        for (const data of clientsdata) {

            let values = `(${data?.clientid}, "${data?.displayname}", "${data?.phone}", "${data?.taxregtype}", '${JSON.stringify(data)}', "${data?.clienttype}", "${Boolean(data?.phonebook)?1:0}")`;

            if(type === 'all'){
                insertQuery.push(values);
            }
            else{
                insertQuery = `INSERT OR REPLACE INTO tblClient("clientid","displayname","phone","taxregtype","data","clienttype","phonebook") values ${values}`;

                try {
                    await db.executeSql(insertQuery);
                }
                catch (e) {
                    appLog('ERROR',insertQuery)
                }
            }
        }

        if(type === 'all'){
            const query = `INSERT OR REPLACE INTO tblClient("clientid","displayname","phone","taxregtype","data","clienttype","phonebook") values ${insertQuery.join(', ')}`;
            try {
                const results = await db.executeSql(query);
            }
            catch (e) {
                appLog('ERROR',query)
            }


        }
    }
    await closeDB(db);
};


export const insertSkus = async (  skusdata?: any,type:any = 'all') => {
    const db:any = await getDBConnection();

    let insertQuery:any = [];

    if(skusdata?.length > 0) {

        for (const data of skusdata) {

            let values = `(${data?.sku}, "${data?.itemid}")`;

            if(type === 'all'){
                insertQuery.push(values);
            }
            else{
                insertQuery = `INSERT OR REPLACE INTO tblClient("skuid","itemid") values ${values}`;

                try {
                    await db.executeSql(insertQuery);
                }
                catch (e) {
                    appLog('ERROR',insertQuery)
                }
            }
        }

        if(type === 'all'){
            const query = `INSERT OR REPLACE INTO tblClient("skuid","itemid") values ${insertQuery.join(', ')}`;
            try {
                const results = await db.executeSql(query);
            }
            catch (e) {
                appLog('ERROR',query)
            }


        }
    }
    await closeDB(db);
};


export const insertTempOrder =  (data?: any) => {

    return new Promise<any>(async (resolve)=> {

        let order = data;

        if(Boolean(urls.localserver)) {
            await apiService({
                method: data?.tableorderid ? METHOD.PUT : METHOD.POST,
                action: 'tableorder',
                body: {...data,deviceid:device.uniqueid},
                other: {url: urls.localserver},
            }).then((response: any) => {

                const {status}:any = response;
                if (status === STATUS.SUCCESS) {
                    order = response?.data
                }
                else{
                    order = false
                }
            })

        }
        else {

            const db: any = await getDBConnection();

            let values = `('${data?.tableorderid}', '${JSON.stringify(data)}')`;
            let insertQuery = `INSERT
            OR REPLACE INTO tblTempOrder("tableorderid","data") values
            ${values}`;

            try {
                await db.executeSql(insertQuery);

            } catch (e) {
                appLog('ERROR', insertQuery)
            }
            await closeDB(db);

        }
        resolve(order)
    })
};

export const insertOrder =  (data?: any) => {
    return new Promise<any>(async (resolve)=>{
        const db:any = await getDBConnection();
        let values = `('${data?.orderid}', '${JSON.stringify(data)}')`;
        let  insertQuery = `INSERT OR REPLACE INTO tblOrder("orderid","data") values ${values}`;
        try {
            await db.executeSql(insertQuery);
        }
        catch (e) {
            appLog('ERROR',insertQuery)
        }
        await closeDB(db);
        resolve('Inset Order')
    })

};


export const insertLog =  (data?: any) => {
    return new Promise<any>(async (resolve)=>{
        const db:any = await getDBConnection();
        let values = `('${JSON.stringify(data)}')`;
        let  insertQuery = `INSERT OR REPLACE INTO tblLog("data") values ${values}`;
        appLog('insertLog insertQuery',insertQuery)
        try {
            await db.executeSql(insertQuery);
        }
        catch (e) {
            appLog('ERROR',insertQuery)
        }
        await closeDB(db);
        resolve('Inset Log')
    })

};











