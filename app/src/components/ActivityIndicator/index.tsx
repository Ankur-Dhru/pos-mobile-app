import React from "react";
import {connect} from "react-redux";
import {  View,ActivityIndicator} from "react-native";
import {styles} from "../../theme";


const Index = (props:any) => {

    const {loader}:any = props;

    if(!loader){
        return <></>
    }

    return <View  style={styles.loader}>
        {<View  style={[styles.screenCenter,styles.h_100,styles.transparent]}>
            <View style={{borderRadius:50}}>
                <ActivityIndicator style={styles.m_1} color={'#016EFE'} size='large' animating={true}/>
            </View>
        </View> }
    </View>
}

const mapStateToProps = (state: any) => ({
    loader: state.component.loader
})

export default connect(mapStateToProps)(Index);
