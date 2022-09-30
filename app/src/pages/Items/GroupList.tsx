import React, {useEffect, useState} from "react";
import {FlatList,   View} from "react-native";


import {connect} from "react-redux";
import GroupItem from "./GroupItem";
import {localredux} from "../../libs/static";
import {appLog, groupBy, retrieveData} from "../../libs/function";

const Index = (props: any) => {

    const {selectedgroup,groups} = props;
    const {itemgroup}: any = localredux.initData


    const renderitems = ({item}: any) => {
        return (
            <GroupItem selected={selectedgroup === item.value} item={item}/>
        );
    };


    return <View>
        <FlatList
            data={groups}
            renderItem={renderitems}
            keyboardShouldPersistTaps={'handled'}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            keyExtractor={item => item.itemgroupid}
        />
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(Index);
