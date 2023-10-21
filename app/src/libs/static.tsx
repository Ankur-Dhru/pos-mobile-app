import {getType} from "@reduxjs/toolkit";
import {appLog, assignOption, getDatabaseName, getLocalSettings, setAPIUrl} from "./function";
import React from "react";
import {View} from "react-native";


export const isDevelopment = process.env.NODE_ENV === "development";

export const port = process.env.NODE_ENV === "development" ? '8081' : '8081';



export let posUrl: any = '';
export let adminUrl: any = '';

export const urls = {posUrl:'',adminUrl:'',localserver:''}
export const db = {name:''}
export const capture = {photo:''}


getLocalSettings('generalsettings').then((r:any) => {
    setAPIUrl(Boolean(r?.betamode))
});


export const version = '3.8.0'

const mainUrl = "https://api.dhru.com";
export const loginUrl: any = `${mainUrl}/client/api/v1/`;


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
    EXPENSE = "expense",
    RECEIPT = "receipt",
    PAYMENT = "payment",
    SEARCH = "search",
    VOUCHER = "voucher",
    ITEM = "item",
    ITEMS = "items",
    CATEGORY = "category",
    CHARTOFACCOUNT = "chartofaccount",
    LOGIN = "login",
    INIT = "init",
    TERMINAL = "terminal",
    SETTINGS = "settings",
    GETTAXREGISTRATIONTYPE = "gettaxregtype",
    GETSTATE = "getstate",
    REGISTER = "register",
    SYNC_DATA = "syncdata",
    LICENSE = "license",
    LOGINPIN = "loginpin",
    CLIENT = "client",
    CLIENTS = "clients",
    PRINT = "print",
    REFRESH="refresh",
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
    PRINTING = "printing",
    SERVER_RECEIPT = "server/receipt",
    SETTING = "setting/",
    DRAWER = "drawer",
    SAVE_TABLE_ORDER = "tableorder",
    REPORT_SALES = "reportsales",
    REPORT_SALES_RETURN = "salesreturnreport",
    DAY_END_REPORT = "dayendreport",
    REPORTCURRENTSTOCK = "reportcurrentstock",
    REPORTITEMWISE = "reportitemwise",
    PRINTINVOICE = "printinvoice",
    SALESRETURN = "salesreturn",
    ONLINEORDER="onlineorder"
}


export enum VOUCHER {
    INVOICE = "b152d626-b614-4736-8572-2ebd95e24173",
    EXPENSE = "ba7f0f54-60da-4f07-b07b-8645632616ac",
    TAX_INVOICE = "372278d3-c3c9-4c5e-9890-f66cfa2cb1e4",
    RECEIPT = "be0e9672-a46e-4e91-a2bf-815530b22b43",
    PAYMENTMADE = "c86a5524-30a4-4954-9303-1cf028f546a7",
    SALESRETURN = "8a2c1b35-1781-409c-820e-73e90821735f"
}

export enum TICKETS_TYPE {
    KOT = "2ecf3967-4083-4070-9912-d0fbcd3cf25e"
}

export enum TICKET_STATUS {
    OPEN = "186d2863-874e-4517-bc89-c7b1e570d493",
    DONE = "43573168-4050-41a4-8a67-452d46204fa1",
    IN_PROCESS = "d80e50e0-4a49-4a8d-97a2-72fd3fcf6885",
    DECLINED = "facdc262-2bf9-4fdb-a9f9-217a6de6ebee",
}

export enum PRODUCTCATEGORY {
    DEFAULT = '5f2dd580-eae2-46a4-b136-bc5c3cb180c6',
    TAXGROUPID = "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
    ITEMUNIT = "9c2ecc81-d201-4353-8fbc-7b9d61e0afb4",
    DEPARTMENT = "b8035c22-0b89-408e-b7b2-969d750bd84f",
    LOCATIONID = "06aa6e6d-a01b-43b5-849e-a1d84ba533ad",
}


export enum ORDERSOURCES {
    pos = "POS",
    onlineorder = "Online Order",
    foodbanda = "Food Panda",
    swiggy = "Swiggy",
    zomato = "Zomato",
    ubereats = "Uber Eats",
}

export enum GET_ITEM_TYPE {
    LOWER  = 'lower',
    HIGHER = 'higher',
}

export enum PAYMENTGATEWAY {
    CASH = "c02fc4ca-8d89-4c91-bd66-2dd29bc34e43",
}

export enum PRINTER {
    INVOICE = "0000",
    DAYENDREPORT = "1111",
    SALESRETURN = "2222"
}

export enum COUPON_TYPE {
    COMBO    = 'combo',
    DISCOUNT = 'discount',
    GROUP = 'group'
}

