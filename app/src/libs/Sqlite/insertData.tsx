
import {appLog,  errorAlert} from "../function";
import {getDBConnection} from "./index";



export const insertItemsOnebyOne = async (  itemsdata?: any) => {
    const db = await getDBConnection();
  if(itemsdata?.length > 0) {
      appLog('itemsdata.length',itemsdata.length)

      for (const data of itemsdata) {
          const regx = /[^a-zA-Z0-9_. -]/g;
          let values = `(${data?.itemid}, "${data?.itemname.replace(regx," ")}", "${data?.itemgroupid}", "${data?.uniqueproductcode}", "", "${data?.itemstatus}", ${data?.pricealert})`;
          const insertQuery = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${values}`;
          try {
              await db.executeSql(insertQuery);
              appLog('insertQuery',insertQuery)
          }
          catch (e) {
              appLog('ERROR',insertQuery)
              appLog('e',e)
          }
      }

  }
  db.close().then()
};


export const insertItemsAll = async (itemsdata?: any) => {
    const db = await getDBConnection();
    let insertQuery:any = [];
    appLog('itemsdata.length',itemsdata.length)
    if(itemsdata.length > 0) {
        await itemsdata.map(async (data: any) => {
            insertQuery.push(`(${data?.itemid}, 'BORGES MINI PENNE RIGATE 350 GM', '2497bf65-e6f3-4bbc-9046-e01e6c0950b0', '8410179008059', '{"itemname":"BORGES MINI PENNE RIGATE 350 GM","pricing":{"type":"onetime","price":{"default":[{"onetime":{"baseprice":"120"}}]},"qntranges":[{"id":0,"start":1,"end":10000000,"text":"1 to Infinite"}]},"itemgroupid":"2497bf65-e6f3-4bbc-9046-e01e6c0950b0","itemunit":"9c2ecc81-d201-4353-8fbc-7b9d61e0afb4","salesunit":"9c2ecc81-d201-4353-8fbc-7b9d61e0afb4","uniqueproductcode":"8410179008059","inventorytype":"fifo","pricingtype":"","itemtaxgroupid":"9da54644-3581-45a3-ae2f-dbdc72a4af3a","itemhsncode":"","purchasecost":0,"itemstatus":"active","pricealert":0,"itemdepartmentid":"695c39c5-0222-42d1-8ca9-a2c616222fb0","mrp":"0.000","tags":null,"addtags":null,"veg":null,"itemid":"1998","sort":998,"groupname":"BORGES","itemtax":"No-Tax","unitprice":null}', 'active', '0')`);
        })
        const query = `INSERT OR REPLACE INTO tblItem("itemid","itemname","itemgroupid","uniqueproductcode","data","itemstatus","pricealert") values ${insertQuery.join(', ')}`;
        const results = await db.executeSql(query);
        appLog('results',results)
    }

    db.close().then()

};



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


