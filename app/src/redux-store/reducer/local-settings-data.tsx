import {createSlice} from '@reduxjs/toolkit'

export const localSettings = createSlice({
  name: 'localSettings',
  initialState: {},
  reducers: {
    setSettings: (state: any, action: any) => {
      return {...state, ...action.payload}
    },
  },
})

// Action creators are generated for each case reducer function
export const {setSettings} = localSettings.actions

export default localSettings.reducer
