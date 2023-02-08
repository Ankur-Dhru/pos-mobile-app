import {createSlice} from '@reduxjs/toolkit'

export const kotDetail = createSlice({
    name: 'kotDetail',
    initialState: {},
    reducers: {
        setKOTDetail: (state: any, action) => {
            return {...action.payload}
        },
    },
})

export const {setKOTDetail} = kotDetail.actions

export default kotDetail.reducer
