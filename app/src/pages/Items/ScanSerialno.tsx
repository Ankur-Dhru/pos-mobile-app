import React, {Component, useState} from 'react';

import {Container} from "../../components";
import {connect} from "react-redux";
import QRCodeScanner from "../../components/QRCodeScanner"
import {Platform, View} from 'react-native';
import {ACTIONS, device, localredux, METHOD, STATUS, urls} from "../../libs/static";
import CartTotal from "../Cart/CartTotal";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";
import apiService from "../../libs/api-service";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import {findObject, isEmpty, nextFocus, prelog, selectItem} from "../../libs/function";
import InputBox from "../../components/InputBox";
import {styles} from "../../theme";


let Sound: any;
if (Platform.OS === 'android') {
    Sound = require('react-native-sound');
}


export const   onRead = (value?: any) => {

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    store.dispatch(setAlert({visible: true, message: value}));
    const invoiceitems = store.getState().cartData.invoiceitems;
    const found = findObject(invoiceitems,'serialno',value,true);

    if(isEmpty(found)) {
        apiService({
            method: METHOD.GET,
            action: ACTIONS.SEARCH,
            queryString: {serialno: value},
            workspace: workspace,
            token: token,
            other: {url: urls.posUrl},
        }).then(async (result) => {
            if (result.status === STATUS.SUCCESS) {
                const {productid} = result.data.data;
                await getItemsByWhere({itemid: productid, start: 0}).then((items) => {
                    if (Boolean(items.length)) {
                        selectItem({...items[0], ...result.data.data, serialno: value}).then();
                        store.dispatch(setAlert({visible: true, message: 'Item Added'}));
                    }
                });
            } else {
                store.dispatch(setAlert({visible: true, message: 'No any item found'}));
            }
        });
    }
    else{
        store.dispatch(setAlert({visible: true, message: 'Already Serial no. added'}));
    }
}

const Index = (props: any) => {

    const [value,setValue] = useState()

    return (<Container style={{padding: 0}}>

            <View style={[styles.p_5,styles.absolute,{backgroundColor:'white',zIndex:999,width:'100%'}]}>
                <InputBox
                    defaultValue={value}
                    label={'Serial No.'}
                    autoFocus={false}
                    keyboardType={'numeric'}
                    onSubmitEditing={()=> {
                        onRead(value)
                    }}
                    onChange={(value: any) => {
                        setValue(value)
                    }}
                />
            </View>

            <>
                <QRCodeScanner
                    onRead={onRead}
                    containerStyle={{height:200}}
                />
            </>

            {!device.tablet && <CartTotal/>}

        </Container>)
}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);


