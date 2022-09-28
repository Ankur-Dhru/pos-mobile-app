import {createSlice} from '@reduxjs/toolkit'
import {clone} from "../../libs/function";
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
    ordersource: 1,
}





export const cartData = createSlice({
    name: 'cartData',
    initialState: intialState,
    reducers: {
        setCartData: (state: any, action) => {
            return {...state, ...action.payload}
        },
        setCartItems: (state: any, action) => {
            return {
                ...state,
                invoiceitems: [
                    ...state.invoiceitems,
                    {...action.payload}
                ],
            }
        },
        changeCartItem: (state: any, action: any) => {
            const {itemIndex, item} = action.payload;
            state.invoiceitems[itemIndex] = {...state.invoiceitems[itemIndex], ...item};
            state.updatecart = true;
            return state
        },
        updateCartItems: (state: any, action) => {
            return {
                ...state,
                invoiceitems: action.payload,
                updatecart: true
            }
        },
        updateCartField: (state: any, action) => {
            return {
                ...state,
                ...action.payload,
                updatecart: true
            }
        },
        updateCartKots: (state: any, action) => {
            return {
                ...state,
                kots: clone(action.payload),
                updatecart: true
            }
        },
        updateCartKotField: (state: any, action) => {
            return {
                ...state,
                kots: state.kots,
                updatecart: true
            }
        },
        deleteCartItem: (state: any) => {
            const selectedindex = state?.selectedindex;
            state.invoiceitems.splice(selectedindex, 1);
            state.updatecart = true;
            if (selectedindex === state.invoiceitems.length) {
                state.selectedindex = selectedindex - 1
            }
            return state
        },
        setUpdateCart: (state: any) => {
            return {
                ...state,
                updatecart: !state.updatecart
            }
        },
        resetCart: () => {
            return clone(intialState);
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    setCartData,
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
