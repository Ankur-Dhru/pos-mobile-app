import React from "react";


import {ActivityIndicator, View} from "react-native";
import {styles} from "../../theme";
import {Text} from "react-native-paper";
import {connect} from "react-redux";
import {appLog} from "../../libs/function";


const Index = ({syncDetail}: any) => {

    const {type,rows,total}:any = syncDetail;


    return <View style={[styles.p_3]}>
        <View style={[styles.mb_5]}><ActivityIndicator/></View>
        <Text style={[styles.textCenter,styles.mb_2]}>Please wait</Text>
        <Text style={[styles.textCenter,styles.mb_2,styles.muted,]}>It may take upto 15 min...</Text>

        {Boolean(type) &&  <Text style={[styles.textCenter,styles.text_xs,styles.muted,]}>{rows?rows+' - ':''} {type} synced</Text>}


        {/*{type === 'item' && <View style={[styles.bg_light,styles.mt_5,{borderRadius:5}]}>
            <View style={[{backgroundColor:styles.accent.color,borderRadius:5,height:5,width:`${(rows*100)/total}%`}]}></View>
        </View>}*/}

    </View>
}

const mapStateToProps = (state: any) => {
    return {
        syncDetail: state.syncDetail,
    }
}

export default connect(mapStateToProps)(Index);

