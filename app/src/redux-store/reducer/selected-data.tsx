import {createSlice} from '@reduxjs/toolkit'
import {appLog} from "../../libs/function";
import { ordertypes } from '../../libs/static';

export const selectedData = createSlice({
  name: 'selectedData',
  initialState: {group:'',ordertype:ordertypes[0]},
  reducers: {
    setSelectedData: (state: any, action) => {
      return {...action.payload}
    },
    setSelected: (state: any, action) => {
      let data = action.payload;
      return {
        ...state,
        [data.field]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setSelectedData, setSelected} = selectedData.actions

export default selectedData.reducer
