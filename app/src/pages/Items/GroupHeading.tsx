import React from "react";
import {View,} from "react-native";
import {Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect} from "react-redux";
import {localredux} from "../../libs/static";

const Index = (props: any) => {

    const {itemgroup} = localredux.initData
    const {selectedgroup} = props;

    return <View style={[styles.p_4,styles.bg_light,{paddingLeft:15}]}>
        <Paragraph style={[styles.paragraph,styles.text_sm,styles.bold]}> Category > {itemgroup[selectedgroup]?.itemgroupname}</Paragraph>
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
