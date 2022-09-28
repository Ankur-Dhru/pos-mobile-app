import {createSlice} from '@reduxjs/toolkit'
import {appLog} from "../../libs/function";

export const itemsData = createSlice({
  name: 'itemsData',
  initialState: {},
  reducers: {
    setItemsData: (state: any, action) => {
      return {...action.payload}
    },
    setItem: (state: any, action) => {
      const {key, data} = action.payload;
      return {
        ...state,
         [key]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setItemsData, setItem} = itemsData.actions

export default itemsData.reducer
