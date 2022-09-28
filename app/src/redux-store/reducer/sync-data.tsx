import {createSlice} from '@reduxjs/toolkit'

export const syncDetail = createSlice({
    name: 'syncDetail',
    initialState: {},
    reducers: {
        setSyncDetail: (state: any, action) => {
            return {...action.payload}
        },
    },
})

export const {setSyncDetail} = syncDetail.actions

export default syncDetail.reducer
