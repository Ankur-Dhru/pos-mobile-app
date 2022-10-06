import store from "../redux-store/store";
import moment from "moment";
import {changeCartItem, resetCart, setCartData, updateCartItems} from "../redux-store/reducer/cart-data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProIcon from "../components/ProIcon";

import {decode} from 'html-entities';
import {hideLoader, setAlert, setBottomSheet, setDialog, showLoader} from "../redux-store/reducer/component";
import apiService from "./api-service";
import {ACTIONS, current, localredux, METHOD, posUrl, STATUS, taxTypes, VOUCHER} from "./static";
import {setInitData} from "../redux-store/reducer/init-data";
import {setItemsData} from "../redux-store/reducer/items-data";
import {setclientsData} from "../redux-store/reducer/clients-data";
import {
  setCurrentLocation,
  setLastSyncTime,
  setRestaurant,
  setSettings
} from "../redux-store/reducer/local-settings-data";
let NumberFormat = require('react-number-format');
const getSymbolFromCurrency = require('currency-symbol-map')
import React from "react";
import {Alert, Text} from "react-native";
import {setAddonsData} from "../redux-store/reducer/addons-data";
import {deleteTableOrder, setTableOrders, setTableOrdersData} from "../redux-store/reducer/table-orders-data";
import {v4 as uuid} from "uuid";
import KOTCancelReason from "../pages/Cart/KOTCancelReason";
import SyncingInfo from "../pages/Pin/SyncingInfo";
import {setSyncDetail} from "../redux-store/reducer/sync-data";
import {setOrder} from "../redux-store/reducer/orders-data";
import {getProductData, itemTotalCalculation} from "./item-calculation";

let base64 = require('base-64');
let utf8 = require('utf8');

export const isDebug = (process.env.NODE_ENV === "development");


export function isEmpty(obj: any) {

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
}

export const appLog = (arg1: any, ...argn: any[]) => {
  if (isDebug) {
    console.log("POS-MOBILE", arg1, ...argn)
  }
}

export const appLog2 = (arg1: any, ...argn: any[]) => {
  if (isDebug) {
    //console.log("POS-DESKTOP", arg1, ...argn)
  }
}

export const clone = (obj: any) => {
  var copy: any;
  if (null == obj || "object" != typeof obj) return obj;
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
};

export const getDefaultCurrency = () => {
  const {currency}:any = localredux.initData;
  return Object.keys(currency).find((k) => currency[k].rate === "1") || {}
}

export const currencyRate = (currencyName: any) => {
  const {currency}:any = localredux.initData;
  const rate = currency[currencyName].rate
  return parseFloat(rate);
}

export const getFloatValue = (value: any, fraxtionDigits?: number, notConvert?: boolean, isLog?: boolean) => {
  if (!Boolean(fraxtionDigits)) {
    fraxtionDigits = 4;
  }
  let returnValue: number = 0;
  if (Boolean(value) && !isNaN(value)) {
    const {general}:any = localredux.initData;
    let newstring:any = new Intl.NumberFormat('en-' + general?.defaultcountry,
      {
        style: "decimal",
        maximumFractionDigits: fraxtionDigits
      }).format(value)
    returnValue = parseFloat(newstring.replaceAll(",", ""))
  }
  return returnValue;
}

export const debounce = (func: any, timeout = 200) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export const findObject = (array: any, field: any, value: any,onlyOne:any) => {

  if (Boolean(array && array.length)) {
    let find: any = array.filter(function (item: any) {
      if (!Boolean(item[field])) {
        return false;
      }
      return item[field] && item[field]?.toString() === value?.toString();
    });
    return onlyOne ? find[0] : find;
  }
  return []
};

export const currencyFormat = (amount: any, customcurrency?: any, decimalPlace?: any) => {
  const {initData: {general: {data: general}, currency: {data: currency}}}:any = localredux;

  if (!Boolean(amount)) {
    amount = 0;
  }

  if (!Boolean(customcurrency)) {
    customcurrency = currency && Object.keys(currency).find((k) => currency[k].rate === "1")
  }


  try {
    let currencyData = clone(currency[customcurrency])
    if (!Boolean(currencyData.decimalplace)) {
      currencyData.decimalplace = 2;
    }
    if (decimalPlace) {
      currencyData.decimalplace = decimalPlace
    }
    if (Boolean(currencyData?.customdecimalplace)) {
      currencyData.decimalplace = currencyData.customdecimalplace;
    }


    return new Intl.NumberFormat('en-' + general.defaultcountry, {
      style: 'currency',
      currency: currencyData['__key'],
      minimumFractionDigits: currencyData.decimalplace,
      maximumFractionDigits: currencyData.decimalplace
    }).format(amount);
  } catch (e) {
    return amount;
  }
};

