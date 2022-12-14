import React, {memo, useCallback} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";


import {connect, useDispatch} from "react-redux";

import {styles} from "../../theme";
import {Divider, List} from "react-native-paper";

import {setSelected} from "../../redux-store/reducer/selected-data";
import {ItemDivider} from "../../libs/static";


const GroupItem = (props: any) => {
    const {item, selected} = props;

    const dispatch = useDispatch()


    const selectGroup = (group: any) => {
        dispatch(setSelected({value: group.value, field: 'group'}))
    }

    return <TouchableOpacity onPress={() => selectGroup(item)}
                             style={[selected ? styles.bg_accent : '', {borderRadius: 5}]}>
        <List.Item

            title={item.label}
            titleNumberOfLines={3}
            titleStyle={[styles.text_sm, {color: selected ? 'white' : 'black'}]}
        />

    </TouchableOpacity>
}


const Index = (props: any) => {

    const {selectedgroup, grouplist, navigation} = props;

    let groups: any = Object.values(grouplist).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid}
    })

    const renderItem = useCallback(({item, index}: any) => <GroupItem selected={selectedgroup === item.value}
                                                                      item={item}/>, [selectedgroup]);


    return <View style={[styles.h_100]}>
        <FlatList
            data={groups}

            renderItem={renderItem}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            getItemLayout={(data, index) => {
                return {length: 50, offset: 50 * index, index};
            }}
            ItemSeparatorComponent={ItemDivider}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            keyExtractor={item => item.itemgroupid}
        />

        {/*<View>
            <TouchableOpacity onPress={async () => {
                navigation.navigate('AddEditCategory');
                store.dispatch(openPage({
                    visible: true,
                    hidecancel: true,
                    width: 300,
                    component: (props: any) => <AddEditCategory {...props} />
                }))
            }}>
                <Paragraph style={[styles.paragraph, styles.p_5, styles.muted, {textAlign: 'center'}]}>+ Add
                    Group</Paragraph>
            </TouchableOpacity>
        </View>*/}

    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
    grouplist: state.groupList
})

export default connect(mapStateToProps)(memo(Index));
