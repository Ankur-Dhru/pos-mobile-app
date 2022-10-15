import {createSlice} from '@reduxjs/toolkit'
import {appLog, clone, isEmpty, voucherTotal} from "../../libs/function";
import {current, defaultclient} from "../../libs/static";
import {v4 as uuid} from "uuid";

/**
 *  PENDING SET DATA
 *        voucherprint-D,
 *        locationid-D,
 *        stafftid -D,
 *        vouchertaxtype-D
 *        date,
 *     duedate,
 *     roundoffselected-D
 *          voucherdiscountplace-D,
 *          vouchertransitionaldiscount -D,
 *          canchangediscoutnaccount  -D,
 *          discountaccunt-D,
 *          defaultdays,
 *          sendmail-D
 */



let intialState: any = {
    updatecart: false,
    globaltax: [],
    clientid: defaultclient.clientid,
    clientname: defaultclient.clientname,
    adjustmentlabel: "Adjustment",
    voucherprofit: "",
    referencetype: "",
    referenceid: "",
    deliverydate: "",
    deliverytime: "",
    companyid: 1,
    departmentid: "2",
    vouchertaxtype: "inclusive",
    vouchercurrencyrate: 1,
    payment: [],
    voucherremarks: "",
    vouchernotes: "",
    currency: "",
    invoiceitems: [],
    roundoffselected: "disable",
    discounttype: "%",
    isPaymentReceived: false,
    selectedindex: [],
    kots: [],
    ordersource: "POS",
    vouchersubtotaldisplay:0,
    vouchertotaldisplay:0,
    globaldiscountvalue:0,
    adjustmentamount:0,
    voucherroundoffdisplay:0
}


export const cartData = createSlice({
    name: 'cartData',
    initialState: intialState,
    reducers: {
        setCartData: (state: any, action) => {
            appLog('setCartData')
            return {...state, ...action.payload}
        },
        refreshCartData: (state: any, action) => {
            appLog('refreshCartData')
            return {...intialState, ...action.payload}
        },
        setCartItems: (state: any, action) => {
            appLog('setCartItems')
            let invoiceitems = [
                ...state?.invoiceitems,
                action.payload
            ];
            return {
                ...state,
                invoiceitems,
                vouchertotaldisplay: voucherTotal(invoiceitems),
            }
        },

        changeCartItem: (state: any, action: any) => {
            appLog('changeCartItem')
            const {itemIndex, item} = action.payload;
            state.invoiceitems[itemIndex] = clone({...state.invoiceitems[itemIndex], ...item});
            state.vouchertotaldisplay = voucherTotal(state.invoiceitems),
                state.updatecart = true;
            return state
        },
        updateCartItems: (state: any, action) => {
            appLog('updateCartItems')
            return {
                ...state,
                invoiceitems: action.payload,
                vouchertotaldisplay: voucherTotal(action.payload),
                updatecart: true
            }
        },
        updateCartField: (state: any, action) => {
            appLog('updateCartField')
            return {
                ...state,
                ...action.payload,
                updatecart: true
            }
        },
        updateCartKots: (state: any, action) => {
            appLog('updateCartKots')
            return {
                ...state,
                kots: clone(action.payload),
                updatecart: true
            }
        },
        updateCartKotField: (state: any, action) => {
            appLog('updateCartKotField')
            return {
                ...state,
                kots: state.kots,
                updatecart: true
            }
        },
        deleteCartItem: (state: any) => {
            appLog('deleteCartItem')
            const selectedindex = state?.selectedindex;
            state.invoiceitems.splice(selectedindex, 1);
            state.updatecart = true;
            if (selectedindex === state.invoiceitems.length) {
                state.selectedindex = selectedindex - 1
            }
            return state
        },
        setUpdateCart: (state: any) => {
            appLog('setUpdateCart')
            return {
                ...state,
                updatecart: !state.updatecart
            }
        },
        resetCart: () => {
            appLog('reset cart')
            return clone(intialState);
        }
    },
});


// Action creators are generated for each case reducer function
export const {
    setCartData,
    refreshCartData,
    setCartItems,
    setUpdateCart,
    updateCartItems,
    updateCartKots,
    updateCartField,
    deleteCartItem,
    resetCart,
    changeCartItem
} = cartData.actions

export default cartData.reducer
