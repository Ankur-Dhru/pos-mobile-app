'use strict';

import React, { Component } from 'react';

import {
    Linking, TouchableOpacity,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {Paragraph, withTheme} from "react-native-paper";
import crashlytics from "@react-native-firebase/crashlytics";


class ScanScreen extends Component<any> {

    scanner:any;
    sheetRef:any;

    constructor(props:any) {
        super(props);
        this.state = {serials:[]}
        this.sheetRef = React.createRef();
    }


    onSuccess = (e?:any) => {

        const {multiline}:any = this.props;

        if(multiline){
            const {serials}:any = this.state;
            const repeat = serials.some((serial:any)=>{
               return serial === e.data
            })
            !repeat && this.setState({serials:[...serials,e.data]})
        }
        else{
            this.props.onRead(e.data);
        }
        setTimeout(()=>{
            this?.scanner?.reactivate()
        },3000)
        Linking.openURL(e?.data).catch(err => {
                crashlytics().log('Scan  '+err);
                console.error('An error occured', err)
            }
        );
    };

    render() {
        return (
            <>
                <QRCodeScanner
                    ref={(node) => { this.scanner = node }}
                    showMarker={true}
                    markerStyle={{borderColor:'white'}}
                    cameraTimeout={10000}
                    vibrate={true}
                    onRead={this.onSuccess}
                />

            </>
        );
    }
}

export default withTheme(ScanScreen);

