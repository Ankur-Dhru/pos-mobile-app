import {createSlice} from '@reduxjs/toolkit'


export const addonsData = createSlice({
  name: 'addonsData',
  initialState: {},
  reducers: {
    setAddonsData: (state: any, action) => {
      return {...action.payload}
    },
    setAddon: (state: any, action) => {
      const {key, data} = action.payload;
      return {
        ...state,
         [key]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setAddonsData, setAddon} = addonsData.actions

export default addonsData.reducer
