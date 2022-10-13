import React from "react";
import {View,} from "react-native";
import {Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect} from "react-redux";
import {localredux} from "../../libs/static";

const Index = (props: any) => {

    const {itemgroup} = localredux.initData
    const {selectedgroup} = props;

    return <View style={[styles.p_2,styles.ml_1]}>
        <Paragraph> {itemgroup[selectedgroup]?.itemgroupname}</Paragraph>
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
