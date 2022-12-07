import * as React from 'react';
import {Keyboard, Platform, SafeAreaView, TouchableWithoutFeedback, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {ScrollView} from "react-native-gesture-handler";
import {styles} from "../../theme";


export default class KeyboardScroll extends React.Component<any> {

    render() {
        const {children, scrollRef, scrollEnabled, onScroll}: any = this.props;
        return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" /*  keyboardDismissMode={'on-drag'}*/ scrollEnabled={true} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>{children}</View>
            </TouchableWithoutFeedback>
        </ScrollView>
        );
    }
}

/*
<ScrollView>
    <KeyboardAwareScrollView  ref={scrollRef} scrollsToTop={true} onScroll={onScroll}>
        <View>{children}</View>
    </KeyboardAwareScrollView>
</ScrollView>*/