export const getCurrencyData = (currencyKey?: any) => {
  let {currency}:any = localredux.initData;
  if (!currencyKey) {
    currencyKey = getDefaultCurrency();
  }

  return currency[currencyKey]
}

export const numberFormat = (amount: any, customcurrency?: any, decimalPlace?: any) => {
  const {general,currency}:any = localredux.initData;

  if (!Boolean(amount)) {
    amount = 0;
  }

  if (!Boolean(customcurrency)) {
    customcurrency = currency && Object.keys(currency).find((k) => currency[k].rate === "1")
  }


  try {
    let currencyData = clone(currency[customcurrency])
    if (!Boolean(currencyData.decimalplace)) {
      currencyData.decimalplace = 2;
    }
    if (decimalPlace) {
      currencyData.decimalplace = decimalPlace
    }
    if (Boolean(currencyData?.customdecimalplace)) {
      currencyData.decimalplace = currencyData.customdecimalplace;
    }


    return new Intl.NumberFormat('en-' + general.defaultcountry, {
      currency: currencyData['__key'],
      minimumFractionDigits: currencyData.decimalplace,
      maximumFractionDigits: currencyData.decimalplace
    }).format(amount);
  } catch (e) {
    return amount;
  }
};

export const getDateWithFormat = (date?: string, dateFormat?: string) => {
  if (!dateFormat) {
    dateFormat = "YYYY-MM-DD HH:mm:ss"
  }
  return moment(date).format(`${dateFormat}`)
}

export const dateFormat = (date?: string, withTime?: boolean, standardformat?: boolean) => {
  let {initData: {general: {data}}}: any = localredux;
  let dateFormat = data?.dateformat;
  if (standardformat) {
    dateFormat = "YYYY-MM-DD"
  }
  if (withTime) {
    dateFormat += ' hh:mm A'
  }
  return moment(date).format(`${dateFormat}`)
}


export const getVoucherKey = (findKey: any, findValue: any) => {
  let {initData}: any = localredux;

  let key = Object.keys(initData?.voucher?.data).find((voucherKey: any) => {
    const voucherData = initData?.voucher?.data[voucherKey];
    if (voucherData[findKey] == findValue) {
      return voucherKey
    }
  })

  return key;
}

export const voucherData = (voucherKey: VOUCHER | string, isPayment: boolean = true, isTaxInvoice: boolean = false) => {

  let {initData, licenseData, staffData, localSettingsData, loginuserData}: any = localredux;

  let payment: any = []

  let paymentmethod = Object.keys(initData?.paymentgateway).find((key: any) => {
    let data1 = Object.keys(initData?.paymentgateway[key]).filter((k1) => k1 !== "settings");
    return isEmpty(data1) ? false : data1[0] === 'cash'
  })

  if (paymentmethod) {
    let paymentby = initData?.paymentgateway[paymentmethod]["cash"].find(({input}: any) => input === "displayname")
    payment = [{paymentmethod, paymentby: paymentby?.value, type: "cash"}]
  }

  if (Boolean(localSettingsData?.taxInvoice)) {
    let taxVoucherKey = getVoucherKey("vouchertypename", "Tax Invoices");
    if (taxVoucherKey) {
      voucherKey = taxVoucherKey;
      payment = [{paymentby: "Pay Later"}]
    }
  }


  let voucherTypeData = initData?.voucher[voucherKey]


  const utcDate = moment.utc(moment()).format("YYYY-MM-DD HH:mm:ss")

  let date = getDateWithFormat(utcDate, "YYYY-MM-DD"),
      vouchercreatetime = getDateWithFormat(utcDate, 'HH:mm:ss')

  let currencyData = getCurrencyData();

  let local = moment(moment.utc(utcDate).toDate()).local().format('YYYY-MM-DD HH:mm:ss');

  let data: any = {
    localdatetime: local,
    date,
    voucherdate: date,
    duedate: local,
    vouchercreatetime,
    time: moment(utcDate).unix(),
    currency: currencyData.__key,
    currentDecimalPlace: currencyData?.decimalplace || 2,
    locationid: licenseData?.data?.location_id,
    terminalid: localredux?.licenseData?.data?.terminal_id,
    staffid: parseInt(loginuserData?.adminid),
    vouchercurrencyrate: currencyData.rate,
    vouchertaxtype: voucherTypeData?.defaulttaxtype || Object.keys(taxTypes)[0],
    roundoffselected: voucherTypeData?.voucherroundoff,
    voucherdiscountplace: voucherTypeData?.discountplace,
    vouchertransitionaldiscount: Boolean(voucherTypeData?.vouchertransitionaldiscount) || voucherTypeData?.vouchertransitionaldiscount === "1",
    canchangediscoutnaccount: Boolean(voucherTypeData?.vouchertransitionaldiscount) || voucherTypeData?.vouchertransitionaldiscount === "1",
    discountaccunt: voucherTypeData?.defaultdiscountaccount,
    vouchertypeid: voucherTypeData?.vouchertypeid,
    vouchertype: voucherTypeData?.vouchertype,
    vouchernotes: voucherTypeData?.defaultcustomernotes,
    toc: voucherTypeData?.defaultterms,
    selectedtemplate: voucherTypeData?.printtemplate,
    edit: true
  }

  if (isPayment) {
    data.payment = payment;
  }

  return data;
}


