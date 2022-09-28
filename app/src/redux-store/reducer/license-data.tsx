import {createSlice} from "@reduxjs/toolkit";

export const licenseData = createSlice({
  name: "licenseData",
  initialState: {},
  reducers: {
    setLicenseData: (state: any, action: any) => ({
      ...state,
      ...action.payload
    })
  }
});

export const {setLicenseData} = licenseData.actions;

export default licenseData.reducer;
