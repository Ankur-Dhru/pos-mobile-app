import store from "../redux-store/store";
import moment from "moment";
import {
    resetCart,
    setCartData,
    setCartItems,
    updateCartField,
    updateCartItems,
    updateCartKots
} from "../redux-store/reducer/cart-data";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProIcon from "../components/ProIcon";

import {decode} from 'html-entities';
import {hideLoader, setAlert, setBottomSheet, setDialog, showLoader} from "../redux-store/reducer/component";
import apiService from "./api-service";
import {
    ACTIONS, adminUrl,
    current, defaultInvoiceTemplate, defaultKOTTemplate,
    isDevelopment,
    localredux,
    METHOD,
    posUrl,
    PRINTER,
    STATUS,
    taxTypes, testInvoiceData,
    TICKET_STATUS,
    TICKETS_TYPE,
    VOUCHER
} from "./static";

import {setSettings} from "../redux-store/reducer/local-settings-data";
import React from "react";
import {Alert, PermissionsAndroid, Platform, Text} from "react-native";
import {setTableOrdersData} from "../redux-store/reducer/table-orders-data";
import {v4 as uuid} from "uuid";
import SyncingInfo from "../pages/Pin/SyncingInfo";
import {setSyncDetail} from "../redux-store/reducer/sync-data";
import {setOrder} from "../redux-store/reducer/orders-data";
import {getProductData, itemTotalCalculation} from "./item-calculation";
import EscPosPrinter, {getPrinterSeriesByName} from "react-native-esc-pos-printer";
import CancelReason from "../pages/Cart/CancelReason";
import {setItemDetail} from "../redux-store/reducer/item-detail";
import ItemDetail from "../pages/Items/ItemDetail";
import AddonActions from "../pages/Items/AddonActions";
import {onPressNumber} from "../pages/Items/AddButton";
import NetInfo from "@react-native-community/netinfo";
import {insertAddons, insertClients, insertItems} from "./Sqlite/insertData";
import {sendDataToPrinter} from "./Network";
import {CommonActions} from "@react-navigation/native";
import {getAddonByWhere, getClientsByWhere, getItemsByWhere} from "./Sqlite/selectData";
import BleManager from "react-native-ble-manager";
import Mustache from "mustache";
import {EscPos} from "escpos-xml";
import Contacts from "react-native-contacts";
import {PERMISSIONS} from "react-native-permissions";
import {useDispatch} from "react-redux";


let NumberFormat = require('react-number-format');
const getSymbolFromCurrency = require('currency-symbol-map')

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
    const {currency}: any = localredux.initData;
    return Object.keys(currency).find((k) => currency[k]?.rate === "1") || {}
}

export const currencyRate = (currencyName: any) => {
    const {currency}: any = localredux.initData;
    const rate = currency[currencyName].rate
    return parseFloat(rate);
}

