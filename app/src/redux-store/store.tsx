import {configureStore} from "@reduxjs/toolkit";
import cartData from "./reducer/cart-data";
import component from "./reducer/component";
import selectedData from "./reducer/selected-data";
import localSettings from "./reducer/local-settings-data";
import itemDetail from "./reducer/item-detail";
import tableOrdersData from "./reducer/table-orders-data";
import syncDetail from "./reducer/sync-data";
import ordersData from "./reducer/orders-data";


export default configureStore({
    reducer: {
        cartData,
        itemDetail,
        tableOrdersData,
        syncDetail,
        component,
        selectedData,
        localSettings,
        ordersData
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