export const assignOption = (label: any, value: any, defaultoption?: any, space?: any, isDisabled?: any, disabled?: any, selected?: any) => {
  return {label, value, space, isDisabled, disabled, selected}
};
export const options_itc: any = [
  assignOption("Eligible for ITC", "eligible"),
  assignOption("Ineligible - As per Section 17(5)", "ineligible17"),
  assignOption("Ineligible Others", "ineligibleothers"),
  assignOption("Import of Goods", "goods"),
  assignOption("Import of Service", "service"),
]

/*export const resetCartData = () => {
  const {localSettingsData} = localredux;
  store.dispatch(resetCart());
  let cartData: any = voucherData(VOUCHER.INVOICE,);
  store.dispatch(setCartData(clone(cartData)));
}*/


export const shortName = (str: any) => {

  if (Boolean(str)) {
    const firstLetters = str
      .split(' ')
      .map((word: any) => word[0])
      .join('');
    return firstLetters.substring(0, 2).toUpperCase();
  }
  return
}

export const base64Decode = (encodedData: any) => {
  try {
    if (Boolean(encodedData)) {
      let bytes = base64.decode(encodedData);
      return Boolean(bytes) ? decode(utf8.decode(bytes)) : '';
    }
    return
  } catch (e) {
    console.log(e);
  }
}
export const base64Encode = (content: any) => {
  if (!content) {
    content = ' '
  }
  let bytes = utf8.encode(content);
  return base64.encode(bytes);
}


export const handleKeyDown = (event: any) => {

/*   let charCode = String.fromCharCode(event.which).toLowerCase();

  if (Boolean(charCode) && event.ctrlKey) {
    event.preventDefault();
  }

  if ((event.ctrlKey || event.metaKey) && charCode === 's') {
    document.getElementById('save')?.click()
  } else if ((event.ctrlKey || event.metaKey) && charCode === 'p') {
    document.getElementById('saveprint')?.click()
  } else if ((event.ctrlKey || event.metaKey) && charCode === 'o') {
    document.getElementById('opendrawer')?.click()
  } else if ((event.ctrlKey || event.metaKey) && charCode === 'd') {
    document.getElementById('deleteitem')?.click()
  } else if ((event.ctrlKey || event.metaKey) && charCode === 'l') {
    document.getElementById('onhold')?.click()
  } else if ((event.ctrlKey || event.metaKey) && charCode === 'e') {
    document.getElementById('recall')?.click()
  } */
}

export const getInvoiceType = (vouchertypeid:string)=>{
  return Boolean(vouchertypeid === VOUCHER.INVOICE) ? "Retail Invoice" : "Tax Invoice"
}


export const storeData = async (key: any, value: any) => { //elo
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true
  } catch (error) {
    return false;
  }
};

export const retrieveData = async (key: any) => {
  return await AsyncStorage.getItem(key).then((data: any) => {
    return JSON.parse(data);
  });
};

export const log = (text: any, text2?: any, text3?: any) => {
  console.log('mylog', text, text2 ? text2 : '', text3 ? text3 : '');
}

export const selectItemObject = (label: string, value: string | number, rank: number, otherData?: object) => ({
  label,
  value,
  rank, ...otherData
})