export enum ITEM_TYPE {
    ITEM    = 'items',
    CATEGORY = 'category'
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


export const inventoryOption: any = {
    specificidentification: {
        name: "Specific Identification",
        // info: "Used by organisations with specifically identifiable invitatory; cost can be directly attributed  and are specifically assigned to the specific unit sold",
        info: "Specific identification required unique serial number, have a Auto generate by system or manual input",
        disabled: false
    },
    fifo: {
        name: "FIFO",
        info: "The earliest purchase goods are removed and expensed first",
        disabled: false
    },
    lifo: {
        name: "LIFO",
        info: "The latest purchased good are removed and expensed first",
        disabled: true
    },
    weightedaverage: {
        name: "Weighted Average",
        info: "The total cost of goods available for sale divided by units available",
        disabled: true
    },
};

export const options_itc: any = [
    assignOption("Eligible for ITC", "eligible"),
    assignOption("Ineligible - As per Section 17(5)", "ineligible17"),
    assignOption("Ineligible Others", "ineligibleothers"),
    assignOption("Import of Goods", "goods"),
    assignOption("Import of Service", "service"),
]

export const pricing: any = {
    "type": "onetime",
    "qntranges": [
        {
            "id": "0",
            "start": 1,
            "end": 10000000000,
            "text": "1 - Infinite"
        },
    ],
    "price": {
        "default": [
            {
                "onetime": {
                    "baseprice": ''
                }
            },
        ],
    },
    "advancestructure": false,
    "setup": false
};

export const screenOptionStyle: any = {

    headerTitleAlign: 'center',
    headerLargeTitle: false,
    fullScreenSwipeEnabled: false,
    disableBackButtonMenu: false,
    backButtonInCustomView: false,
    headerBackTitleVisible: false,
    headerHideBackButton: false,
    stackAnimation: 'slide_from_right',
    stackPresentation: 'push',
    screenOrientation: 'portrait',
    headerTopInsetEnabled: false,
    headerHideShadow: false,
    headerLargeTitleHideShadow: true,
    headerShadowVisible:false,
    headerStyle: {
        /*shadowOpacity: 0,
        elevation: 0,*/
        backgroundColor:'#fff',
    },

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
export const betweenLength = (min:any,max: any, label?: any) => (value: any) => {
    if (value?.length > max || value?.length < min) {
        let message = `min ${min} and max ${max} digit`
        if (Boolean(label) && getType(label) === "string") {
            message = `${label} ${message}`
        }
        return message
    }
}
export const maxValue = (max: any, label?: any) => (value: any) => {
    if (value > max) {
        let message = `maximum value is ${max}`
        if (Boolean(label) && getType(label) === "string") {
            message = `${label} ${message}`
        }
        return message
    }
}
export const minValue = (min: any, label?: any) => (value: any) => {
    if (value < min) {
        let message = `minimum value is ${min}`
        if (Boolean(label) && getType(label) === "string") {
            message = `${label} ${message}`
        }
        return message
    }
}

export const composeValidators = (...validators: any) => (value: any) =>
    validators.reduce((error: any, validator: any) => error || validator(value), undefined)


export const device: any = {tablet: true, db: '', token: '', global_token: '', navigation: '',uniqueid:''}

export const defaultclient: any = {clientid: 1, clientname: 'Walkin'}

export const ordertypes: any = [
    {label: 'All', value: 'all'},
    {label: 'Tables', value: 'tableorder'},
    {label: 'Home Delivery', value: 'homedelivery'},
    {label: 'Takeaway', value: 'takeaway'},
    {label: 'Advance Order', value: 'advanceorder'},
    {label: '+ QSR / Quick Bill', value: 'qsr'},
];


export const current: any = {table: {tablename: 'Retail'}}


export let localredux: any = {
    authData: {},
    initData: {},
    licenseData: {},
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

export const defaultInputAmounts = [
    "50",
    "100",
    "200",
    "500",
]

export const APP_NAME = "Dhru POS";


export const countrylist = [
    {
        "name": "Afghanistan",
        "dial_code": "93",
        "code": "AF"
    },
    {
        "name": "Aland Islands",
        "dial_code": "358",
        "code": "AX"
    },
    {
        "name": "Albania",
        "dial_code": "355",
        "code": "AL"
    },
    {
        "name": "Algeria",
        "dial_code": "213",
        "code": "DZ"
    },
    {
        "name": "AmericanSamoa",
        "dial_code": "1684",
        "code": "AS"
    },
    {
        "name": "Andorra",
        "dial_code": "376",
        "code": "AD"
    },
    {
        "name": "Angola",
        "dial_code": "244",
        "code": "AO"
    },
    {
        "name": "Anguilla",
        "dial_code": "1264",
        "code": "AI"
    },
    {
        "name": "Antarctica",
        "dial_code": "672",
        "code": "AQ"
    },
    {
        "name": "Antigua and Barbuda",
        "dial_code": "1268",
        "code": "AG"
    },
    {
        "name": "Argentina",
        "dial_code": "54",
        "code": "AR"
    },
    {
        "name": "Armenia",
        "dial_code": "374",
        "code": "AM"
    },
    {
        "name": "Aruba",
        "dial_code": "297",
        "code": "AW"
    },
    {
        "name": "Australia",
        "dial_code": "61",
        "code": "AU"
    },
    {
        "name": "Austria",
        "dial_code": "43",
        "code": "AT"
    },
    {
        "name": "Azerbaijan",
        "dial_code": "994",
        "code": "AZ"
    },
    {
        "name": "Bahamas",
        "dial_code": "1242",
        "code": "BS"
    },
    {
        "name": "Bahrain",
        "dial_code": "973",
        "code": "BH"
    },
    {
        "name": "Bangladesh",
        "dial_code": "880",
        "code": "BD"
    },
    {
        "name": "Barbados",
        "dial_code": "1246",
        "code": "BB"
    },
    {
        "name": "Belarus",
        "dial_code": "375",
        "code": "BY"
    },
    {
        "name": "Belgium",
        "dial_code": "32",
        "code": "BE"
    },
    {
        "name": "Belize",
        "dial_code": "501",
        "code": "BZ"
    },
    {
        "name": "Benin",
        "dial_code": "229",
        "code": "BJ"
    },
    {
        "name": "Bermuda",
        "dial_code": "1441",
        "code": "BM"
    },
    {
        "name": "Bhutan",
        "dial_code": "975",
        "code": "BT"
    },
    {
        "name": "Bolivia, Plurinational State of",
        "dial_code": "591",
        "code": "BO"
    },
    {
        "name": "Bosnia and Herzegovina",
        "dial_code": "387",
        "code": "BA"
    },
    {
        "name": "Botswana",
        "dial_code": "267",
        "code": "BW"
    },
    {
        "name": "Brazil",
        "dial_code": "55",
        "code": "BR"
    },
    {
        "name": "British Indian Ocean Territory",
        "dial_code": "246",
        "code": "IO"
    },
    {
        "name": "Brunei Darussalam",
        "dial_code": "673",
        "code": "BN"
    },
    {
        "name": "Bulgaria",
        "dial_code": "359",
        "code": "BG"
    },
    {
        "name": "Burkina Faso",
        "dial_code": "226",
        "code": "BF"
    },
    {
        "name": "Burundi",
        "dial_code": "257",
        "code": "BI"
    },
    {
        "name": "Cambodia",
        "dial_code": "855",
        "code": "KH"
    },
    {
        "name": "Cameroon",
        "dial_code": "237",
        "code": "CM"
    },
    {
        "name": "Canada",
        "dial_code": "1",
        "code": "CA"
    },
    {
        "name": "Cape Verde",
        "dial_code": "238",
        "code": "CV"
    },
    {
        "name": "Cayman Islands",
        "dial_code": " 345",
        "code": "KY"
    },
    {
        "name": "Central African Republic",
        "dial_code": "236",
        "code": "CF"
    },
    {
        "name": "Chad",
        "dial_code": "235",
        "code": "TD"
    },
    {
        "name": "Chile",
        "dial_code": "56",
        "code": "CL"
    },
    {
        "name": "China",
        "dial_code": "86",
        "code": "CN"
    },
    {
        "name": "Christmas Island",
        "dial_code": "61",
        "code": "CX"
    },
    {
        "name": "Cocos (Keeling) Islands",
        "dial_code": "61",
        "code": "CC"
    },
    {
        "name": "Colombia",
        "dial_code": "57",
        "code": "CO"
    },
    {
        "name": "Comoros",
        "dial_code": "269",
        "code": "KM"
    },
    {
        "name": "Congo",
        "dial_code": "242",
        "code": "CG"
    },
    {
        "name": "Congo, The Democratic Republic of the Congo",
        "dial_code": "243",
        "code": "CD"
    },
    {
        "name": "Cook Islands",
        "dial_code": "682",
        "code": "CK"
    },
    {
        "name": "Costa Rica",
        "dial_code": "506",
        "code": "CR"
    },
    {
        "name": "Cote d'Ivoire",
        "dial_code": "225",
        "code": "CI"
    },
    {
        "name": "Croatia",
        "dial_code": "385",
        "code": "HR"
    },
    {
        "name": "Cuba",
        "dial_code": "53",
        "code": "CU"
    },
    {
        "name": "Cyprus",
        "dial_code": "357",
        "code": "CY"
    },
    {
        "name": "Czech Republic",
        "dial_code": "420",
        "code": "CZ"
    },
    {
        "name": "Denmark",
        "dial_code": "45",
        "code": "DK"
    },
    {
        "name": "Djibouti",
        "dial_code": "253",
        "code": "DJ"
    },
    {
        "name": "Dominica",
        "dial_code": "1767",
        "code": "DM"
    },
    {
        "name": "Dominican Republic",
        "dial_code": "1849",
        "code": "DO"
    },
    {
        "name": "Ecuador",
        "dial_code": "593",
        "code": "EC"
    },
    {
        "name": "Egypt",
        "dial_code": "20",
        "code": "EG"
    },
    {
        "name": "El Salvador",
        "dial_code": "503",
        "code": "SV"
    },
    {
        "name": "Equatorial Guinea",
        "dial_code": "240",
        "code": "GQ"
    },
    {
        "name": "Eritrea",
        "dial_code": "291",
        "code": "ER"
    },
    {
        "name": "Estonia",
        "dial_code": "372",
        "code": "EE"
    },
    {
        "name": "Ethiopia",
        "dial_code": "251",
        "code": "ET"
    },
    {
        "name": "Falkland Islands (Malvinas)",
        "dial_code": "500",
        "code": "FK"
    },
    {
        "name": "Faroe Islands",
        "dial_code": "298",
        "code": "FO"
    },
    {
        "name": "Fiji",
        "dial_code": "679",
        "code": "FJ"
    },
    {
        "name": "Finland",
        "dial_code": "358",
        "code": "FI"
    },
    {
        "name": "France",
        "dial_code": "33",
        "code": "FR"
    },
    {
        "name": "French Guiana",
        "dial_code": "594",
        "code": "GF"
    },
    {
        "name": "French Polynesia",
        "dial_code": "689",
        "code": "PF"
    },
    {
        "name": "Gabon",
        "dial_code": "241",
        "code": "GA"
    },
    {
        "name": "Gambia",
        "dial_code": "220",
        "code": "GM"
    },
    {
        "name": "Georgia",
        "dial_code": "995",
        "code": "GE"
    },
    {
        "name": "Germany",
        "dial_code": "49",
        "code": "DE"
    },
    {
        "name": "Ghana",
        "dial_code": "233",
        "code": "GH"
    },
    {
        "name": "Gibraltar",
        "dial_code": "350",
        "code": "GI"
    },
    {
        "name": "Greece",
        "dial_code": "30",
        "code": "GR"
    },
    {
        "name": "Greenland",
        "dial_code": "299",
        "code": "GL"
    },
    {
        "name": "Grenada",
        "dial_code": "1473",
        "code": "GD"
    },
    {
        "name": "Guadeloupe",
        "dial_code": "590",
        "code": "GP"
    },
    {
        "name": "Guam",
        "dial_code": "1671",
        "code": "GU"
    },
    {
        "name": "Guatemala",
        "dial_code": "502",
        "code": "GT"
    },
    {
        "name": "Guernsey",
        "dial_code": "44",
        "code": "GG"
    },
    {
        "name": "Guinea",
        "dial_code": "224",
        "code": "GN"
    },
    {
        "name": "Guinea-Bissau",
        "dial_code": "245",
        "code": "GW"
    },
    {
        "name": "Guyana",
        "dial_code": "595",
        "code": "GY"
    },
    {
        "name": "Haiti",
        "dial_code": "509",
        "code": "HT"
    },
    {
        "name": "Holy See (Vatican City State)",
        "dial_code": "379",
        "code": "VA"
    },
    {
        "name": "Honduras",
        "dial_code": "504",
        "code": "HN"
    },
    {
        "name": "Hong Kong",
        "dial_code": "852",
        "code": "HK"
    },
    {
        "name": "Hungary",
        "dial_code": "36",
        "code": "HU"
    },
    {
        "name": "Iceland",
        "dial_code": "354",
        "code": "IS"
    },
    {
        "name": "India",
        "dial_code": "91",
        "code": "IN"
    },
    {
        "name": "Indonesia",
        "dial_code": "62",
        "code": "ID"
    },
    {
        "name": "Iran, Islamic Republic of Persian Gulf",
        "dial_code": "98",
        "code": "IR"
    },
    {
        "name": "Iraq",
        "dial_code": "964",
        "code": "IQ"
    },
    {
        "name": "Ireland",
        "dial_code": "353",
        "code": "IE"
    },
    {
        "name": "Isle of Man",
        "dial_code": "44",
        "code": "IM"
    },
    {
        "name": "Israel",
        "dial_code": "972",
        "code": "IL"
    },
    {
        "name": "Italy",
        "dial_code": "39",
        "code": "IT"
    },
    {
        "name": "Jamaica",
        "dial_code": "1876",
        "code": "JM"
    },
    {
        "name": "Japan",
        "dial_code": "81",
        "code": "JP"
    },
    {
        "name": "Jersey",
        "dial_code": "44",
        "code": "JE"
    },
    {
        "name": "Jordan",
        "dial_code": "962",
        "code": "JO"
    },
    {
        "name": "Kazakhstan",
        "dial_code": "77",
        "code": "KZ"
    },
    {
        "name": "Kenya",
        "dial_code": "254",
        "code": "KE"
    },
    {
        "name": "Kiribati",
        "dial_code": "686",
        "code": "KI"
    },
    {
        "name": "Korea, Democratic People's Republic of Korea",
        "dial_code": "850",
        "code": "KP"
    },
    {
        "name": "Korea, Republic of South Korea",
        "dial_code": "82",
        "code": "KR"
    },
    {
        "name": "Kuwait",
        "dial_code": "965",
        "code": "KW"
    },
    {
        "name": "Kyrgyzstan",
        "dial_code": "996",
        "code": "KG"
    },
    {
        "name": "Laos",
        "dial_code": "856",
        "code": "LA"
    },
    {
        "name": "Latvia",
        "dial_code": "371",
        "code": "LV"
    },
    {
        "name": "Lebanon",
        "dial_code": "961",
        "code": "LB"
    },
    {
        "name": "Lesotho",
        "dial_code": "266",
        "code": "LS"
    },
    {
        "name": "Liberia",
        "dial_code": "231",
        "code": "LR"
    },
    {
        "name": "Libyan Arab Jamahiriya",
        "dial_code": "218",
        "code": "LY"
    },
    {
        "name": "Liechtenstein",
        "dial_code": "423",
        "code": "LI"
    },
    {
        "name": "Lithuania",
        "dial_code": "370",
        "code": "LT"
    },
    {
        "name": "Luxembourg",
        "dial_code": "352",
        "code": "LU"
    },
    {
        "name": "Macao",
        "dial_code": "853",
        "code": "MO"
    },
    {
        "name": "Macedonia",
        "dial_code": "389",
        "code": "MK"
    },
    {
        "name": "Madagascar",
        "dial_code": "261",
        "code": "MG"
    },
    {
        "name": "Malawi",
        "dial_code": "265",
        "code": "MW"
    },
    {
        "name": "Malaysia",
        "dial_code": "60",
        "code": "MY"
    },
    {
        "name": "Maldives",
        "dial_code": "960",
        "code": "MV"
    },
    {
        "name": "Mali",
        "dial_code": "223",
        "code": "ML"
    },
    {
        "name": "Malta",
        "dial_code": "356",
        "code": "MT"
    },
    {
        "name": "Marshall Islands",
        "dial_code": "692",
        "code": "MH"
    },
    {
        "name": "Martinique",
        "dial_code": "596",
        "code": "MQ"
    },
    {
        "name": "Mauritania",
        "dial_code": "222",
        "code": "MR"
    },
    {
        "name": "Mauritius",
        "dial_code": "230",
        "code": "MU"
    },
    {
        "name": "Mayotte",
        "dial_code": "262",
        "code": "YT"
    },
    {
        "name": "Mexico",
        "dial_code": "52",
        "code": "MX"
    },
    {
        "name": "Micronesia, Federated States of Micronesia",
        "dial_code": "691",
        "code": "FM"
    },
    {
        "name": "Moldova",
        "dial_code": "373",
        "code": "MD"
    },
    {
        "name": "Monaco",
        "dial_code": "377",
        "code": "MC"
    },
    {
        "name": "Mongolia",
        "dial_code": "976",
        "code": "MN"
    },
    {
        "name": "Montenegro",
        "dial_code": "382",
        "code": "ME"
    },
    {
        "name": "Montserrat",
        "dial_code": "1664",
        "code": "MS"
    },
    {
        "name": "Morocco",
        "dial_code": "212",
        "code": "MA"
    },
    {
        "name": "Mozambique",
        "dial_code": "258",
        "code": "MZ"
    },
    {
        "name": "Myanmar",
        "dial_code": "95",
        "code": "MM"
    },
    {
        "name": "Namibia",
        "dial_code": "264",
        "code": "NA"
    },
    {
        "name": "Nauru",
        "dial_code": "674",
        "code": "NR"
    },
    {
        "name": "Nepal",
        "dial_code": "977",
        "code": "NP"
    },
    {
        "name": "Netherlands",
        "dial_code": "31",
        "code": "NL"
    },
    {
        "name": "Netherlands Antilles",
        "dial_code": "599",
        "code": "AN"
    },
    {
        "name": "New Caledonia",
        "dial_code": "687",
        "code": "NC"
    },
    {
        "name": "New Zealand",
        "dial_code": "64",
        "code": "NZ"
    },
    {
        "name": "Nicaragua",
        "dial_code": "505",
        "code": "NI"
    },
    {
        "name": "Niger",
        "dial_code": "227",
        "code": "NE"
    },
    {
        "name": "Nigeria",
        "dial_code": "234",
        "code": "NG"
    },
    {
        "name": "Niue",
        "dial_code": "683",
        "code": "NU"
    },
    {
        "name": "Norfolk Island",
        "dial_code": "672",
        "code": "NF"
    },
    {
        "name": "Northern Mariana Islands",
        "dial_code": "1670",
        "code": "MP"
    },
    {
        "name": "Norway",
        "dial_code": "47",
        "code": "NO"
    },
    {
        "name": "Oman",
        "dial_code": "968",
        "code": "OM"
    },
    {
        "name": "Pakistan",
        "dial_code": "92",
        "code": "PK"
    },
    {
        "name": "Palau",
        "dial_code": "680",
        "code": "PW"
    },
    {
        "name": "Palestinian Territory, Occupied",
        "dial_code": "970",
        "code": "PS"
    },
    {
        "name": "Panama",
        "dial_code": "507",
        "code": "PA"
    },
    {
        "name": "Papua New Guinea",
        "dial_code": "675",
        "code": "PG"
    },
    {
        "name": "Paraguay",
        "dial_code": "595",
        "code": "PY"
    },
    {
        "name": "Peru",
        "dial_code": "51",
        "code": "PE"
    },
    {
        "name": "Philippines",
        "dial_code": "63",
        "code": "PH"
    },
    {
        "name": "Pitcairn",
        "dial_code": "872",
        "code": "PN"
    },
    {
        "name": "Poland",
        "dial_code": "48",
        "code": "PL"
    },
    {
        "name": "Portugal",
        "dial_code": "351",
        "code": "PT"
    },
    {
        "name": "Puerto Rico",
        "dial_code": "1939",
        "code": "PR"
    },
    {
        "name": "Qatar",
        "dial_code": "974",
        "code": "QA"
    },
    {
        "name": "Romania",
        "dial_code": "40",
        "code": "RO"
    },
    {
        "name": "Russia",
        "dial_code": "7",
        "code": "RU"
    },
    {
        "name": "Rwanda",
        "dial_code": "250",
        "code": "RW"
    },
    {
        "name": "Reunion",
        "dial_code": "262",
        "code": "RE"
    },
    {
        "name": "Saint Barthelemy",
        "dial_code": "590",
        "code": "BL"
    },
    {
        "name": "Saint Helena, Ascension and Tristan Da Cunha",
        "dial_code": "290",
        "code": "SH"
    },
    {
        "name": "Saint Kitts and Nevis",
        "dial_code": "1869",
        "code": "KN"
    },
    {
        "name": "Saint Lucia",
        "dial_code": "1758",
        "code": "LC"
    },
    {
        "name": "Saint Martin",
        "dial_code": "590",
        "code": "MF"
    },
    {
        "name": "Saint Pierre and Miquelon",
        "dial_code": "508",
        "code": "PM"
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "dial_code": "1784",
        "code": "VC"
    },
    {
        "name": "Samoa",
        "dial_code": "685",
        "code": "WS"
    },
    {
        "name": "San Marino",
        "dial_code": "378",
        "code": "SM"
    },
    {
        "name": "Sao Tome and Principe",
        "dial_code": "239",
        "code": "ST"
    },
    {
        "name": "Saudi Arabia",
        "dial_code": "966",
        "code": "SA"
    },
    {
        "name": "Senegal",
        "dial_code": "221",
        "code": "SN"
    },
    {
        "name": "Serbia",
        "dial_code": "381",
        "code": "RS"
    },
    {
        "name": "Seychelles",
        "dial_code": "248",
        "code": "SC"
    },
    {
        "name": "Sierra Leone",
        "dial_code": "232",
        "code": "SL"
    },
    {
        "name": "Singapore",
        "dial_code": "65",
        "code": "SG"
    },
    {
        "name": "Slovakia",
        "dial_code": "421",
        "code": "SK"
    },
    {
        "name": "Slovenia",
        "dial_code": "386",
        "code": "SI"
    },
    {
        "name": "Solomon Islands",
        "dial_code": "677",
        "code": "SB"
    },
    {
        "name": "Somalia",
        "dial_code": "252",
        "code": "SO"
    },
    {
        "name": "South Africa",
        "dial_code": "27",
        "code": "ZA"
    },
    {
        "name": "South Sudan",
        "dial_code": "211",
        "code": "SS"
    },
    {
        "name": "South Georgia and the South Sandwich Islands",
        "dial_code": "500",
        "code": "GS"
    },
    {
        "name": "Spain",
        "dial_code": "34",
        "code": "ES"
    },
    {
        "name": "Sri Lanka",
        "dial_code": "94",
        "code": "LK"
    },
    {
        "name": "Sudan",
        "dial_code": "249",
        "code": "SD"
    },
    {
        "name": "Suriname",
        "dial_code": "597",
        "code": "SR"
    },
    {
        "name": "Svalbard and Jan Mayen",
        "dial_code": "47",
        "code": "SJ"
    },
    {
        "name": "Swaziland",
        "dial_code": "268",
        "code": "SZ"
    },
    {
        "name": "Sweden",
        "dial_code": "46",
        "code": "SE"
    },
    {
        "name": "Switzerland",
        "dial_code": "41",
        "code": "CH"
    },
    {
        "name": "Syrian Arab Republic",
        "dial_code": "963",
        "code": "SY"
    },
    {
        "name": "Taiwan",
        "dial_code": "886",
        "code": "TW"
    },
    {
        "name": "Tajikistan",
        "dial_code": "992",
        "code": "TJ"
    },
    {
        "name": "Tanzania, United Republic of Tanzania",
        "dial_code": "255",
        "code": "TZ"
    },
    {
        "name": "Thailand",
        "dial_code": "66",
        "code": "TH"
    },
    {
        "name": "Timor-Leste",
        "dial_code": "670",
        "code": "TL"
    },
    {
        "name": "Togo",
        "dial_code": "228",
        "code": "TG"
    },
    {
        "name": "Tokelau",
        "dial_code": "690",
        "code": "TK"
    },
    {
        "name": "Tonga",
        "dial_code": "676",
        "code": "TO"
    },
    {
        "name": "Trinidad and Tobago",
        "dial_code": "1868",
        "code": "TT"
    },
    {
        "name": "Tunisia",
        "dial_code": "216",
        "code": "TN"
    },
    {
        "name": "Turkey",
        "dial_code": "90",
        "code": "TR"
    },
    {
        "name": "Turkmenistan",
        "dial_code": "993",
        "code": "TM"
    },
    {
        "name": "Turks and Caicos Islands",
        "dial_code": "1649",
        "code": "TC"
    },
    {
        "name": "Tuvalu",
        "dial_code": "688",
        "code": "TV"
    },
    {
        "name": "Uganda",
        "dial_code": "256",
        "code": "UG"
    },
    {
        "name": "Ukraine",
        "dial_code": "380",
        "code": "UA"
    },
    {
        "name": "United Arab Emirates",
        "dial_code": "971",
        "code": "AE"
    },
    {
        "name": "United Kingdom",
        "dial_code": "44",
        "code": "GB"
    },
    {
        "name": "United States",
        "dial_code": "1",
        "code": "US"
    },
    {
        "name": "Uruguay",
        "dial_code": "598",
        "code": "UY"
    },
    {
        "name": "Uzbekistan",
        "dial_code": "998",
        "code": "UZ"
    },
    {
        "name": "Vanuatu",
        "dial_code": "678",
        "code": "VU"
    },
    {
        "name": "Venezuela, Bolivarian Republic of Venezuela",
        "dial_code": "58",
        "code": "VE"
    },
    {
        "name": "Vietnam",
        "dial_code": "84",
        "code": "VN"
    },
    {
        "name": "Virgin Islands, British",
        "dial_code": "1284",
        "code": "VG"
    },
    {
        "name": "Virgin Islands, U.S.",
        "dial_code": "1340",
        "code": "VI"
    },
    {
        "name": "Wallis and Futuna",
        "dial_code": "681",
        "code": "WF"
    },
    {
        "name": "Yemen",
        "dial_code": "967",
        "code": "YE"
    },
    {
        "name": "Zambia",
        "dial_code": "260",
        "code": "ZM"
    },
    {
        "name": "Zimbabwe",
        "dial_code": "263",
        "code": "ZW"
    }
]


export const months: any = [
    {value: "1", label: "01 - January"},
    {value: "2", label: "02 - February"},
    {value: "3", label: "03 - March"},
    {value: "4", label: "04 - April"},
    {value: "5", label: "05 - May"},
    {value: "6", label: "06 - June"},
    {value: "7", label: "07 - July"},
    {value: "8", label: "08 - August"},
    {value: "9", label: "09 - September"},
    {value: "10", label: "10 - October"},
    {value: "11", label: "11 - November"},
    {value: "12", label: "12 - December"},
];

export const dateformats: any = [{"label": "dd/MM/yyyy", "value": "dd/MM/yyyy"}, {
    "label": "dd/MM/yy",
    "value": "dd/MM/yy"
}, {"label": "dd-MM-yy", "value": "dd-MM-yy"}, {"label": "dd-MM-yyyy", "value": "dd-MM-yyyy"}, {
    "label": "dd.MM.yy",
    "value": "dd.MM.yy"
}, {"label": "dd.MM.yyyy", "value": "dd.MM.yyyy"}, {"label": "MM/dd/yyyy", "value": "MM/dd/yyyy"}, {
    "label": "MM/dd/yy",
    "value": "MM/dd/yy"
}, {"label": "MM-dd-yy", "value": "MM-dd-yy"}, {"label": "MM-dd-yyyy", "value": "MM-dd-yyyy"}, {
    "label": "MM.dd.yy",
    "value": "MM.dd.yy"
}, {"label": "MM.dd.yyyy", "value": "MM.dd.yyyy"}]


export const grecaptcharesponse: any = 'g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj'

export const supportedPrinterList = [
    'Other - Generic - ESC/POS','TM-T20', 'TM-m10', 'TM-T20II', 'TM-m30', 'TM-T20III', 'TM-m30II', 'TM-T20IIIL', 'TM-m30II-H', 'TM-T20X', 'TM-m30II-S', 'TM-T60', 'TM-m30II-SL', 'TM-T70', 'TM-m30II-NT', 'TM-T70II', 'TM-m50', 'TM-T81II', 'TM-H6000V', 'TM-T81III', 'TM-L90', 'TM-T82', 'TM-L100', 'TM-T82II', 'EU-m30', 'TM-T82IIIL', 'TM-T20II-i', 'TM-T82III', 'TM-T70-i', 'TM-T82X', 'TM-T82II-i', 'TM-T83III', 'TM-T83II-i', 'TM-T88V', 'TM-T88V-i', 'TM-T88VI', 'TM-U220-i', 'TM-T88VII', 'TM-T88VI-iHUB', 'TM-T90II', 'TM-T70II-DT', 'TM-T100', 'TM-T88V-DT', 'TM-P20', 'TM-H6000IV-DT', 'TM-P20II', 'TM-T70II-DT2', 'TM-P60', 'TM-T88VI-DT2', 'TM-P60II', 'DM-D110', 'TM-P80', 'DM-D30', 'TM-P80II', 'DM-D210', 'TM-U220A/B/D', 'DM-D70', 'TM-U330'
]


export const defaultTestTemplate = `<align mode="center">                  
<text   size="1:1">{{message}}
</text>   
</align>`;


export const defaultTestTemplateHTML1 = `<div style="text-align: center" id="image-print">
 
<h4 style="text-align: center;padding:10px">{{message}}</h4>
<div style="text-align: center;font-size: 18px;padding:10px">Font Size 18px</div>
<div style="text-align: center;font-size: 16px;padding:10px">Font Size 16px</div>
  
 

</div>`;


export const defaultTestTemplateHTML = `<div style="text-align: center"  id="image-print">

<img style="width:50%" src="data:image/png;base64,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" />

<h4 style="text-align: center;padding:10px">{{message}}</h4>
<div style="text-align: center;font-size: 18px;padding:10px">Font Size 18px</div>
<div style="text-align: center;font-size: 16px;padding:10px">Font Size 16px</div>
<div style="text-align: center;font-size: 14px;padding:10px">Font Size 14px</div>
<div style="text-align: center;font-size: 12px;padding:10px">Font Size 12px</div>
<div style="text-align: center;font-size: 10px;padding:10px">Font Size 10px</div>
<div style="text-align: center;font-size: 8px;padding:10px">Font Size 8px</div>
<div style="text-align: center;font-size: 6px;padding:10px">Font Size 6px</div>

<div style="text-align: center;font-size: 12px;padding:10px">
العربية (ar)
سنڌي (sd)
Azərbaycan (az)
Български (bg)
বাংলা (bn)
Català (ca)
Česky (cs)
Deutsch (de)
Ελληνικά (el)
English (en)
Esperanto (eo)
Español (es)
فارسی (fa)
Suomi (fi)
Français (fr)
ગુજરાતી (gu)
עברית (he)
हिन्दी (hi)
Bahasa Indonesia (id)
मराठी (mr)
Italiano (it)
日本語 (ja)
한국어 (ko)
Latviešu (lv)
Lietuvių (lt)
Bahasa Melayu (ms)
Македонски (mk)
مازِرونی (mzn)
नेपाल भाषा (new)
ਪੰਜਾਬੀ (pa)
Polski (pl)
پښتو (ps)
Português (pt)
Română (ro)
Русский (ru)
Svenska (sv)
தமிழ் (ta)
ไทย (th)
Türkçe (tr)
Українська (uk)
Tiếng Việt (vi)
Yorùbá (yo)
中文 (zh)
</div>

</div>`;


export const defaultInvoiceTemplate = `<align mode="center"  id="image-print">
{{#logo}}
<image>
{{{logo}}}
</image>
{{/logo}}

        <bold>
            <text size="1:1">{{{legalname}}}
</text>
        </bold>
        <line-feed/>
        <text size="1:0">{{{locationname}}}
</text>
        <text>{{{street1}}}
</text>
        <text>{{{street2}}}
</text>
        <text>{{{city}}}-{{{pin}}}
</text>
        <text>Tel.: {{{mobile}}}
</text>
    </align>
  <line-feed/>
    <align mode="right">
    <text>{{{invoicetype}}}
</text>
        <bold>
            <text size="1:0">NO:{{terminalname}}-{{invoice_display_number}}
</text>
        </bold>
        <text>Date : {{{date}}}
</text>
    </align>
    <text>{{{city}}}
</text>
    <text>{{{state}}}
</text>{{#tablename}}
{{{line}}}
<text>Table : {{{tablename}}}
</text>{{/tablename}}
 {{{line}}}
 <text>Client : {{{clientname}}}
</text>
    {{{line}}}
    <text>{{{head}}}
</text>
    {{{line}}}
    {{#items}}
    <text>{{{.}}}
</text>
    {{/items}}
    {{{line}}}
    <text>{{{counter}}}
</text>
{{#vouchertotaldiscountamountdisplay}}
    <text>{{{discount}}}
</text>
{{/vouchertotaldiscountamountdisplay}}
    <text>{{{totaltax}}}
</text>
{{#adjustmentamount}}
    <text>{{{adjustment}}}
</text>
{{/adjustmentamount}}
{{#voucherroundoffdisplay}}
    <text>{{{roundoff}}}
</text>
{{/voucherroundoffdisplay}}
    <text size="1:1">{{{totalbig}}}
</text>
    {{{line}}}
{{#totalMRP}}
    <text>{{{totalMRP}}}
</text>
{{#totalSave}}
    <text>Your Total Saving is : {{{totalSave}}}
</text>
{{/totalSave}}
{{{line}}}
{{/totalMRP}}
    <text>{{#taxes}}{{{.}}}{{/taxes}}
</text>
{{{line}}}
{{#isListPayment}}
    {{#paymentList}}
    <text>{{{.}}}
</text>
    {{/paymentList}}
{{{line}}}
{{/isListPayment}}
 <text>{{{state}}}
</text>
    <text>{{terminalname}}
</text>
<align mode="center">
    <text>{{{toc}}}
</text>
</align>`

export  const  defaultKOTTemplate = `<align mode="center">
<bold>
<text size="2:2">{{ticketnumberprefix}}{{kotid}}
</text>
</bold> 
<text>{{{ticketdate}}} {{{tickettime}}}

</text>
</align>
{{{line}}}
<text>Staff Name : {{{staffname}}}
</text>
{{{line}}}
<text>Table : {{{table}}}
</text>
{{{line}}}
{{#commonkotnote}}<text>Note : {{{commonkotnote}}}
</text>
{{{line}}}{{/commonkotnote}}
{{#ticketitems}}
<text size="1:0">
{{productqnt}} x {{productdisplayname}}
<text size="0:0">
{{#addons}}
+ {{productqnt}} x {{productdisplayname}}
{{/addons}}
{{{predefinenotes}}}
</text>
{{#cancelled}}<bold><text>**Cancelled**
</text></bold>{{/cancelled}} 
</text>
{{/ticketitems}}
{{{line}}}`


export  const  dayendReportTemplate = `
<align mode="center">
<bold>
<text size="1:1">{{{legalname}}}
</text>
<text size="1:0">{{{locationname}}}

</text>
</bold>
<text size="1:0">Terminal : {{terminalname}}
</text>
<text>{{invoicetype}}
</text>
</align>
<line-feed/>
<text>Staff : {{{staffname}}}
</text>
{{{line}}}
<text>Date : {{{date}}}
</text>
{{{line}}}
<text>{{{head}}}
</text>
{{{line}}}
{{#isItems}}
{{#items}}
<text>{{{.}}}
</text>
{{/items}}
{{{line}}}
{{/isItems}}
{{#isSummary}}
<bold><text>Total amount by payment mode 
</text></bold>
{{#gateways}}
<text>{{{.}}}
</text>
{{/gateways}}
{{{line}}}
{{/isSummary}}
 
 
<text>{{{finaltotal}}}
</text>
{{{line}}}`


export  const  dayendReportTemplateHtml = `
<div   class="image-print"  id="image-print">

    <style>
        body .image-print,.image-print td,.image-print th{
            font-family: Arial;
            font-size: 16px;
        }
    </style>
<div style="text-align: center">
<div>
<div style="font-size: 20px">{{{legalname}}}
</div>
<div>{{{locationname}}}

</div>
</div>
<div>Terminal : {{terminalname}}
</div>
<div>{{invoicetype}}
</div>
</div>
 <div>Staff : {{{staffname}}}
</div>
<div>--------------------------------------------------</div>
<div>Date : {{{date}}}
</div>
<div>--------------------------------------------------</div>
<div>{{{head}}}
</div>
<div>--------------------------------------------------</div>
{{#isItems}}
{{#items}}
<div>{{{.}}}
</div>
{{/items}}
<div>--------------------------------------------------</div>
{{/isItems}}
{{#isSummary}}
<div><div style="font-weight: bold">Total amount by payment mode 
</div></div>
{{#gateways}}
<div>{{{.}}}
</div>
{{/gateways}}
<div>--------------------------------------------------</div>
{{/isSummary}}
 
 
<div>{{{finaltotal}}}
</div>
<div>--------------------------------------------------</div>
</div>`



export const ItemDivider = () => {
    return (
        <View
            style={{
                height: 1,
                width: "100%",
                backgroundColor: "#eee",
            }}
        />
    );
}



export enum SIZE {
    '0:1' = "20px",
    '1:0' = "20px",
    '1:1' = "20px",
    '0:2' = "26px",
    '2:0' = "26px",
    '2:2' = "26px",
    '0:3' = "32px",
    '3:0' = "32px",
    '3:3' = "32px",
    '0:4' = "38px",
    '4:0' = "38px",
    '4:4' = "38px",
    '0:5' = "44px",
    '5:0' = "44px",
    '5:5' = "44px",
    '0:6' = "50px",
    '6:0' = "50px",
    '6:6' = "50px",
    '0:7' = "56px",
    '7:0' = "56px",
    '7:7' = "56px",
}