export const getFloatValue = (value: any, fraxtionDigits?: number, notConvert?: boolean, isLog?: boolean) => {
    if (!Boolean(fraxtionDigits)) {
        fraxtionDigits = 4;
    }
    let returnValue: number = 0;
    if (Boolean(value) && !isNaN(value)) {
        const {general}: any = localredux.initData;
        let newstring: any = new Intl.NumberFormat('en-' + general?.defaultcountry,
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

export const findObject = (array: any, field: any, value: any, onlyOne: any) => {

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
    const {initData: {general: {data: general}, currency: {data: currency}}}: any = localredux;

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
    let {currency}: any = localredux.initData;
    if (!currencyKey) {
        currencyKey = getDefaultCurrency();
    }

    return currency[currencyKey]
}

export const numberFormat = (amount: any, customcurrency?: any, decimalPlace?: any) => {
    const {general, currency}: any = localredux.initData;

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
    let {initData: {general}}: any = localredux;
    let dateFormat = general?.dateformat;
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

    const utcDate = moment().format("YYYY-MM-DD HH:mm:ss")

    let date = getDateWithFormat(utcDate, "YYYY-MM-DD"),
        vouchercreatetime = getDateWithFormat(utcDate, 'HH:mm:ss')

    let currencyData = getCurrencyData();

    let local = utcDate;

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

export const getInvoiceType = (vouchertypeid: string) => {
    return Boolean(vouchertypeid === VOUCHER.INVOICE) ? "Retail Invoice" : "Tax Invoice"
}


export const storeData = async (key: any, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true
    } catch (error) {
        appLog('error', error)
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

export const CheckConnectivity = () => {
    NetInfo.addEventListener((networkState: any) => {
        //store.dispatch(setConnection({internet: networkState.isConnected}));
        store.dispatch(setSettings({internet: networkState.isConnected}))
    });
};

export const syncData = async (loader=true) => {

    await retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {

    try {


        let start = moment();

          let  initData = data?.initData || {}
        let   licenseData = data?.licenseData || {};
        let   localSettingsData = data?.localSettingsData || {};



        let {lastSynctime,terminalname}: any = localSettingsData;


        loader && store.dispatch(setDialog({visible: true, hidecancel: true, width: 300, component: () => <SyncingInfo/>}))


        const getData = async (queryString?: any) => {

            if (!Boolean(lastSynctime)) {
                lastSynctime = 0
            }

            queryString = {
                ...queryString,
                timestamp: lastSynctime
            }

            await apiService({
                method: METHOD.GET,
                action: ACTIONS.SYNC_DATA,
                queryString,
                workspace: initData.workspace,
                token: licenseData?.token,
                hideLoader: true,
                other: {url: posUrl},
            }).then(async (response: any) => {

                const {status, data, info: {type, start, result}} = response;


                if (status === STATUS.SUCCESS) {
                    if (result === 'setting') {
                        initData = {
                            ...initData,
                            ...data
                        }
                    } else if (result === 'item') {
                        if (Boolean(data.result)) {
                            await insertItems(data.result,'all').then(() => { });
                        }
                    } else if (result === 'addon') {
                        if (Boolean(data.result)) {
                            await insertAddons(data.result,'all').then(() => { });
                        }

                    } else if (result === 'customer') {
                        if (Boolean(data.result)) {
                            await insertClients(data.result,'all').then(() => { });
                        }
                    }


                    if (type !== "finish") {
                        await store.dispatch(setSyncDetail({type: result,more:lastSynctime+'',rows:start,total:(Boolean(data?.extra) && Boolean(data?.extra?.total)) ? data.extra.total : 0}))
                        setTimeout(async ()=>{
                            await getData({type, start});
                        },300)

                    } else {

                        await retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {

                            try {

                                const locationid = licenseData?.data?.location_id;
                                const locations = initData?.location;

                                let printingtemplates:any = {}
                                Object.values(initData?.printingtemplate).map((template:any)=>{
                                    if(template?.location === locationid){
                                        printingtemplates[template?.printertype] = template
                                    }
                                })

                                data = {
                                    ...data,
                                    initData,
                                    localSettingsData: {
                                        currentLocation: locations[locationid],
                                        printingtemplates:printingtemplates,
                                        lastSynctime: moment().unix(),
                                        terminalname:terminalname,
                                        isRestaurant: (locations[locationid]?.industrytype === "foodservices"),
                                    }
                                }



                                await storeData('fusion-pro-pos-mobile', data).then(async () => {
                                    localredux.initData = data.initData;
                                    localredux.localSettingsData = data.localSettingsData;

                                    await store.dispatch(setSyncDetail({type: result,more:lastSynctime+' finish',rows:start,total:(Boolean(data?.extra) && Boolean(data?.extra?.total)) ? data.extra.total : 0}))

                                });

                                getClients().then()
                                getAddons().then()


                            } catch (e) {
                                appLog('retrieveData', e)
                            }
                        })

                    }
                }
                if (status === STATUS.ERROR || type === "finish") {
                    store.dispatch(setDialog({visible: false}))
                    loader && store.dispatch(setAlert({visible: true, message: 'Sync Successful'}))
                }

            })
        }

        await getData().then()


        let end = moment();
        var duration = moment.duration(end.diff(start));

        if (isDevelopment) {
            appLog('total time', duration.asMilliseconds())
            store.dispatch(setAlert({visible: true, message: duration.asMilliseconds()}))
        }

    } catch (e) {
        appLog('main e', e)
    }

    })

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
                        return JSON.stringify(searchin)?.toLowerCase().includes(searchText && searchText?.toLowerCase())
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
                return JSON.stringify(searchin)?.toLowerCase().includes(searchText && searchText?.toLowerCase())
            })
        }
    }
}

export const backButton: any = <ProIcon align={'left'} name={'chevron-left'}/>;
export const chevronRight: any = <ProIcon name={'chevron-right'} align={'right'} color={'#bbb'} size={16}/>;


export const toCurrency = (value: any, code?: any, decimal?: any) => {

    const {currency}: any = localredux.initData;
    const {currency: cartCurrency}: any = store.getState().cartData;
    let currencylist = currency;

    if (!code) {
        code = getDefaultCurrency();
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

export const voucherTotal = (items: any, vouchertaxtype: any) => {
    let vouchertotaldisplay = 0;

    let taxesList: any = localredux.initData.tax;


    const taxCalculation = (tax: any, taxableValue: any, qnt: any) => {
        let totalTax = 0;
        if (!isEmpty(tax?.taxes)) {
            tax?.taxes?.forEach((tx: any) => {
                let taxpriceDisplay = tx?.taxpercentage * taxableValue;
                taxpriceDisplay = getFloatValue(taxpriceDisplay / 100);
                totalTax += getFloatValue(taxpriceDisplay * qnt, 4);
            })
        }
        return totalTax;
    }

    items.forEach((item: any) => {

        const {productratedisplay, productqnt, itemtaxgroupid} = item;

        vouchertotaldisplay += productratedisplay * productqnt;

        if (!isEmpty(taxesList) && !isEmpty(taxesList[itemtaxgroupid]) && vouchertaxtype === 'exclusive') {
            vouchertotaldisplay += taxCalculation(taxesList[itemtaxgroupid], productratedisplay, productqnt)
        }

        if (Boolean(item?.itemaddon?.length)) {
            item?.itemaddon?.forEach(({pricing, productqnt, itemtaxgroupid}: any) => {
                const pricingtype = pricing?.type;
                const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;
                vouchertotaldisplay += baseprice * productqnt
                if (!isEmpty(taxesList) && !isEmpty(taxesList[itemtaxgroupid]) && vouchertaxtype === 'exclusive') {
                    vouchertotaldisplay += taxCalculation(taxesList[itemtaxgroupid], baseprice, productqnt)
                }

            })
        }
    })
    return vouchertotaldisplay
}


export const setItemRowData = (data: any) => {

    try {

        let isInward: boolean = false;
        let companyCurrency = getDefaultCurrency();


        let {cartData, localSettings}: any = store.getState();
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
            mrp,
            key
        } = data;


        let recurring = undefined, producttaxgroupid, productqntunitid;

        if (pricing?.type !== "free" &&
            pricing.price &&
            pricing.price.default &&
            pricing.price.default[0] &&
            pricing.price.default?.length > 0) {
            recurring = Object.keys(pricing.price.default[0])[0];
        }
        if (Boolean(salesunit)) {
            productqntunitid = salesunit;
        }

        if (Boolean(itemtaxgroupid)) {
            producttaxgroupid = itemtaxgroupid;
        }

        const defaultCurrency:any = getDefaultCurrency()

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
            mrp,
            hasAddon,
            isDepartmentSelected,
            ...getProductData(data, defaultCurrency, defaultCurrency, undefined, undefined, isInward, pricingTemplate)
        }

        additem.key = key;
        additem.change = true;
        //additem.itemdetail = clone(data);
        additem.newitem = true;

        return additem;


    } catch (e) {
        appLog(e);
    }

}


