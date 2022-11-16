
import {connect, useDispatch} from "react-redux";
import {appLog, isEmpty} from "../../libs/function";
import React, {memo} from "react";
import {Dimensions, Keyboard, Modal as ReactNativeModal, Platform} from "react-native";
import {Surface} from "react-native-paper";
import {closePage} from "../../redux-store/reducer/component";
import {styles} from "../../theme";

import Modal from 'react-native-modal';
const deviceWidth:any = Dimensions.get('window').width;
const deviceHeight:any =
    Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : require('react-native-extra-dimensions-android').get(
            'REAL_WINDOW_HEIGHT',
        );


interface pageProps {
    visible: boolean,
    title: React.ReactNode,
    body?: React.ReactNode,
    footer?: React.ReactNode
    pageKey?: string,
    component?:any,
    isCloseButtonShown?: boolean
}

export const pageObject = ({visible, title,  body, footer, isCloseButtonShown}: pageProps) => ({
    visible,
    title,

    body,
    footer,
    isCloseButtonShown
})

const PageComponent = memo(({
                                  visible,
                                  pageKey,
                                component,

                              }: pageProps) => {

    const dispatch = useDispatch();
    const Content =  component;


/*    return <Modal
        style={{margin: 0,height:300}}
        isVisible={visible}
        hasBackdrop={true}
        onBackButtonPress={() => dispatch(closePage(pageKey))}
        onBackdropPress={() => dispatch(closePage(pageKey))}
        onSwipeComplete={() => dispatch(closePage(pageKey))}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        useNativeDriverForBackdrop={true}
        coverScreen={true}
        backdropColor={'#fff'}
        statusBarTranslucent={false}
        /!*propagateSwipe={true}
        swipeThreshold={500}
        swipeDirection={'left'}*!/
        hideModalContentWhileAnimating={true}
    >

        <Surface style={[styles.h_100]}>
            <Content pageKey={pageKey}/>
        </Surface>
    </Modal>*/

    return  <ReactNativeModal
        animationType="slide"
        presentationStyle="formSheet"
        transparent={true}
        statusBarTranslucent={false}

        visible={Boolean(visible)}
        onRequestClose={() => {
            Keyboard.dismiss();
            setTimeout(()=>{
                dispatch(closePage(pageKey))
            },100)
        }}>
        <Surface style={{height: '100%',borderRadius: 20,}}>
            {Boolean(visible) && <Content pageKey={pageKey}/>}
        </Surface>

    </ReactNativeModal>
})

const Index = (props: any) => {
    return <>
        {
            Object.keys(props?.page)
                .filter((pageKey: any) => !isEmpty(props?.page[pageKey]))
                .map((pageKey: any) => {
                    return (<PageComponent key={pageKey} {...{pageKey, ...props.page[pageKey]}} />)
                })
        }
    </>
};


const mapStateToProps = (state: any) => ({
    page: state.component.page
})

export default connect(mapStateToProps)(Index);
