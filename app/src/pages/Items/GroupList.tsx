import React, {memo, useCallback} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";


import {connect, useDispatch} from "react-redux";

import {styles} from "../../theme";
import {Divider, List} from "react-native-paper";

import {setSelected} from "../../redux-store/reducer/selected-data";
import {ItemDivider} from "../../libs/static";
import {appLog, sortByGroup} from "../../libs/function";


const GroupItem = (props: any) => {
    const {item, selected} = props;

    const dispatch = useDispatch()


    const selectGroup = (group: any) => {
        dispatch(setSelected({value: [group.value], field: 'group'}))
    }

    return <TouchableOpacity onPress={() => selectGroup(item)}
                             style={[styles.py_2, {marginBottom:2, borderRadius: 4,backgroundColor:`${selected?   'white' : item?.color}`, }]}>
        <List.Item

            title={item.label}
            titleNumberOfLines={2}
            /*left={()=>{
                return <View style={[styles.absolute,{top:'50%',marginTop:-8,left:-16,width:16,height:16,borderRadius:16,backgroundColor: selected? styles.primary.color : item?.color || '#eee'}]}></View>
            }}*/
            titleStyle={[styles.bold, styles.text_xs,{color: selected?   styles.primary.color : 'white'}]}
        />
    </TouchableOpacity>
}


const Index = (props: any) => {

    const {selectedgroup, grouplist, navigation} = props;

    let groups: any = Object.values(grouplist).sort(sortByGroup).filter((group:any)=>{
        return group.itemgroupmid === '0'
    }).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid,color:group.itemgroupcolor}
    })

    const renderItem = useCallback(({item, index}: any) => <GroupItem selected={selectedgroup === item.value}
                                                                      item={item}/>, [selectedgroup]);


    return <View style={[styles.h_100,styles.p_3]}>
        <FlatList
            data={groups}
            renderItem={renderItem}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            getItemLayout={(data, index) => {
                return {length: 50, offset: 50 * index, index};
            }}
            /*ItemSeparatorComponent={ItemDivider}*/
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