export const saveTempLocalOrder = async (order?: any,config?:any) => {

    try {

        if (!Boolean(order)) {
            order = await store.getState().cartData
        }

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
        if(config?.print){
            let counter = order?.printcounter ? order?.printcounter + 1 : 1;
            order = {
                ...order,
                printcounter: counter,
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

    } catch (e) {
        appLog('e', e)
    }
}

export const deleteTempLocalOrder = async (tableorderid: any) => {


    let tableorders: any = clone(store.getState().tableOrdersData) || {}

    delete tableorders[tableorderid];

    await storeData('fusion-pro-pos-mobile-tableorder', tableorders).then(async () => {
        await store.dispatch(setTableOrdersData(tableorders));
        await store.dispatch(resetCart())
    });

}


export const saveLocalSettings = async (key: any, setting?: any) => {
    await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
        data = {
            ...data,
            [key]: setting
        }
        await storeData('fusion-pro-pos-mobile-settings', data).then(async () => {
            await store.dispatch(setSettings(clone(data)));
        });
    })
}


export const getLocalSettings = async (key: any) => {
    await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
         return data[key];
    })
}



export const saveLocalOrder = async (order?: any) => {


    if (!Boolean(order)) {
        order = clone(store.getState().cartData)
    }

    if (!Boolean(order.orderid)) {
        order = {
            ...order,
            orderid: uuid(),
        }
    }
    if (!Boolean(order.tableorderid)) {
        order = {
            ...order,
            tableorderid: uuid(),
        }
    }

    if (order?.kots.length > 0) {
        order.kots = order?.kots.map((kot: any) => {
            kot = {
                ...kot,
                orderid: order.orderid
            }
            return kot
        })
    }


    ///////// CREATE LOCALORDER ID //////////
    if (!Boolean(order.invoice_display_number)) {
        await retrieveData('fusion-pro-pos-mobile-vouchernos').then(async (vouchers: any) => {
            order = {
                ...order,
                invoice_display_number: (Boolean(vouchers) && vouchers[order.vouchertypeid]) || 1
            }
            vouchers = {...vouchers, [order.vouchertypeid]: ++order.invoice_display_number}
            await storeData('fusion-pro-pos-mobile-vouchernos', vouchers).then(async () => {
            });
        })
    }
    ///////// CREATE LOCALORDER ID //////////

    await retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {
        data.orders = {
            ...data.orders,
            [order.orderid]: order
        }

        await deleteTempLocalOrder(order.tableorderid).then(async () => {

            await storeData('fusion-pro-pos-mobile', data).then(async () => {
                await store.dispatch(setOrder(order))
            });
        })
    })

}


export const getTicketStatus = (statusid: any) => {
    const currentTicketType = localredux.initData?.tickets[TICKETS_TYPE.KOT];
    let status: any = {};
    if (!isEmpty(currentTicketType?.ticketstatuslist) && currentTicketType?.ticketstatuslist[statusid]) {
        status = {
            ...currentTicketType?.ticketstatuslist[statusid],
            statusid
        };
    }
    return status;
}


export const objToArray = (data: any) => {
    if (data) {
        let result = [];
        for (let i in data) {
            result.push({key: i, data: data[i]});
        }
        return result;
    }
};


export const removeItem = async (unique: any) => {

    const invoiceitems: any = store.getState().cartData.invoiceitems || {}

    try {
        const filtered = invoiceitems?.filter((item: any) => {
            return item.key !== unique
        })

        if (Boolean(filtered?.length > 0)) {
            await store.dispatch(updateCartItems(clone(filtered)));
        } else {
            //await store.dispatch(setBottomSheet({visible: false}))
            Boolean(current.table?.tableorderid) && await deleteTempLocalOrder(current.table?.tableorderid);
            await store.dispatch(updateCartField({invoiceitems: []}))
        }
    } catch (e) {
        console.log('e', e)
    }

}

