import React, {Component} from 'react';
import {View} from 'react-native';
import {styles} from "../../theme";

import {Container,  ProIcon} from "../../components";
import {connect} from "react-redux";
import QRCodeScanner from "../../components/QRCodeScanner"
import {Platform} from 'react-native';
import {selectItem} from "../../libs/function";
import {device} from "../../libs/static";
import CartTotal from "../Cart/CartTotal";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";


let Sound: any;
if (Platform.OS === 'android') {
    Sound = require('react-native-sound');
}


class Index extends Component<any> {


    onRead = (value?:any) =>{
        getItemsByWhere({itemname:value}).then((items:any)=>{
            if(Boolean(items.length)) {
                selectItem(items[0]).then()
            }
            else{
                store.dispatch(setAlert({visible: true, message: 'No any item found'}));
            }
        })
    }

    render() {

        return (
            <Container style={{padding:0}}>
                <>
                    <QRCodeScanner
                        onRead={this.onRead}
                    />
                </>

                {!device.tablet && <View style={[styles.p_3]}>
                    <CartTotal/>
                </View>}

            </Container>
        )
    }
}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);


