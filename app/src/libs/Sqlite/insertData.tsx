
import {appLog} from "../function";
import {closeDB, getDBConnection} from "./index";


export const insertInit = async (  initdata?: any) => {
    const db:any = await getDBConnection();

    let insertQuery:any = [];

    if(initdata) {

        Object.keys(initdata).map((key:any)=>{

            let values = `(${key},   '${JSON.stringify(initdata[key])}' )`;

            insertQuery = `INSERT OR REPLACE INTO tblInit("id","data") values ${values}`;
            appLog('insertQuery',insertQuery)
            try {
                 db.executeSql(insertQuery);
            }
            catch (e) {
                appLog('ERROR',insertQuery)
                appLog('e',e)
            }

        })


    }
    closeDB(db);
};


export const insertItems = async (  itemsdata?: any,type:any = 'all') => {

    const db:any = await getDBConnection();
    const regx = /[^a-zA-Z0-9_. -]/g;

    let insertQuery:any = [];

  if(itemsdata?.length > 0) {

      for (const data of itemsdata) {

          data.itemname = data?.itemname?.replace(regx," ");
          data.groupname =  data?.groupname?.replace(regx," ");
          let values = `(${data?.itemid}, "${data?.itemname}", "${data?.itemgroupid}", "${data?.uniqueproductcode}", '${JSON.stringify(data)}', "${data?.itemstatus}", ${data?.pricealert}, "${data?.groupid}")`;

          if(type === 'all'){
              insertQuery.push(values);
          }
          else{
              insertQuery = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert","groupid") values ${values}`;
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
              const query = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert","groupid") values ${insertQuery.join(', ')}`;
              const results = await db.executeSql(query);
          }
          catch (e) {
              appLog('insertItems e',e)
          }



      }
  }
    closeDB(db);
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
            appLog('query',query)
            const results = await db.executeSql(query);

        }
    }
    closeDB(db);
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
            appLog('query',query)
            const results = await db.executeSql(query);

        }
    }
    closeDB(db);
};


export const insertTempOrder =  (data?: any) => {

    return new Promise<any>(async (resolve)=> {
        const db:any = await getDBConnection();

        let values = `('${data?.tableorderid}', '${JSON.stringify(data)}')`;
        let insertQuery = `INSERT OR REPLACE INTO tblTempOrder("tableorderid","data") values ${values}`;

        try {
            await db.executeSql(insertQuery);

        } catch (e) {
            appLog('ERROR', insertQuery)
        }
        closeDB(db);

        resolve('Inset Temp Order')
    })
};

export const insertOrder =  (data?: any) => {
    return new Promise<any>(async (resolve)=>{
        const db:any = await getDBConnection();
        let values = `('${data?.orderid}', '${JSON.stringify(data)}')`;
        let  insertQuery = `INSERT OR REPLACE INTO tblOrder("orderid","data") values ${values}`;
        try {
            appLog('insertQuery',insertQuery)
            await db.executeSql(insertQuery);
        }
        catch (e) {
            appLog('ERROR',insertQuery)
        }
        closeDB(db);
        resolve('Inset Order')
    })

};