export const getCurrencySign = () => {
    const {currency}: any = localredux.initData;
    const {currency: cartCurrency}: any = store.getState().cartData;
    let currencylist = currency;
    let defaultcurrency: any = Object.keys(currencylist).find((k) => currencylist[k].rate === "1")

    if (cartCurrency) {
        return getSymbolFromCurrency(cartCurrency) + ' ';
    }
    return getSymbolFromCurrency(defaultcurrency) + ' ';
}


export const syncInvoice = () => {

    retrieveData('fusion-pro-pos-mobile').then(async (data: any) => {

        appLog("invoice data", data);
    })
}


export const groupBy = (arr: any, property: any) => {
    try {
        return arr.reduce(function (memo: any, x: any) {
            if (!memo[x[property]]) {
                memo[x[property]] = [];
            }
            memo[x[property]].push(x);
            return memo;
        }, {});
    } catch (e) {
        appLog('e', e)
    }
}

export const selectItem = async (item: any) => {

    const setItemQnt = async (item: any) => {

        try {

            const {addongroupid, addonid} = item?.addtags || {addongroupid: [], addonid: []}

            item = {
                ...item,
                key: uuid()
            }

            let start = moment();


            if (Boolean(addongroupid?.length) || Boolean(addonid?.length)) {

                item = {
                    ...item,
                    productqnt: item.productqnt || 0,
                    hasAddon: true
                }

                await store.dispatch(setItemDetail(item));

                if (!Boolean(item.productqnt)) {
                    await store.dispatch(setBottomSheet({
                        visible: true,
                        height: '80%',
                        component: () => <ItemDetail/>
                    }))
                } else {
                    await store.dispatch(setBottomSheet({
                        visible: true,
                        height: '20%',
                        component: () => <AddonActions product={item}/>
                    }))
                }

            } else {

                const itemRowData: any = setItemRowData(item);
                item = {
                    ...item,
                    ...itemRowData,
                }
                await store.dispatch(setCartItems(item))
            }

            let end = moment();
            var duration = moment.duration(end.diff(start));

            if (isDevelopment) {
                store.dispatch(setAlert({visible: true, message: duration.asMilliseconds()}))
            }
        } catch (e) {
            appLog('e', e)
        }
    }

    const directQnt = arraySome(store.getState()?.localSettings?.defaultAmountOpen, item.salesunit)
    if (directQnt) {
        onPressNumber(item, (productqnt: any) => {
            setItemQnt({...item, productqnt: +productqnt}).then()
            store.dispatch(setDialog({visible: false}))
        })
    } else {
        setItemQnt(item).then()
    }

}

/*export const testPrint = async (printer: any) => {

    const {host, printername,printertype,bluetoothdetail}: any = printer

    appLog('printertype',printertype)

    if(printertype === 'bluetooth'){

        const peripheral = bluetoothdetail.more;

        BleManager.retrieveServices(peripheral.id).then((peripheralInfo: any) => {
            appLog("peripheralInfo", peripheralInfo);

            const findSC = peripheralInfo?.characteristics?.find((sc: any) => sc?.characteristic?.length === 36 && sc?.service?.length === 36)
            if (findSC?.service && findSC?.characteristic) {

                setTimeout(() => {
                    BleManager.startNotification(peripheral.id, findSC?.service, findSC?.characteristic).then(() => {
                        appLog('Started notification on ' + peripheral.id);
                        setTimeout(async () => {
                            const cartData: any = testInvoiceData;


                            const buffer: any = EscPos.getBufferFromXML(`<?xml version="1.0" encoding="UTF-8"?><document><align mode="center"><text size="1:0">Test Print</text></align></document>`);
                            BleManager.write(peripheral.id, findSC?.service, findSC?.characteristic, [...buffer]).then(() => { });

                        }, 500);
                    }).catch((error) => {
                        appLog('Notification error', error);
                    });
                }, 200);
            }
        });

    }
    else {
        await EscPosPrinter.init({
            target: `TCP:${host}`,
            seriesName: getPrinterSeriesByName(printername),
            language: 'EPOS2_LANG_EN',
        })

        const printing = new EscPosPrinter.printing();
        let status = printing
            .initialize()
            .align('center')
            .size(2, 2)
            .line('Test Print')
            .newline(1)
            .cut()
            .addPulse()
            .send()
    }
}*/




let PAGE_WIDTH = 48;

export const getTrimChar = (count: number, char?: string, defaultLength: number = PAGE_WIDTH) => {
    let space = "";
    if (!Boolean(char)) {
        char = " ";
    }
    for (let i = 0; i < (defaultLength - count); i++) {
        space += char;
    }
    return space;
}

export const getColString = (value: string, colLength: number) => {
    if (!Boolean(value)) {
        value = " ";
    }

    if (value.length > colLength) {
        value = value.slice(0, colLength)
    }
    return value.toString()
}

