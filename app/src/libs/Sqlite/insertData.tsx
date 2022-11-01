
import {appLog,  errorAlert} from "../function";
import {getDBConnection} from "./index";



export const insertItems = async (  itemsdata?: any,type:any = 'all') => {
    const db = await getDBConnection();
    const regx = /[^a-zA-Z0-9_. -]/g;

    let insertQuery:any = [];

  if(itemsdata?.length > 0) {

      for (const data of itemsdata) {
          data.itemname = data?.itemname.replace(regx," ");
          data.groupname =  data?.groupname.replace(regx," ");
          let values = `(${data?.itemid}, "${data?.itemname}", "${data?.itemgroupid}", "${data?.uniqueproductcode}", '${JSON.stringify(data)}', "${data?.itemstatus}", ${data?.pricealert})`;

          if(type === 'all'){
              insertQuery.push(values);
          }
          else{

              insertQuery = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${values}`;
              try {
                  await db.executeSql(insertQuery);
              }
              catch (e) {
                  appLog('ERROR',insertQuery)
                  appLog('e',e)
              }
          }
      }

      if(type === 'all'){
          const query = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${insertQuery.join(', ')}`;
          const results = await db.executeSql(query);
          appLog('results',results)
      }
  }
  db.close().then()
};


/*export const insertItemsAll = async (itemsdata?: any) => {
    const db = await getDBConnection();
    const regx = /[^a-zA-Z0-9_. -]/g;
    let insertQuery:any = [];

    if(itemsdata.length > 0) {
        await itemsdata.map(async (data: any) => {
            data.itemname =  data?.itemname.replace(regx," ");
            data.groupname =  data?.groupname.replace(regx," ");
            let values = `(${data?.itemid}, "${data?.itemname}", "${data?.itemgroupid}", "${data?.uniqueproductcode}", '${JSON.stringify(data)}', "${data?.itemstatus}", ${data?.pricealert})`;
            insertQuery.push(values);
        })
        const query = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${insertQuery.join(', ')}`;
        const results = await db.executeSql(query);
        appLog('results',results)
    }
    db.close().then()
};*/



/*export const insertOrder = async (tblOrder: any, invoice_display_number: number, localdatetime: any, data: any) => {

  let orderid = uuidv4();

  return await tblOrder
    .insert("invoice_display_number",
      "orderid",
      "datetime",
      "clientid",
      "vouchertypeid",
      "vouchertotaldisplay",
      "data",
      "staffid",
      "syncstatus",
      "paymentmethod")
    .values(invoice_display_number,
      orderid,
      localdatetime,
      data?.clientid,
      data?.vouchertypeid,
      data?.vouchertotaldisplay,
      data,
      data?.staffid,
      false,
      data?.paymentmethod)
    .execute()
}*/


