import React from "react";
import {View,} from "react-native";
import {Caption, Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect} from "react-redux";
import {localredux} from "../../libs/static";

const Index = (props: any) => {

    const {itemgroup} = localredux.initData
    const {selectedgroup} = props;

    return <View>
        <Caption style={[]}>  {itemgroup[selectedgroup]?.itemgroupname}</Caption>
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
