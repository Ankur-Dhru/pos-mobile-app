import {createSlice} from '@reduxjs/toolkit'
//import { v4 as uuid4 } from 'uuid'


const intialState: any = {}


export const onHoldCartData = createSlice({
  name: 'onHoldCartData',
  initialState: intialState,
  reducers: {
    setOnHold: (state: any, action) => {
      state = action.payload
      return state
    },
    removeOnHoldCart: (state: any, action) => {
      delete state[action.payload]
      return state
    },
  },
})

// Action creators are generated for each case reducer function
export const {setOnHold, removeOnHoldCart} = onHoldCartData.actions

export default onHoldCartData.reducer
