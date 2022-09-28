import React from "react";


import {ActivityIndicator, View} from "react-native";
import {styles} from "../../theme";
import {Text} from "react-native-paper";
import {connect} from "react-redux";


const Index = ({syncDetail}: any) => {

    const {type}:any = syncDetail;

    return <View style={[styles.p_5]}>
        <View style={[styles.mb_5]}><ActivityIndicator/></View>
        <Text style={[styles.textCenter,styles.mb_2]}>Please Wait</Text>
        <Text style={[styles.textCenter,styles.muted,]}>{type} syncing....</Text>
    </View>
}

const mapStateToProps = (state: any) => {
    return {
        syncDetail: state.syncDetail,
    }
}

export default connect(mapStateToProps)(Index);