export const syncData = async () => {

  let itemsData:any;
  await retrieveData('fusion-pro-pos-mobile').then((data:any)=>{
    itemsData = data.itemsData;
  })

  let {initData,licenseData,localSettingsData: {lastSynctime},addonsData,clientsData,authData}:any = localredux;

  store.dispatch(setDialog({visible:true,hidecancel:true,component: ()=><SyncingInfo />}))

  const getData = async (queryString?: any) => {

    if(!Boolean(lastSynctime)){
      lastSynctime=0
    }
    queryString = {
      ...queryString,
      timestamp:lastSynctime
    }

    await apiService({
      method: METHOD.GET,
      action: ACTIONS.SYNC_DATA,
      queryString,
      workspace:initData.workspace,
      token: licenseData?.token,
      hideLoader:true,
      other: {url: posUrl},
    }).then(async (response: any) => {

      const {status, data, info: {type, start, result}} = response;

      if (status === STATUS.SUCCESS) {
        if(result === 'setting'){
          initData = {
            ...initData,
            ...data
          }
        }
        else if(result === 'item'){
          if(Boolean(data.result)) {
            let items = data.result.reduce((accumulator: any, value: any) => {
              return {...accumulator, [value.itemid]: value};
            }, {});
            itemsData = {
              ...itemsData,
              ...items
            }
          }
        }
        else if(result === 'addon'){
          if(Boolean(data.result)) {
            let addons = data.result.reduce((accumulator: any, value: any) => {
              return {...accumulator, [value.itemid]: value};
            }, {});
            addonsData = {
              ...addonsData,
              ...addons
            }
          }
        }
        else if(result === 'customer'){
          if(Boolean(data.result)) {
            let clients = data.result.reduce((accumulator: any, value: any) => {
              return {...accumulator, [value.clientid]: value};
            }, {});

            clientsData = {
              ...clientsData,
              ...clients
            }
          }
        }

        if (type !== "finish") {
          await store.dispatch(setSyncDetail({type:result}))
          setTimeout(() => {
            getData({type, start});
          }, 100)
        }
        else{

          retrieveData('fusion-pro-pos-mobile').then(async (data:any)=>{

            const locationid = licenseData?.data?.location_id;

            const locations = initData?.location;

            data = {
              ...data,
              initData,
              itemsData:itemsData,
              addonsData:addonsData,
              clientsData:clientsData,
              localSettingsData:{
                currentLocation:locations[locationid],
                isRestaurant:(locations[locationid].industrytype === "foodservices"),
                lastSynctime : moment().unix()
              }
            }

            storeData('fusion-pro-pos-mobile',data).then(async ()=>{


              localredux.initData = data.initData;
              localredux.addonsData = data.addonsData;
              localredux.clientsData = data.clientsData;
              localredux.localSettingsData = data.localSettingsData;
              localredux.groupItemsData = groupBy(Object.values(itemsData), 'itemgroupid');


              /*await store.dispatch(setInitData(initData))
              await store.dispatch(setCurrentLocation(locations[locationid]));
              await store.dispatch(setItemsData(itemsData));
              await store.dispatch(setAddonsData(addonsData))
              await store.dispatch(setclientsData(clientsData));
              await store.dispatch(setLastSyncTime(lastsync));
              await store.dispatch(setRestaurant(isRestaurant));*/

            });
          })

        }
      }
      if (status === STATUS.ERROR || type === "finish") {

        store.dispatch(setDialog({visible:false}))
        store.dispatch(setAlert({visible:true,message:'Sync Successful'}))
      }

    })
  }

  getData().then()

}



export const getType = (p: any) => {
  if (p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
  }
  return 'other';
}


export const filterArray = (array: any, fields: any, searchText: any, multilevel: any = false) => {
  if (Boolean(array.length)) {
    if (multilevel) {

      return array?.map((item: any) => {

        return {
          title: item.title,
          data: item?.filter((item: any, key: any) => {
            let searchin: any = item;
            if (Boolean(fields)) {
              searchin = '';
              fields.map((field: any) => {
                searchin += item[field]
              })
            }
            return JSON.stringify(searchin).toLowerCase().includes(searchText && searchText.toLowerCase())
          })
        }
      })
    } else {
      return array?.filter((item: any, key: any) => {
        let searchin: any = item;
        if (Boolean(fields)) {
          searchin = '';
          fields.map((field: any) => {
            searchin += item[field]
          })
        }
        return JSON.stringify(searchin).toLowerCase().includes(searchText && searchText.toLowerCase())
      })
    }
  }
}

export const backButton: any = <ProIcon align={'left'} name={'chevron-left'}/>;
export const chevronRight: any = <ProIcon name={'chevron-right'} align={'right'} color={'#bbb'} size={16}/>;



