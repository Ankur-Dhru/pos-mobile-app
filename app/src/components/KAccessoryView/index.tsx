import * as React from 'react';
import {KeyboardAccessoryView} from "react-native-keyboard-accessory";
import {View} from "react-native";
import {styles} from "../../theme";

export default class Index extends React.Component<any> {

    render(){
        const {children}:any = this.props;
        return (
            <KeyboardAccessoryView alwaysVisible={true}  style={{backgroundColor:'transparent'}}  hideBorder={true} avoidKeyboard={true} androidAdjustResize={true} heightProperty={"minHeight"} >
                <View style={[styles.middle,styles.w_100]}>
                    {children}
                </View>
            </KeyboardAccessoryView>
        );
    }
}
