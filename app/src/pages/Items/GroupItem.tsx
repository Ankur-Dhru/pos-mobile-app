import React, {memo} from "react";
import {TouchableOpacity} from "react-native";
import {Divider, List} from "react-native-paper";
import {styles} from "../../theme";

import {useDispatch} from "react-redux";
import {setSelectedData} from "../../redux-store/reducer/selected-data";

const Index = (props: any) => {

    const {item, selected} = props;

    const dispatch = useDispatch()

    const selectGroup = (group: any) => {
        dispatch(setSelectedData({group: group.value}))
    }

    return <TouchableOpacity onPress={() => selectGroup(item)}
                             style={[selected ? styles.bg_accent : '', {borderRadius: 5}]}>
        <List.Item
            title={item.label}
            titleNumberOfLines={3}
            titleStyle={[styles.text_sm]}
        />
        <Divider/>
    </TouchableOpacity>
}


export default memo(Index);
