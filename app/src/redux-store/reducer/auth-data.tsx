import {createSlice} from '@reduxjs/toolkit'

export const authData = createSlice({
  name: 'authData',
  initialState: {},
  reducers: {
    setAuthData: (state: any, action) => {
      return {...state, ...action.payload}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setAuthData} = authData.actions

export default authData.reducer
