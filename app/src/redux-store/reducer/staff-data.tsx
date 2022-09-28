import {createSlice} from '@reduxjs/toolkit'

export const staffData = createSlice({
  name: 'staffData',
  initialState: {},
  reducers: {
    setStaffData: (state: any, action) => {
      return {...state, ...action.payload}
    },
    clearStaff: ()=>{
      return {}
    }
  },
})

// Action creators are generated for each case reducer function
export const {setStaffData, clearStaff} = staffData.actions

export default staffData.reducer
