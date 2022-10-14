import {getType} from "@reduxjs/toolkit";
import {assignOption, getCurrencyData, getDateWithFormat, isEmpty} from "./function";


export enum STATUS {
    ACTIVE_WORKSPACE = "Active",
    SUCCESS = "success",
    ERROR = "error"
}

export enum METHOD {
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE",
    PUT = "PUT"
}

export enum ACTIONS {
    INVOICE = "invoice",
    VOUCHER = "voucher",
    ITEM = "item",
    LOGIN = "login",
    INIT = "init",
    TERMINAL = "terminal",
    SYNC_DATA = "syncdata",
    LICENSE = "license",
    LOGINPIN = "loginpin",
    CLIENT = "client",
    PRINT = "print",
    LAST_ORDER = "order/lastorder",
    ORDER = "order",
    SALESREPORT = "report/salesreport",
    OPEN_DRAWER = "print/opendrawer",
    TEST_PRINT = "print/testprint",
    REPORT_PRINT = "print/salesreport",
    KOT_PRINT = "print/printkot",
    SERVER_LANDING_RATE = 'server/landingrate',
    SERVER_ITEM = "server/item",
    SERVER_CATEGORY = "server/category",
    SERVER_CLIENT = "server/client",
    SERVER_ORDER = "server/order",
    SERVER_PRINTINVOICE = "server/printinvoice",
    SERVER_INVOICE = "server/invoice",
    SERVER_PRINTING = "server/printing",
    SERVER_RECEIPT = "server/receipt",
    SETTING = "setting/",
    DRAWER = "drawer",
    SAVE_TABLE_ORDER = "tableorder",
    REPORT_SALES = "reportsales"
}


export enum VOUCHER {
    INVOICE = "b152d626-b614-4736-8572-2ebd95e24173",
    TAX_INVOICE = "372278d3-c3c9-4c5e-9890-f66cfa2cb1e4",
    RECEIPT = "be0e9672-a46e-4e91-a2bf-815530b22b43"
}

export enum TICKET_STATUS {
    OPEN = "186d2863-874e-4517-bc89-c7b1e570d493",
    DONE = "43573168-4050-41a4-8a67-452d46204fa1",
    IN_PROCESS = "d80e50e0-4a49-4a8d-97a2-72fd3fcf6885",
    DECLINED = "facdc262-2bf9-4fdb-a9f9-217a6de6ebee",
}

export enum PRODUCTCATEGORY {
    DEFAULT = '5f2dd580-eae2-46a4-b136-bc5c3cb180c6'

}


export enum ORDERSOURCES {
    pos = "POS",
    onlineorder = "Online Order",
    foodbanda = "Food Panda",
    swiggy = "Swiggy",
    zomato = "Zomato",
    ubereats = "Uber Eats",
}


export enum PAYMENTGATEWAY {
    CASH = "c02fc4ca-8d89-4c91-bd66-2dd29bc34e43",
}

export enum PRINTER {
    INVOICE = "0000",
}


export const taxTypes: any = {
    exclusive: "Exclusive of Tax",
    inclusive: "Inclusive of Tax",
    outofscope: "Out of scope of Tax",
};


export const orderType: any = {
    homedelivery: "Home Delivery",
    takeaway: "Takeaway",
    qsr: "QSR",
};

export const defalut_payment_term = [
    assignOption("Due end of month", "endmonth", false),
    assignOption("Due end of next month", "nextendmonth", false),
    assignOption("Due on Receipt", "date", true),
]


export const isDevelopment = process.env.NODE_ENV === "development";

const apiUrl = isDevelopment ? ".api.dhru.io" : ".api.dhru.com";
export const posUrl: any = `${apiUrl}/pos/v1/`;
export const adminUrl: any = `${apiUrl}/admin/v1/`;
const mainUrl = "https://api.dhru.com";
export const loginUrl: any = `${mainUrl}/client/api/v1/`;

