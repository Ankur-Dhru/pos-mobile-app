import {configureStore} from "@reduxjs/toolkit";
import authData from "./reducer/auth-data";
import initData from "./reducer/init-data";
import licenseData from "./reducer/license-data";
import staffData from "./reducer/staff-data";
import loginuserData from "./reducer/loginuser-data";
import cartData from "./reducer/cart-data";
import itemsData from "./reducer/items-data";
import ordersData from "./reducer/orders-data";
import component from "./reducer/component";
import onHoldCartData from "./reducer/onhold-cart-data";
import selectedData from "./reducer/selected-data";
import localSettingsData from "./reducer/local-settings-data";
import clientsData from "./reducer/clients-data";
import addonsData from "./reducer/addons-data";
import itemDetail from "./reducer/item-detail";
import tableOrdersData from "./reducer/table-orders-data";
import syncDetail from "./reducer/sync-data";


export default configureStore({
  reducer: {
    authData,
    initData,
    licenseData,
    staffData,
    loginuserData,
    cartData,
    itemsData,
    ordersData,
    itemDetail,
    addonsData,
    clientsData,
    tableOrdersData,
    syncDetail,
    component,
    onHoldCartData,
    localSettingsData,
    selectedData
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck:false
  })
})
