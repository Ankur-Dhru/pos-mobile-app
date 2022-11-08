import React, {memo} from "react";
import {TouchableOpacity} from "react-native";
import {Paragraph, Title} from "react-native-paper";
import {styles} from "../../theme";
import {ProIcon} from "../../components";
import {connect, useDispatch} from "react-redux";
import {closePage, openPage, setModal} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import {v4 as uuidv4} from "uuid";
import AddEditCategory from "./AddEditCategory";
import InputField from "../../components/InputField";
import {useNavigation} from "@react-navigation/native";
import {appLog} from "../../libs/function";
import {device} from "../../libs/static";


const Index = (props: any) => {

    const {grouplist, fieldprops,pageKey}: any = props;
    const navigation = useNavigation();
    const dispatch = useDispatch()

    let groups: any = Object.values(grouplist).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid}
    })

    return (
        <>
            <InputField
                label={'Category'}
                mode={'flat'}
                key={uuidv4()}
                list={groups}
                value={fieldprops.input.value}
                selectedValue={fieldprops.input.value}
                displaytype={'pagelist'}
                inputtype={'dropdown'}
                listtype={'staff'}
                addItem={<TouchableOpacity style={[styles.p_5]} onPress={async () => {
                    await dispatch(closePage(device.lastmodal))
                    navigation.navigate('AddEditCategory');
                }}>
                    <Paragraph><ProIcon  name={'plus'}/></Paragraph></TouchableOpacity>}

                onChange={(value: any) => {
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

