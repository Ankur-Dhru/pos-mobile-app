import * as React from 'react';
import {Platform, SafeAreaView, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {ScrollView} from "react-native-gesture-handler";
import {styles} from "../../theme";


export default class KeyboardScroll extends React.Component<any> {

    render() {
        const {children, scrollRef, scrollEnabled, onScroll}: any = this.props;
        return (
        <ScrollView contentInsetAdjustmentBehavior="automatic"  keyboardDismissMode={'on-drag'} scrollEnabled={true} >
            <View>{children}</View>
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
