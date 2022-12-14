import {getType} from "@reduxjs/toolkit";
import {appLog, assignOption, getDatabaseName, getLocalSettings, setAPIUrl, setDB} from "./function";
import React from "react";
import {View} from "react-native";


export const isDevelopment = process.env.NODE_ENV === "development";


export let posUrl: any = '';
export let adminUrl: any = '';

export const urls = {posUrl:'',adminUrl:''}
export const db = {name:''}


getLocalSettings('generalsettings').then((r:any) => {
    setAPIUrl(Boolean(r?.betamode))
});





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
    VOUCHER = "voucher",
    ITEM = "item",
    ITEMS = "items",
    CATEGORY = "category",
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
    DAY_END_REPORT = "dayendreport"
}


export enum VOUCHER {
    INVOICE = "b152d626-b614-4736-8572-2ebd95e24173",
    EXPENSE = "ba7f0f54-60da-4f07-b07b-8645632616ac",
    TAX_INVOICE = "372278d3-c3c9-4c5e-9890-f66cfa2cb1e4",
    RECEIPT = "be0e9672-a46e-4e91-a2bf-815530b22b43",
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
    headerHideShadow: true,
    headerLargeTitleHideShadow: true,
    headerShadowVisible:false,
    headerStyle: {
        /*shadowOpacity: 0,
        elevation: 0,*/
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

export const composeValidators = (...validators: any) => (value: any) =>
    validators.reduce((error: any, validator: any) => error || validator(value), undefined)


export const device: any = {tablet: true, db: '', token: '', global_token: '', navigation: ''}

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
    'TM-T20', 'TM-m10', 'TM-T20II', 'TM-m30', 'TM-T20III', 'TM-m30II', 'TM-T20IIIL', 'TM-m30II-H', 'TM-T20X', 'TM-m30II-S', 'TM-T60', 'TM-m30II-SL', 'TM-T70', 'TM-m30II-NT', 'TM-T70II', 'TM-m50', 'TM-T81II', 'TM-H6000V', 'TM-T81III', 'TM-L90', 'TM-T82', 'TM-L100', 'TM-T82II', 'EU-m30', 'TM-T82IIIL', 'TM-T20II-i', 'TM-T82III', 'TM-T70-i', 'TM-T82X', 'TM-T82II-i', 'TM-T83III', 'TM-T83II-i', 'TM-T88V', 'TM-T88V-i', 'TM-T88VI', 'TM-U220-i', 'TM-T88VII', 'TM-T88VI-iHUB', 'TM-T90II', 'TM-T70II-DT', 'TM-T100', 'TM-T88V-DT', 'TM-P20', 'TM-H6000IV-DT', 'TM-P20II', 'TM-T70II-DT2', 'TM-P60', 'TM-T88VI-DT2', 'TM-P60II', 'DM-D110', 'TM-P80', 'DM-D30', 'TM-P80II', 'DM-D210', 'TM-U220A/B/D', 'DM-D70', 'TM-U330'
]


export const defaultTestTemplate = `<align mode="center">                  
<text   size="1:1">{{message}}
</text>   
</align>`;


export const defaultTestTemplateHTML = `<div>
<h1>{{message}}</h1>
</div>`;


export const defaultInvoiceTemplate = `<align mode="center">
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


export const testInvoiceData = {
    "localorderid": 183,
    "invoice_display_number": 100,
    "globaltax": [
        {
            "taxid": "4e12a51f-ec51-4de4-b621-d3a259c37d0b",
            "taxname": "No-Tax",
            "taxtype": "Cess",
            "taxprice": 0,
            "taxgroupid": "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
            "taxablerate": 900,
            "taxpercentage": 0,
            "taxpricedisplay": 0,
            "taxableratedisplay": 900
        }
    ],
    "paymentby": "Cash",
    "staffname": "DHRU SUPPORT",
    "clientname": "Walkin",
    "totalItems": 3,
    "vouchertax": 0,
    "referenceid": "",
    "vouchertype": "outward",
    "invoiceitems": [
        {
            "hsn": "545",
            "key": "66167397-f388-4afe-b0fe-c6834a6ff679",
            "mrp": 0,
            "price": 900,
            "change": false,
            "taxobj": [
                {
                    "taxid": "4e12a51f-ec51-4de4-b621-d3a259c37d0b",
                    "taxname": "No-Tax",
                    "taxtype": "Cess",
                    "taxprice": 0,
                    "taxgroupid": "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
                    "taxablerate": 900,
                    "taxpercentage": 0
                }
            ],
            "newitem": false,
            "clientid": "1",
            "itemtype": "goods",
            "pricenew": 900,
            "accountid": 2,
            "productid": "1",
            "recurring": "onetime",
            "productqnt": 3,
            "pricingtype": "onetime",
            "product_qnt": 3,
            "productrate": "300",
            "pricedisplay": 900,
            "inventorytype": "fifo",
            "productamount": 900,
            "taxobjdisplay": [
                {
                    "taxid": "4e12a51f-ec51-4de4-b621-d3a259c37d0b",
                    "taxname": "No-Tax",
                    "taxtype": "Cess",
                    "taxprice": 0,
                    "taxgroupid": "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
                    "taxablerate": 900,
                    "taxpercentage": 0
                }
            ],
            "product_amount": 300,
            "productamount1": 0,
            "pricedisplaynew": 900,
            "productdiscount1": 0,
            "productqntunitid": "9c2ecc81-d201-4353-8fbc-7b9d61e0afb4",
            "producttaxamount": 0,
            "item_total_amount": 900,
            "producttaxgroupid": "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
            "product_tax_amount": 0,
            "product_tax_object": [
                {
                    "taxid": "4e12a51f-ec51-4de4-b621-d3a259c37d0b",
                    "taxname": "No-Tax",
                    "taxtype": "Cess",
                    "taxprice": 0,
                    "taxgroupid": "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
                    "taxablerate": 900,
                    "taxpercentage": 0
                }
            ],
            "productdisplayname": "Item Name",
            "productratedisplay": 300,
            "productratetaxable": 300,
            "product_total_price": 900,
            "productdiscounttype": "%",
            "isDepartmentSelected": false,
            "item_total_inclusive": 900,
            "productamountdisplay": 900,
            "producttaxableamount": 900,
            "item_total_tax_amount": 0,
            "productamountdisplay1": 0,
            "producttaxabledisplay": 900,
            "product_amount_display": 300,
            "product_taxable_amount": 300,
            "productdiscountamount1": 0,
            "productdiscountamount2": 0,
            "product_discount_amount": 0,
            "producttaxamountdisplay": 0,
            "item_amount_for_subtotal": 900,
            "item_total_amount_display": 900,
            "item_total_taxable_amount": 900,
            "product_inclusive_taxable": 300,
            "productratetaxabledisplay": 300,
            "totalTaxPercentageDisplay": 0,
            "item_total_global_discount": 0,
            "item_total_inline_discount": 0,
            "product_tax_amount_display": 0,
            "product_tax_object_display": [
                {
                    "taxid": "4e12a51f-ec51-4de4-b621-d3a259c37d0b",
                    "taxname": "No-Tax",
                    "taxtype": "Cess",
                    "taxprice": 0,
                    "taxgroupid": "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
                    "taxablerate": 900,
                    "taxpercentage": 0
                }
            ],
            "product_total_price_display": 900,
            "item_total_inclusive_display": 900,
            "productdiscountamountdisplay": 0,
            "item_total_tax_amount_display": 0,
            "product_total_discount_amount": 0,
            "productdiscountamountdisplay1": 0,
            "productdiscountamountdisplay2": 0,
            "product_global_discount_amount": 0,
            "product_taxable_amount_display": 300,
            "product_discount_amount_display": 0,
            "item_amount_for_subtotal_display": 900,
            "item_total_taxable_amount_display": 900,
            "product_inclusive_taxable_display": 300,
            "item_total_global_discount_display": 0,
            "item_total_inline_discount_display": 0,
            "product_total_discount_amount_display": 0,
            "product_global_discount_amount_display": 0
        }
    ],
    "tablename": "Table Name",
    "tableorderid": "",
    "vouchertotal": 900,
    "paymentmethod": "c02fc4ca-8d89-4c91-bd66-2dd29bc34e43",
    "placeofsupply": "IN-GJ",
    "referencetype": "",
    "selectedindex": 2,
    "voucherprofit": "",
    "vouchertypeid": "b152d626-b614-4736-8572-2ebd95e24173",
    "discountaccunt": 20,
    "voucherremarks": "",
    "vouchertaxable": 900,
    "vouchertaxtype": "inclusive",
    "adjustmentlabel": "Adjustment",
    "voucherdiscount": 0,
    "voucherroundoff": 0,
    "vouchersubtotal": 900,
    "roundoffselected": "auto",
    "selectedtemplate": 4,
    "totalUniqueItems": 1,
    "isPaymentReceived": false,
    "vouchercreatetime": "05:44:02",
    "vouchertaxdisplay": 0,
    "inclusive_subtotal": 900,
    "typeWiseTaxSummary": [
        {
            "taxtype": "Cess",
            "taxprice": 0
        }
    ],
    "currentDecimalPlace": 2,
    "vouchercurrencyrate": "1",
    "vouchertotaldisplay": 900,
    "totalwithoutroundoff": 900,
    "voucherdiscountplace": "askonplace",
    "voucherglobaldiscount": 0,
    "voucherinlinediscount": 0,
    "vouchertaxabledisplay": 900,
    "voucherdiscountdisplay": 0,
    "voucherroundoffdisplay": 0,
    "vouchersubtotaldisplay": 900,
    "canchangediscoutnaccount": true,
    "inclusive_subtotal_display": 900,
    "vouchertotaldiscountamount": 0,
    "totalwithoutroundoffdisplay": 900,
    "vouchertransitionaldiscount": true,
    "voucherglobaldiscountdisplay": 0,
    "voucherinlinediscountdisplay": 0,
    "vouchertotaldiscountamountdisplay": 0,
};


export const ItemDivider = () => {
    return (
        <View
            style={{
                height: 1,
                width: "100%",
                backgroundColor: "#efefef",
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


