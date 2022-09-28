import {createSlice} from '@reduxjs/toolkit'

export const localSettingsData = createSlice({
  name: 'localSettingsData',
  initialState: {taxInvoice: false, currentLocation: {}, isRestaurant: false, currentTable:{}},
  reducers: {
    setTaxInvoice: (state: any, action: any) => {
      return {...state, taxInvoice: action.payload}
    },
    setCurrentLocation: (state: any, action: any) => {
      return {
        ...state,
        currentLocation: action.payload
      }
    },
    setLastSyncTime: (state: any, action: any) => {
      return {
        ...state,
        lastSynctime: action.payload
      }
    },
    setRestaurant: (state: any, action: any) => {
      return {
        ...state,
        isRestaurant: action.payload
      }
    },
    setCurrentTable: (state: any, action: any) => {
      return {
        ...state,
        currentTable: action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {setTaxInvoice, setCurrentLocation,setLastSyncTime, setRestaurant, setCurrentTable} = localSettingsData.actions

export default localSettingsData.reducer
