import {getType} from "@reduxjs/toolkit";
import {assignOption} from "./function";
import {Appbar} from "react-native-paper";
import React from "react";
import Icon from "react-native-fontawesome-pro";


export const isDevelopment = process.env.NODE_ENV === "development";

const apiUrl = isDevelopment ? ".api.dhru.com" : ".api.dhru.com";
export const posUrl: any = `${apiUrl}/pos/v1/`;
export const adminUrl: any = `${apiUrl}/admin/v1/`;
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
    VOUCHER = "voucher",
    ITEM = "item",
    ITEMS = "items",
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
<img>data:image/png;base64,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</img>
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




