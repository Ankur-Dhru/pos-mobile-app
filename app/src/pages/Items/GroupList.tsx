import React, {memo, useCallback} from "react";
import {FlatList,   View} from "react-native";


import {connect} from "react-redux";
import GroupItem from "./GroupItem";

const Index = (props: any) => {

    const {selectedgroup,groups} = props;

    const renderItem = useCallback(({item, index}: any) => <GroupItem selected={selectedgroup === item.value} item={item}/>, [selectedgroup]);


    return <View>
        <FlatList
            data={groups}
            renderItem={renderItem}
            keyboardShouldPersistTaps={'handled'}
            getItemLayout={(data, index) => {
                return { length: 50, offset: 50 * index, index };
            }}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            keyExtractor={item => item.itemgroupid}
        />
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
})

export default connect(mapStateToProps)(memo(Index));
