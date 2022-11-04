import {createSlice} from '@reduxjs/toolkit'

export const itemListList = createSlice({
  name: 'itemListList',
  initialState: {},
  reducers: {
    setItemList: (state: any, action) => {
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
export const {setItemList, setItem} = itemListList.actions

export default itemListList.reducer