export const toCurrency = (value: any, code?: any, decimal?: any) => {

  const {currency}:any = localredux.initData;
  const {currency:cartCurrency}:any = store.getState().cartData;
  let currencylist =  currency;


  code = 'INR';

  if (!code) {
    code = getDefaultCurrency().__key;
    if (cartCurrency) {
      code = cartCurrency;
    }
  }

  let decimalplace = decimal || (Boolean(currencylist) && Boolean(currencylist[code]) && currencylist[code]?.customdecimalplace) || 2;

  if (value) {
    //currencylist[code].decimal_digits
    try {
      return <NumberFormat
          value={parseFloat(value).toFixed(decimalplace)}
          displayType={'text'}
          thousandSeparator={true}
          thousandsGroupStyle="lakh"
          prefix={getSymbolFromCurrency(code)}
          renderText={(value: any, props: any) => <Text {...props}>{value}</Text>}
      />;
    } catch (e) {
      log(e);
    }
  }

};


export const isRestaurant = () => {
  return localredux?.localSettingsData?.isRestaurant
}

export const updateComponent = (ref: any, key: any, value: any) => {
  ref?.current?.setNativeProps({[key]: value})
}

export const errorAlert = (message: any, title?: any) => {
  Alert.alert(
      title || "Opps",
      message,
      [
        {text: "OK"}
      ]
  );
}

export const voucherTotal = (items:any) => {
  let vouchertotaldisplay = 0;
  items.forEach(({productratedisplay,productqnt}:any)=>{
    vouchertotaldisplay+=productratedisplay * productqnt
  })
  return vouchertotaldisplay
}



export const setItemRowData = (data:any) => {

  try {

    let isInward: boolean = false;
    let companyCurrency = getDefaultCurrency();


    let {cartData,localSettings}: any = store.getState();
    let {localSettingsData}: any = localredux;

    let client = cartData?.client;

    let pricingTemplate = localSettingsData?.taxInvoice ? client?.clientconfig?.pricingtemplate : undefined

    let isDepartmentSelected = false;

    if (!isEmpty(localSettingsData?.currentLocation?.departments)) {
      isDepartmentSelected = localSettingsData?.currentLocation?.departments.some(({departmentid}: any) => departmentid === data?.itemdepartmentid)
    }


    let {
      itemid,
      itemname,
      itemtaxgroupid,
      pricing,
      productqnt,
      itemmaxqnt,
      salesunit,
      stockonhand,
      inventorytype,
      identificationtype,
      itemhsncode,
      itemtype,
      committedstock,
      itemminqnt,
      itemaddon,
      itemtags,
      notes,
      hasAddon,
      key
    } = data;



    let recurring = undefined, producttaxgroupid, productqntunitid;

    if (pricing?.type !== "free" &&
        pricing.price &&
        pricing.price.default &&
        pricing.price.default[0] &&
        pricing.price.default.length > 0) {
      recurring = Object.keys(pricing.price.default[0])[0];
    }
    if (Boolean(salesunit)) {
      productqntunitid = salesunit;
    }

    if (Boolean(itemtaxgroupid)) {
      producttaxgroupid = itemtaxgroupid;
    }


    let additem: any = {
      identificationtype,
      productid: itemid,
      productdisplayname: itemname,
      productqnt: productqnt || (Boolean(itemminqnt) ? itemminqnt : 1),
      producttaxgroupid,
      pricingtype: pricing.type,
      recurring,
      minqnt: Boolean(itemminqnt) ? parseFloat(itemminqnt) : undefined,
      maxqnt: Boolean(itemmaxqnt) ? parseFloat(itemmaxqnt) : undefined,
      productqntunitid,
      "accountid": 2,
      clientid: cartData?.clientid,
      productdiscounttype: "%",
      stockonhand,
      hsn: itemhsncode,
      itemtype: itemtype === "service" ? "service" : "goods",
      committedstock,
      inventorytype,
      itemaddon,
      itemtags,
      notes,
      hasAddon,
      isDepartmentSelected,
      ...getProductData(data, 'INR', 'INR', undefined, undefined, isInward, pricingTemplate)
    }

    additem.key = key;
    additem.change = true;
    additem.itemdetail = clone(data);
    additem.newitem = true;

    return additem;


  } catch (e) {
    appLog(e);
  }

}


