import {createSlice} from '@reduxjs/toolkit'
import {appLog} from "../../libs/function";

export const clientsData = createSlice({
  name: 'clientsData',
  initialState: {},
  reducers: {
    setclientsData: (state: any, action) => {
      return {...action.payload}
    },
    setclient: (state: any, action) => {
      const {key, data} = action.payload;
      return {
        ...state,
         [key]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setclientsData, setclient} = clientsData.actions

export default clientsData.reducer
