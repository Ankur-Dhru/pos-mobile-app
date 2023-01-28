import React, {memo, useState} from "react";
import {TouchableOpacity} from "react-native";
import {Paragraph} from "react-native-paper";
import {ProIcon} from "../../components";
import {connect} from "react-redux";
import AddEditCategory from "./AddEditCategory";
import InputField from "../../components/InputField";
import {appLog, sortByGroup} from "../../libs/function";
import {v4 as uuidv4} from "uuid";
import {styles} from "../../theme";

const Index = (props: any) => {

    const {grouplist, fieldprops, navigation}: any = props;
    const [selected,setSelected] = useState(fieldprops.input.value)

    let groups: any = Object.values(grouplist).sort(sortByGroup).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid}
    })

    const callBack = (value:any) => {
        fieldprops.input.value = value.itemgroupid
        setSelected(value.itemgroupid)
    }

    return (
        <>
            <InputField
                label={'Category'}
                mode={'flat'}
                key={uuidv4()}
                list={groups}
                value={selected}
                selectedValue={selected}
                displaytype={'pagelist'}
                inputtype={'dropdown'}
                listtype={'other'}
                addItem={<TouchableOpacity onPress={async () => {
                    navigation.navigate('AddEditCategory',{callback: callBack });
                }}>
                    <Paragraph style={[styles.paragraph,{marginTop:10}]}><ProIcon name={'plus'} /></Paragraph></TouchableOpacity>}

                onChange={(value: any) => {
                    setSelected(value)
                    fieldprops.input.onChange(value);
                }}>
            </InputField>

        </>
    )
}


const mapStateToProps = (state: any) => ({
    grouplist: state.groupList,
    selectedgroup: state.selectedData.group?.value
})

export default connect(mapStateToProps)(memo(Index));

