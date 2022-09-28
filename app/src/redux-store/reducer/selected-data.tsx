import {createSlice} from '@reduxjs/toolkit'
import {appLog} from "../../libs/function";

export const selectedData = createSlice({
  name: 'selectedData',
  initialState: {group:''},
  reducers: {
    setSelectedData: (state: any, action) => {
      return {...action.payload}
    },
    setSelected: (state: any, action) => {
      const {key, data} = action.payload;
      return {
        ...state,
         [key]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setSelectedData, setSelected} = selectedData.actions

export default selectedData.reducer
