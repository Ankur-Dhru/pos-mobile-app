import React, {memo} from "react";
import {TouchableOpacity} from "react-native";
import {Divider, List} from "react-native-paper";
import {styles} from "../../theme";

import {useDispatch} from "react-redux";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {appLog} from "../../libs/function";

const Index = memo((props: any) => {

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
})


export default Index;
