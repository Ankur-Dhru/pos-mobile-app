import React, {useEffect, useState} from "react";
import {FlatList,   View,} from "react-native";
import {Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect} from "react-redux";
import GroupItem from "./GroupItem";
import {localredux} from "../../libs/static";
import {appLog, groupBy, retrieveData} from "../../libs/function";

const Index = (props: any) => {

    const {itemgroup} = localredux.initData
    const {selectedgroup} = props;

    return <View style={[styles.p_2,styles.px_5]}>
         <Paragraph>{itemgroup[selectedgroup]?.itemgroupname}</Paragraph>
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group,
})

export default connect(mapStateToProps)(Index);