export const getItem = (col1: string = "", col2: string = "", col3: string = "", col4: string = "") => {

    let fixCol1 = 20, fixCol2 = 7, fixCol3 = 9, fixCol4 = 9;

    if (PAGE_WIDTH === 42) {
        fixCol1 = 14;
    }

    col1 = getColString(col1, fixCol1);
    col2 = getColString(col2, fixCol2);
    col3 = getColString(col3, fixCol3);
    col4 = getColString(col4, fixCol4);

    let col1Length = fixCol1 - col1.length;
    let col2Length = fixCol2 - col2.length;
    let col3Length = fixCol3 - col3.length;
    let col4Length = fixCol4 - col4.length;

    let col1String = col1 + getTrimChar(PAGE_WIDTH - col1Length, " ");
    let col2String = getTrimChar(PAGE_WIDTH - col2Length, " ") + col2;
    let col3String = getTrimChar(PAGE_WIDTH - col3Length, " ") + col3;
    let col4String = getTrimChar(PAGE_WIDTH - col4Length, " ") + col4;
    return col1String + " " + col2String + " " + col3String + " " + col4String;
}

export const getLeftRight = (left: string, right: string, large: boolean = false) => {

    left = getColString(left, PAGE_WIDTH / 2);
    right = getColString(right, PAGE_WIDTH / 2);

    let charLength = left.length + right.length;

    return left + getTrimChar(parseInt(charLength.toString()), " ", large ? PAGE_WIDTH / 2 : PAGE_WIDTH) + right
}


export const generateKOT = async () => {

    return new Promise(async (resolve,reject) => {

        let kotid: any = '';
        store.dispatch(showLoader())
        let cartData = store.getState().cartData;
        const {currentLocation: {departments}} = localredux.localSettingsData;

        const currentTicketType = localredux.initData?.tickets[TICKETS_TYPE.KOT];

        const {adminid, username}: any = localredux.loginuserData;

        const today: any = store.getState().localSettings?.today;

        try {
            await retrieveData('fusion-pro-pos-mobile-kotno').then(async (kotno: any) => {

                if (!Boolean(kotno)) {
                    kotno = 0;
                }
                if ((today !== moment().format('YYYY-MM-DD'))) {
                    kotno = 0;
                    await retrieveData('fusion-pro-pos-mobile-settings').then(async (data: any) => {
                        data.today=moment().format('YYYY-MM-DD');
                        saveLocalSettings("today", data.today).then();
                        await store.dispatch(setSettings(data));
                    })
                }
                kotid = kotno;

                if (isEmpty(departments)) {
                    errorAlert(`No Kitchen Department`);
                } else {

                    let {
                        invoiceitems,
                        tableorderid,
                        tableid,
                        tablename,
                        ordertype,
                        kots,
                        commonkotnote,
                    } = cartData;


                    let itemForKot: any = [], newkot = {};
                    let printkot: any = [];
                    if (ordertype !== "tableorder") {
                        tablename = ordertype
                        if (tableorderid) {
                            tablename += ` #${tableorderid}`
                        }
                    }


                    if (invoiceitems) {

                        itemForKot = invoiceitems.filter((itemL1: any) => {
                            return Boolean(itemL1?.itemdepartmentid) && !Boolean(itemL1?.kotid)
                        });

                        if (itemForKot?.length > 0) {

                            let kitchens: any = [];

                            itemForKot?.forEach((item: any) => {

                                const kitchenid = item?.itemdepartmentid;

                                let find = kitchens.find((k: any) => k === kitchenid);
                                if (!Boolean(find)) {
                                    kitchens = [
                                        ...kitchens,
                                        kitchenid
                                    ]
                                }
                            });

                            const openTicketStatus = getTicketStatus(TICKET_STATUS.DONE);

                            let length = kitchens.length;


                            const recursive = async (i: any) => {
                                kotid++;

                                let k = kitchens[i]

                                await storeData('fusion-pro-pos-mobile-kotno', kotid).then(() => {
                                });

                                let kotitems: any = [];

                                itemForKot.forEach((itemL1: any, index: any) => {

                                    if (itemL1?.itemdepartmentid === k) {

                                        if (!Boolean(itemL1?.kotid)) {
                                            itemL1 = {
                                                ...itemL1,
                                                kotid: kotid,
                                                can_not_change: true
                                            }
                                        }

                                        let {
                                            product_qnt,
                                            productratedisplay,
                                            notes,
                                            productqnt,
                                            ref_id,
                                            groupname,
                                            itemunit,
                                            itemid,
                                            itemname,
                                            itemaddon,
                                            itemtags
                                        } = itemL1;

                                        const kot: any = {
                                            "productid": itemid,
                                            "productrate": productratedisplay,
                                            "productratedisplay": productratedisplay,
                                            "productqnt": productqnt,
                                            "productqntunitid": itemunit,
                                            "related": 0,
                                            "item_ref_id": "",
                                            "staffid": adminid,
                                            "productdisplayname": itemname,
                                            "itemgroupname": groupname,
                                            "instruction": notes || '',
                                            predefinenotes: notes || '',
                                            ref_id,
                                            key: itemL1.key,
                                        };

                                        if (itemaddon) {
                                            kot.addons = itemaddon
                                                .map(({
                                                          productid,
                                                          productrate,
                                                          productratedisplay,
                                                          productqntunitid,

                                                          productdisplayname,
                                                          productqnt
                                                      }: any) => {

                                                    return {
                                                        productid,
                                                        productrate,
                                                        productdisplayname,
                                                        productratedisplay,
                                                        productqntunitid,
                                                        productqnt
                                                    }
                                                })
                                        }

                                        if (Boolean(itemtags)) {
                                            let tags = itemtags?.map((itemtag: any) => {
                                                return itemtag?.taglist.filter((tag:any)=>{
                                                    return tag.selected
                                                })?.map((tag: any) => {
                                                    return `${itemtag.taggroupname} : ${tag.name}`
                                                })
                                            });

                                            kot.predefinenotes = kot.predefinenotes + ' ' + tags.filter((tag:any)=>{
                                                return Boolean(tag.length)
                                            }).join(' , ');
                                        }

                                        kotitems = [...kotitems, clone(kot)];

                                        itemForKot[index] = itemL1;
                                    }

                                });

                                const department = findObject(departments, 'departmentid', k, true)

                                newkot = {
                                    tickettypeid: currentTicketType?.tickettypeid,
                                    ticketnumberprefix: currentTicketType?.ticketnumberprefix,
                                    ticketstatus: openTicketStatus?.statusid,
                                    ticketstatusname: "Close",
                                    ticketitems: kotitems,
                                    ticketdate: moment().format("YYYY-MM-DD"),
                                    tickettime: moment().format("hh:mm A"),
                                    datetime: moment().unix(),
                                    kotid,
                                    tableid,
                                    counter: 1,
                                    print: 0,
                                    commonkotnote: commonkotnote,
                                    status: "pending",
                                    table: tablename,
                                    departmentid: k,
                                    departmentname: department?.name,
                                    staffid: adminid,
                                    staffname: username,
                                    ordertype: ordertype,
                                };

                                kots = [...kots, newkot];

                                printkot.push(newkot);

                                await printKOT(newkot).then(async (msg) => {

                                    if (i < length - 1) {
                                        recursive(++i).then()
                                    } else {
                                        const updateditems = invoiceitems.map((item: any) => {

                                            const find = findObject(itemForKot, 'key', item.key, true);
                                            if (Boolean(find)) {
                                                item = {
                                                    ...item,
                                                    kotid: find.kotid,
                                                }
                                            }
                                            return item
                                        })

                                        await store.dispatch(updateCartKots(kots))
                                        await store.dispatch(updateCartItems(updateditems))
                                        await store.dispatch(showLoader());

                                        resolve(msg)
                                    }
                                })
                            }

                            await recursive(0);

                        }
                        else{
                            resolve(true)
                        }

                    }
                }
            });
        } catch (e) {

            appLog('e', e)
            reject('print reject')
        }



    })

}



