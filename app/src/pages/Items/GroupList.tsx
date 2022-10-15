import React, {memo, useCallback} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";


import {connect, useDispatch} from "react-redux";

import {styles} from "../../theme";
import {Divider, List} from "react-native-paper";

import {setSelected} from "../../redux-store/reducer/selected-data";


const GroupItem = (props:any) => {
    const {item, selected} = props;

    const dispatch = useDispatch()

    const selectGroup = (group: any) => {
        dispatch(setSelected({value:group.value,field:'group'}))
    }

    return <TouchableOpacity onPress={() => selectGroup(item)}
                             style={[selected ? styles.bg_accent : '', {borderRadius: 5}]}>
        <List.Item
            title={item.label}
            titleNumberOfLines={3}
            titleStyle={[styles.text_sm,{color:selected?'white':'black'}]}
        />
        <Divider/>
    </TouchableOpacity>
}


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
