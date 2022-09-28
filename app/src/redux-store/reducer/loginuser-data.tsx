import {createSlice} from '@reduxjs/toolkit'

export const loginuserData = createSlice({
  name: 'loginuserData',
  initialState: {},
  reducers: {
    setLoginuserData: (state: any, action) => {
      return {...state, ...action.payload}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setLoginuserData} = loginuserData.actions

export default loginuserData.reducer