export const printInvoice = async (order?: any) => {

    try {


        let cartData = order || store.getState().cartData;

        cartData = await itemTotalCalculation(clone(cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);

        const PRINTERS: any = store.getState()?.localSettings?.printers || [];



        ///////// CREATE LOCALORDER ID //////////
        if (!Boolean(cartData.invoice_display_number)) {
            await retrieveData('fusion-pro-pos-mobile-vouchernos').then(async (vouchers: any) => {
                cartData = {
                    ...cartData,
                    invoice_display_number: (Boolean(vouchers) && vouchers[cartData.vouchertypeid]) || 1
                }
                vouchers = {...vouchers, [cartData.vouchertypeid]: ++cartData.invoice_display_number}
                await storeData('fusion-pro-pos-mobile-vouchernos', vouchers).then(async () => {
                    await store.dispatch(setCartData(cartData));
                });
            })
        }
        ///////// CREATE LOCALORDER ID //////////

        const {currentLocation: {locationname, street1,state, street2, city,pin,mobile}}: any = localredux.localSettingsData;
        const {general: {legalname}}: any = localredux.initData;
        const {terminal_name}: any = localredux.licenseData.data;
        const {firstname, lastname}: any = localredux.authData;

        let decimalPlace = cartData?.currentDecimalPlace || 2;

        let totalqnt: any = 0;
        let uniuqeitems:any = {};
        let totalmrp = 0;


        cartData?.invoiceitems?.map((item: any) => {
            totalqnt += +item.productqnt;
            if(!Boolean(uniuqeitems[item.itemid])){
                uniuqeitems[item.itemid] = 0;
            }
            totalmrp += (item.mrp || item.productratedisplay) * item.productqnt;
            uniuqeitems[item.itemid] = uniuqeitems[item.itemid]+1
        });

        const totaluniqueitems = objToArray(uniuqeitems)?.length;

        let paymentsby:any = [];
        cartData?.payment?.map((pay:any)=>{
            if(pay.paymentAmount) {
                paymentsby.push(pay.paymentby)
            }
        })


        if(Boolean(paymentsby)){
            cartData = {
                ...cartData,
                paymentsby:paymentsby?.join(', '),
                isListPayment:true
            }
        }

        cartData.totalMRP = totalmrp;
        if(+cartData.totalMRP > +cartData?.vouchertotaldisplay){
            cartData = {
                ...cartData,
                totalSave:totalmrp - cartData?.vouchertotaldisplay
            }
        }

        let printJson = {
            ...cartData,
            logo:getPrintTemplateLogo('Thermal'),
            locationname, street1, street2,state, city,pin,mobile,legalname,terminalname:terminal_name,firstname, lastname,
            clientname:cartData?.client || cartData?.clientname,
            isListPayment:Boolean(cartData?.payment?.length > 0),
            isdisplaytaxable: cartData?.vouchersubtotaldisplay != cartData?.vouchertaxabledisplay,
            head: () => getItem("DESCRIPTION", "QNT", "RATE", "AMOUNT") + "\n" + getItem("HSN Code", "GST %", "", ""),
            items: cartData?.invoiceitems?.map((item: any) => {
                    return getItem(item.productdisplayname, item.productqnt, numberFormat(item.productratedisplay, decimalPlace), numberFormat(item.product_total_price_display, decimalPlace)) + "\n" + getItem(item?.hsn || '', item?.totalTaxPercentageDisplay + "%", "", "")
                }
            ),
            counter: () => getItem(`Total Items ${totaluniqueitems}`, "QNT : "+totalqnt, "", numberFormat(cartData?.vouchertotaldisplay, decimalPlace)),
            countersubtotal: () => getItem(`Total Items ${totaluniqueitems}`, "QNT : "+totalqnt, "", numberFormat(cartData?.vouchersubtotaldisplay, decimalPlace)),
            total: () => getLeftRight(cartData.paymentsby || 'Total', numberFormat(cartData?.vouchertotaldisplay, decimalPlace)),
            subtotal: () => getLeftRight(cartData.paymentsby || 'Sub Total', numberFormat(cartData?.vouchertotaldisplay, decimalPlace)),
            taxabledisplay: () => getLeftRight("Taxable", numberFormat(cartData?.vouchertaxabledisplay, decimalPlace)),
            totalbig: () => getLeftRight(cartData.paymentsby || 'Total', numberFormat(cartData?.vouchertotaldisplay, decimalPlace), true),
            totaltax: () => getLeftRight("TotalTax", numberFormat(cartData?.vouchertaxdisplay, decimalPlace)),
            discount: () => getLeftRight("Discount", numberFormat(cartData?.vouchertotaldiscountamountdisplay, decimalPlace)),
            roundoff: () => getLeftRight("Roundoff", numberFormat(cartData?.voucherroundoffdisplay, decimalPlace)),
            adjustment: () => getLeftRight("Adjustment", numberFormat(cartData?.adjustmentamount, decimalPlace)),
            totalMRP: () => getLeftRight("Total MRP", numberFormat(cartData?.totalMRP, decimalPlace)),
            paymentList: () => cartData.payment?.map((pm: any) => {
                if(Boolean(pm?.paymentAmount)) {
                    return getLeftRight(pm.paymentby, numberFormat(pm?.paymentAmount))
                }
            }),
            taxes: () => cartData?.typeWiseTaxSummary?.map((item: any) => {
                return `${item?.taxtype}:${numberFormat(item?.taxprice, decimalPlace)}`
            }).join(", "),
            line: () => "<text>" + getTrimChar(0, "-") + "\n</text>",
        }

        let printer = PRINTERS[PRINTER.INVOICE];
        const upiid  = printer?.upiid;
        const upiname = printer?.upiname;

        PAGE_WIDTH = printer?.printsize || 48;

        let qrcode:any = false;
        if(upiid && upiname){
            qrcode = {
                value: `upi://pay?cu=INR&pa=${upiid}&pn=${upiname}&am=${cartData?.vouchertotaldisplay}&tr=${cartData?.invoice_display_number}`,
                level: 'EPOS2_LEVEL_M',
                width: 5,
            }
        }



        return await new Promise(async (resolve) => {

            const template:any = getPrintTemplate('Thermal');

            if(Boolean(printer?.host)) {
                setTimeout(()=>{
                    sendDataToPrinter(printJson, getTemplate(template), {
                        ...printer,
                        qrcode
                    }).then((msg) => {
                        store.dispatch(setAlert({visible: true, message: msg}))
                        resolve(msg)
                    });
                },200)

            }
            else{
                setTimeout(()=>{
                    store.dispatch(setAlert({visible: true, message: 'Invoice Printer not set'}))
                },200)
                resolve(false)
            }
        })

    }
    catch (e) {
        appLog('error printInvoice',e)
    }

}







export const printKOT = async (kot?: any) => {


    try {
        const PRINTERS: any = store.getState().localSettings?.printers || [];
        let printJson = {
            ...kot,
            line: () => "<text>" + getTrimChar(0, "-") + "\n</text>"
        }

        const printer = PRINTERS[kot?.departmentid];
        PAGE_WIDTH = printer?.printsize || 48;

        if((kot?.cancelled && printer?.printoncancel) || !kot?.cancelled) {
            return new Promise(async (resolve) => {
                if(Boolean(printer?.host)) {
                    const template:any = getPrintTemplate('KOT');
                    sendDataToPrinter(printJson, getTemplate(template), printer).then((msg) => {
                        resolve(msg)
                    });
                }
                else{
                    store.dispatch(setAlert({visible: true, message: 'Kitchen Printer not set'}))
                    resolve('No printer set')
                }
            })
        }

    } catch (e) {
        appLog("printKOT Error", e);
    }
}


export const getPrintTemplateLogo = (type?:any) => {
    const {printingtemplates}:any = localredux.localSettingsData || {}

    if(Boolean(printingtemplates) && Boolean(printingtemplates[type])) {
        return  printingtemplates[type]?.logo
    }
    return ''
}


export const getPrintTemplate = (type?:any) => {
    const {printingtemplates}:any = localredux.localSettingsData || {}

    if(Boolean(printingtemplates) && Boolean(printingtemplates[type])) {
        return  base64Decode(printingtemplates[type]?.content)
    }
    return type === 'KOT' ? defaultKOTTemplate : defaultInvoiceTemplate
}

export const cancelOrder = async (navigation: any) => {

    let cartData = store.getState().cartData;

    try {

        const {kots, tableorderid, invoiceitems}: any = cartData;

        if (kots?.length === 0 || (kots?.length > 0 && invoiceitems?.length === 0)) {
            store.dispatch(resetCart())

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'ClientAreaStackNavigator'},
                    ],
                })
            );

            if (tableorderid) {
                deleteTempLocalOrder(tableorderid).then(() => {

                })
            }
        } else {
            navigation.navigate('CancelReason',{type:'ordercancelreason'})
        }
    } catch (e) {
        appLog('e', e)
    }
}

