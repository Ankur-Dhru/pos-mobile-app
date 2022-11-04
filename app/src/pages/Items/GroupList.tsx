import React, {memo, useCallback, useEffect, useState} from "react";
import {FlatList, RefreshControl, TouchableOpacity, View} from "react-native";


import {connect, useDispatch} from "react-redux";

import {styles} from "../../theme";
import {Divider, List, Paragraph} from "react-native-paper";

import {setSelected} from "../../redux-store/reducer/selected-data";
import {localredux} from "../../libs/static";
import {appLog} from "../../libs/function";
import store from "../../redux-store/store";
import {setModal, setPageSheet} from "../../redux-store/reducer/component";
import AddEditCategory from "./AddEditCategory";


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

    const {selectedgroup,grouplist} = props;

    let groups: any = Object.values(grouplist).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid}
    })

   // const [refreshing,setRefreshing]:any = useState(false);


    const renderItem = useCallback(({item, index}: any) => <GroupItem selected={selectedgroup === item.value} item={item}/>, [selectedgroup]);



    return <View style={[styles.h_100]}>
        <FlatList
            data={groups}
            renderItem={renderItem}
            keyboardShouldPersistTaps={'handled'}
            getItemLayout={(data, index) => {
                return { length: 50, offset: 50 * index, index };
            }}
            /*refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true)
                        setTimeout(()=>{
                            setRefreshing(false)
                        },1000)
                    }}
                />
            }*/
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            keyExtractor={item => item.itemgroupid}
        />

        <View>
            <TouchableOpacity onPress={async () => {
                store.dispatch(setPageSheet({
                    visible: true,
                    hidecancel: true,
                    width: 300,
                    component: () => <AddEditCategory  />
                }))
            }}>
                <Paragraph  style={[styles.paragraph, styles.p_5, styles.muted, {textAlign: 'center'}]}>+ Add Group</Paragraph>
            </TouchableOpacity>
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
    grouplist:state.groupList
})

export default connect(mapStateToProps)(memo(Index));
