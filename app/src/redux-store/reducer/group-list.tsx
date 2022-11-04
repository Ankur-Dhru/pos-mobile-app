import {createSlice} from '@reduxjs/toolkit'
import {appLog} from "../../libs/function";

export const groupList = createSlice({
  name: 'groupList',
  initialState: {},
  reducers: {
    setGroupList: (state: any, action) => {
      return {...action.payload}
    },
    setGroup: (state: any, action) => {
      const data = action.payload;
      return {
        ...state,
         [data.itemgroupid]:data
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {setGroupList, setGroup} = groupList.actions

export default groupList.reducer
