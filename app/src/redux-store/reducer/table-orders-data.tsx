import {createSlice} from '@reduxjs/toolkit'

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
  },
})

// Action creators are generated for each case reducer function
export const {setTableOrdersData, setTableOrders} = tableOrdersData.actions

export default tableOrdersData.reducer
