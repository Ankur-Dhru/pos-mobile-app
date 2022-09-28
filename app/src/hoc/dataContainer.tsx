import React, {Component} from "react";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";

const dataContainer = (WrapComponent: any) => {
  const DataHoc = (props: any) => <WrapComponent {...props} />
  const mapStateToProps = (state: any) => ({
    authData: state?.authData,
    initData: state?.initData,
    staffData: state?.staffData,
    licenseData: state?.licenseData,
    currentLocation: state?.localSettingsData?.currentLocation,
    isRestaurant: state?.localSettingsData?.isRestaurant,
    lastSynctime:state?.localSettingsData?.lastSynctime
  });
  const mapDispatchToProps = () => ({})
  return connect(mapStateToProps, mapDispatchToProps)(withTheme(DataHoc));
}


export default dataContainer;