export const arraySome = (arrayList: any[], key: string) => {
    if (!Array.isArray(arrayList)) {
        return false
    }
    return arrayList?.some((k: string) => k === key)
}


export const getStateList = (country: any) => {
    const {workspace}:any = localredux.initData;
    const {token}:any = localredux.authData;

    let queryString = {country};
    return apiService({
        method: METHOD.GET,
        action: ACTIONS.GETSTATE,
        queryString,
        workspace:workspace,
        token:token,
        hideLoader: true,
        other: {url: adminUrl},
    })
}


export const selectWorkspace = async (workspace:any,navigation:any) => {

    store.dispatch(showLoader())
    const {token}:any = localredux.authData;

    await apiService({
        method: METHOD.GET,
        action: ACTIONS.INIT,
        queryString: {stream: "pos"},
        other: {url: adminUrl,workspace:true},
        token: token,
        workspace: workspace.name
    }).then((response: any) => {
        store.dispatch(hideLoader())

        if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
            localredux.initData = {...response.data, deviceName: response?.deviceName,workspace:workspace.name}
            if(Boolean(localredux.initData?.general?.legalname) && Boolean(localredux.initData?.location) && Boolean(localredux.initData?.currency)){
                navigation.navigate('Terminal');
            }
            else{
                navigation.navigate('OrganizationProfile');
            }
        }
    }).catch(() => {
        store.dispatch(hideLoader())
    })

}


