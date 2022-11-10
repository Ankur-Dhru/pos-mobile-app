import React, {memo} from "react";
import {TouchableOpacity, View} from "react-native";


import {connect, useDispatch} from "react-redux";

import {styles} from "../../theme";
import {Divider, List, Paragraph} from "react-native-paper";

import {setSelected} from "../../redux-store/reducer/selected-data";
import InputField from "../../components/InputField";
import {ProIcon} from "../../components";


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
        <Divider/>
    </TouchableOpacity>
}


const Index = (props: any) => {

    const {selectedgroup, grouplist} = props;
    const dispatch = useDispatch()

    let groups: any = Object.values(grouplist).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid}
    })


    return <View style={[{marginTop: -55}]}>
        <InputField
            removeSpace={true}
            label={'Category'}
            divider={true}
            displaytype={'pagelist'}
            inputtype={'dropdown'}
            render={() => <View style={[styles.grid, styles.center, styles.mb_5]}>
                <View
                    style={[styles.badge, styles.px_5, styles.py_5, styles.grid, styles.noWrap, styles.middle, {
                        backgroundColor: '#000',
                        borderRadius: 30,
                        paddingLeft: 20,
                        paddingRight: 20
                    }]}>
                    <Paragraph><ProIcon name={'bars-staggered'} type={"solid"} color={'white'} size={'18'}
                                        action_type={'text'}/> </Paragraph>
                    <Paragraph style={[styles.paragraph, styles.bold, {color: 'white'}]}> Categories</Paragraph>
                </View>
            </View>}

            list={groups}
            search={false}
            listtype={'other'}
            selectedValue={''}
            onChange={(value: any) => {
                dispatch(setSelected({value: value, field: 'group'}))
            }}
        />
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
    grouplist: state.groupList
})

export default connect(mapStateToProps)(memo(Index));