export const saveTempLocalOrder = async (order?:any) => {

  try {

    if (!Boolean(order)) {
      order = store.getState().cartData
    }

    if (Boolean(order.invoiceitems.length > 0)) {


      order = await itemTotalCalculation(clone(order), undefined, undefined, undefined, undefined, 2, 2, false, false);


      if (!Boolean(order.tableorderid)) {
        order = {
          ...order,
          tableorderid: uuid(),
        }
      }
      if (!Boolean(order.tableid)) {
        order = {
          ...order,
          tableid: uuid(),
        }
      }

      order = {
        ...order,
        terminalid: localredux?.licenseData?.data?.terminal_id
      }

      let tableorders: any = store.getState().tableOrdersData || {}
      tableorders = {
        ...tableorders,
        [order.tableorderid]: order
      }

      await storeData('fusion-pro-pos-mobile-tableorder', tableorders).then(async () => {
        await store.dispatch(setCartData(order));
        await store.dispatch(setTableOrdersData(tableorders));

      });
    }
  }
  catch (e){
    appLog('e',e)
  }
}

export const deleteTempLocalOrder = async (tableorderid:any) => {

  let tableorders:any = clone(store.getState().tableOrdersData) || {}

  delete tableorders[tableorderid];

  await storeData('fusion-pro-pos-mobile-tableorder', clone(tableorders)).then(async () => {
    await store.dispatch(setTableOrdersData(clone(tableorders)));
  });

}


export const saveLocalSettings = async (key:any,setting?:any) => {
  await retrieveData('fusion-pro-pos-mobile-settings').then(async (data:any)=>{
    data = {
      ...data,
      [key]:setting
    }
    await storeData('fusion-pro-pos-mobile-settings',data).then(async ()=>{
      await store.dispatch(setSettings(clone(data)));
    });
  })
}

export const saveLocalOrder = async (order?:any) => {


  if(!Boolean(order)){
    order = clone(store.getState().cartData)
  }

  if(!Boolean(order.orderid)){
    order = {
      ...order,
      orderid:uuid(),

    }
  }
  if(!Boolean(order.tableorderid)){
    order = {
      ...order,
      tableorderid:uuid(),
    }
  }

  await retrieveData('fusion-pro-pos-mobile').then(async (data:any)=>{
    data.orders = {
      ...data.orders,
      [order.orderid]:order
    }

     await deleteTempLocalOrder(order.tableorderid).then(async ()=>{
      await storeData('fusion-pro-pos-mobile',data).then(async ()=>{
        //await store.dispatch(setOrder(order))
        //await store.dispatch(resetCart())

      });
    })
  })

}




export const getTicketStatus = (statusid: any) => {
  const {localSettingsData}: any = localredux;
  let status: any = {};
  if (!isEmpty(localSettingsData?.currentTicketType?.ticketstatuslist) && localSettingsData?.currentTicketType?.ticketstatuslist[statusid]) {
    status = {
      ...localSettingsData?.currentTicketType?.ticketstatuslist[statusid],
      statusid
    };
  }
  return status;
}


export const objToArray = (data: any) => {
  if (data) {
    let result = [];
    for (let i in data) {
      result.push({key:i,data:data[i]});
    }
    return result;
  }
};


export const removeItem = async (unique: any) => {

  const invoiceitems:any = store.getState().cartData.invoiceitems || {}

  try {
    const filtered = invoiceitems?.filter((item: any) => {
      return item.key !== unique
    })

    if (Boolean(filtered?.length > 0)) {
      await store.dispatch(updateCartItems(clone(filtered)));
    } else {
      await store.dispatch(setBottomSheet({visible: false}))
      await deleteTempLocalOrder(current.table.tableorderid);
      await store.dispatch(resetCart())
    }
  }
  catch (e) {
    console.log('e',e)
  }

}

export const getCurrencySign = () => {
  const {currency}:any = localredux.initData;
  const {currency:cartCurrency}:any = store.getState().cartData;
  let currencylist =  currency;
  let defaultcurrency: any = Object.keys(currencylist).find((k) => currencylist[k].rate === "1")

  if (cartCurrency) {
    return getSymbolFromCurrency(cartCurrency) + ' ';
  }
  return getSymbolFromCurrency(defaultcurrency) + ' ';
}


export const syncInvoice = ()=>{

  retrieveData('fusion-pro-pos-mobile').then(async (data:any)=>{

    appLog("invoice data", data);
  })
}



export const  groupBy = (arr:any, property:any) => {
  return arr.reduce(function(memo:any, x:any) {
    if (!memo[x[property]]) { memo[x[property]] = []; }
    memo[x[property]].push(x);
    return memo;
  }, {});
}