export const getTemplate = (template: string) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<document>
   ` + template + `
</document>
`
}




/*
Permissions.getPermissionStatus('localNetwork').then((r) => {
    if (r === 'authorized') {
        // Do something
    } else if (r === 'undetermined') {
        Permissions.requestPermission('localNetwork').then((response) => {
            if (response === 'authorized') {
                // Do something
            }
            if (response === 'denied') {
                // Notify user about Local Network permission denied, advice user to turn on permission
            }
        });
    } else {
        // Notify user about Local Network permission denied, advice user to turn on permission
    }
});*/




export const getClients = async (refresh = false) => {
    await getClientsByWhere({}).then((clients: any) => {
        localredux.clientsData = clients
    });
}

export const getAddons = async (refresh = false) => {
    await getAddonByWhere({}).then((addons:any) => {
        localredux.addonsData = addons
    });
}



export const gePhonebook = async (force?:any) => {

    const synccontact:any = await  getLocalSettings('synccontact');

    appLog('synccontact',synccontact)

    if(!Boolean(synccontact) || force) {

        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: "Contacts.",
                        message:
                            "This app would like to view your contacts.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    await loadContacts()
                } else {
                    appLog("Contact permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        }

        if (Platform.OS === "ios") {
           await PermissionsAndroid.requestMultiple([PERMISSIONS.IOS.CONTACTS]).then(async (statuses: any) => {
                if (statuses[PERMISSIONS.IOS.CONTACTS]) {
                    await loadContacts()
                }
            });
        }
    }
}

export const loadContacts = async () => {

    function compare(a: any, b: any) {
        if (a.displayname < b.displayname) {
            return -1;
        }
        if (a.displayname > b.displayname) {
            return 1;
        }
        return 0;
    }

    store.dispatch(showLoader())

    await Contacts.getAll()
        .then(async contacts => {
            let clients: any = [];
            contacts && contacts.map((contact: any) => {
                if (Boolean(contact.phoneNumbers[0])) {
                    const regx = /[^0-9]/g;
                    const regx2 = /[^a-zA-Z0-9_. -]/g;
                    contact && clients.push({
                        displayname: (contact.displayName || contact.givenName + ' ' + contact.familyName).replace(regx2," "),
                        phone:  contact.phoneNumbers[0].number,
                        clientid: contact.phoneNumbers[0].number?.replace(regx,""),
                        phonebook: true,
                        clienttype:0,
                        taxregtype:'',
                        thumbnailPath: contact.thumbnailPath
                    })
                }
            });
            clients.sort(compare);

            await insertClients(clients,'all').then(async () => {
                await saveLocalSettings('synccontact', true).then(() => {
                    store.dispatch(hideLoader())
                })
            });
        })
        .catch(e => {
            appLog('error', e)
        });
    Contacts.checkPermission().then();

}
