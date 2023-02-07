import React from "react";
import {TouchableOpacity, View,} from "react-native";
import {Caption, Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect} from "react-redux";
import {localredux} from "../../libs/static";
import {ProIcon} from "../../components";
import {saveLocalSettings} from "../../libs/function";

const Index = (props: any) => {

    const {itemgroup} = localredux.initData
    const {selectedgroup,gridView,setGridView} = props;

    return <View style={[styles.grid,styles.justifyContent,styles.middle,styles.bg_light,styles.p_4,styles.mb_2,{borderRadius:5}]}>
        <Caption style={[styles.caption]}>  {itemgroup[selectedgroup]?.itemgroupname}</Caption>

        <TouchableOpacity onPress={()=> {
            let view = !gridView;
            saveLocalSettings("gridview", view).then();
            setGridView(view)
        }}>
            <ProIcon name={!gridView?'grid':'list'}/>
        </TouchableOpacity>

    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
