import React, {memo, useEffect, useState} from "react";
import {appLog, arraySome, assignOption, clone, isRestaurant, removeItem} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Paragraph, Title, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {ProIcon} from "../../components";
import {connect, useDispatch} from "react-redux";
import {changeCartItem,} from "../../redux-store/reducer/cart-data";
import {setBottomSheet, setDialog, setPageSheet} from "../../redux-store/reducer/component";
import AddonActions from "./AddonActions";
import store from "../../redux-store/store";
import KeyPad from "../../components/KeyPad";
import {v4 as uuidv4} from "uuid";
import AddEditCategory from "./AddEditCategory";
import InputField from "../../components/InputField";
import {localredux} from "../../libs/static";


const Index = (props: any) => {

    const { grouplist,fieldprops }:any = props;

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
                listtype={'other'}
                addItem={<TouchableOpacity onPress={async () => {
                    store.dispatch(setPageSheet({
                        visible: true,
                        hidecancel: true,
                        width: 300,
                        component: () => <AddEditCategory callback={(value:any)=>{
                            fieldprops.input.onChange(value.itemgroupid)
                        }}   />
                    }))
                }}>
                    <Title
                        style={[styles.px_6]}><ProIcon
                        name={'plus'}/></Title></TouchableOpacity>}

                onChange={(value: any) => {
                    fieldprops.input.onChange(value);
                }}>
            </InputField>

        </>
    )
}


const mapStateToProps = (state: any) => ({
    grouplist:state.groupList
})

export default connect(mapStateToProps)(memo(Index));

