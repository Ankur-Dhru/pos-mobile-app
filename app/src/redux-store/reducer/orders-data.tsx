import {createSlice} from '@reduxjs/toolkit'


export const ordersData = createSlice({
  name: 'ordersData',
  initialState: {},
  reducers: {
    setOrdersData: (state: any, action) => {
      return {...action.payload}
    },
    setOrder: (state: any, action) => {
      let data = action.payload;
      return {
        ...state,
         [data.orderid]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setOrdersData, setOrder} = ordersData.actions

export default ordersData.reducer
