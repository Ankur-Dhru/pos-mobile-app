import {createSlice} from '@reduxjs/toolkit'

export const itemDetail = createSlice({
    name: 'itemDetail',
    initialState: {},
    reducers: {
        setItemDetail: (state: any, action) => {
            return {...action.payload}
        },
    },
})

export const {setItemDetail} = itemDetail.actions

export default itemDetail.reducer
