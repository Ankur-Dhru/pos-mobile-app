import {createSlice} from '@reduxjs/toolkit'
import {appLog} from "../../libs/function";

export const tableOrdersData = createSlice({
  name: 'tableOrdersData',
  initialState: {},
  reducers: {
    setTableOrdersData: (state: any, action) => {
      return {...action.payload}
    },
    setTableOrders: (state: any, action) => {
      let data = action.payload;
      return {
        ...state,
        [data.tableorderid]:data
      }
    },
    deleteOrder: (state: any, action) => {
      let data = action.payload;
      delete state[data];
      return state
    },
  },
})

// Action creators are generated for each case reducer function
export const {setTableOrdersData, setTableOrders,deleteOrder} = tableOrdersData.actions

export default tableOrdersData.reducer