export const screenOptionStyle: any = {
    headerShown: false,
    headerTitleAlign: 'center',
    /*headerShown: false,
    animation: false,
    headerTitleAlign: 'center',
    headerLargeTitle: false,
    fullScreenSwipeEnabled: false,
    disableBackButtonMenu: false,
    backButtonInCustomView: false,
    headerBackTitleVisible: false,
    headerHideBackButton: false,
    headerTintColor: 'black',
    stackAnimation: 'slide_from_right',
    stackPresentation: 'push',
    screenOrientation: 'portrait',
    autoCapitalize: 'sentences',
    headerTopInsetEnabled: false,
    headerHideShadow: true,
    headerLargeTitleHideShadow: true,
    headerLargeTitleStyle: {},
    headerStyle: {
      shadowOpacity: 0,
      elevation: 0,
    },
    backTitleStyle: {},*/
};


const regExpJson = {
    email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
    leastOneDigit: /.*[0-9].*/,
    leastOneCAPS: /.*[A-Z].*/,
    leastOneSymbol: /.*[@#$%^&+=!].*/,
    hexCode: /^#[0-9A-F]{6}$/i,
    digitOneDecimalSpace: /^(\d)*(\.)?(\d)*$/
};

export const required = (value: any, label?: any) => {
    let message = "is required"
    if (Boolean(label) && getType(label) === "string") {
        message = `${label} ${message}`
    }
    return value ? undefined : message
}
export const isEmail = (value: any) => (regExpJson.email.test(value) ? undefined : 'is invalid')
export const isHexCode = (value: any) => (regExpJson.hexCode.test(value) ? undefined : 'is invalid')
export const isValidPassword = (value: any) => {
    if (value.length < 8) {
        return 'should be at least 8 characters in length.'
    } else if (!regExpJson.leastOneCAPS.test(value)) {
        return 'must include at least one CAPS!'
    } else if (!regExpJson.leastOneDigit.test(value)) {
        return 'must include at least one number!'
    } else if (!regExpJson.leastOneSymbol.test(value)) {
        return 'must include at least one symbol!'
    }
}
export const matchPassword = (password: any) => (value: any) => {
    if (password !== value) {
        return 'not match with password'
    }
}
export const startWithString = (value: any) => {
    if (value.match(/^\d/)) {
        return 'must start with string'
    }
}
export const mustBeNumber = (value: any) => (isNaN(value) ? 'Must be a number' : undefined)
export const onlyDigitOneDecimal = (value: any) => (regExpJson.digitOneDecimalSpace.test(value) ? undefined : 'is invalid')
export const minLength = (min: any, label?: any) => (value: any) => {
    if (value?.length !== min) {
        let message = `must be ${min} digit`
        if (Boolean(label) && getType(label) === "string") {
            message = `${label} ${message}`
        }
        return message
    }
}

export const composeValidators = (...validators: any) => (value: any) =>
    validators.reduce((error: any, validator: any) => error || validator(value), undefined)


export const device: any = {tablet: true}

export const defaultclient: any = {clientid: 1, clientname: 'Walkin'}

export const ordertypes: any = [{label: 'All', value: 'all'}, {
    label: 'Tables',
    value: 'tableorder'
}, {label: 'Home Delivery', value: 'homedelivery'}, {label: 'Takeaway', value: 'takeaway'}, {
    label: 'QSR',
    value: 'qsr'
}];


export const current: any = {table: {tablename: 'Retail'}}


export let localredux: any = {
    authData: '',
    initData: '',
    licenseData: '',
    loginuserData: '',
    itemsData: '',
    groupItemsData: {},
    addonsData: '',
    clientsData: '',
    invoiceitems: [],
    localSettingsData: {
        taxInvoice: false,
        currentLocation: {},
        lastSynctime: '',
        isRestaurant: false,
        currentTable: {}
    },
}

export const defaultInputValues = [
    "0.100",
    "0.200",
    "0.250",
    "0.300",
    "0.400",
    "0.500",
    "0.750",
]

export const APP_NAME = "Dhru POS";
