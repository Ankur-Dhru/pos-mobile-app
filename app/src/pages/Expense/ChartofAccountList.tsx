import React, {memo, useState} from "react";
import {TouchableOpacity} from "react-native";
import {Paragraph} from "react-native-paper";
import {ProIcon} from "../../components";
import {connect} from "react-redux";
import AddEditCategory from "../Items/AddEditCategory";
import InputField from "../../components/InputField";
import {appLog, sortByGroup} from "../../libs/function";
import {v4 as uuidv4} from "uuid";
import {styles} from "../../theme";
import {localredux} from "../../libs/static";

const Index = (props: any) => {

    const {fieldprops, navigation}: any = props;
    const [selected,setSelected] = useState(fieldprops.input.value)

    const {chartofaccount}: any = localredux.initData;



    const callBack = (value:any) => {
        fieldprops.input.value = value.accountid;
        chartofaccount.push(value);
        setSelected(value.accountid)
    }

    return (
        <>
            <InputField
                label={'Expense Account'}
                mode={'flat'}
                key={uuidv4()}
                list={chartofaccount?.filter((account:any)=>{
                    return account.accounttype === 'expense'
                }).map((account:any)=>{
                    return {label:account.accountname,value:account.accountid,more:account}
                })}
                value={selected}
                selectedValue={selected}
                displaytype={'pagelist'}
                inputtype={'dropdown'}
                listtype={'other'}
                addItem={<TouchableOpacity onPress={async () => {
                    navigation.navigate('AddEditAccount',{callback: callBack });
                }}
                >
                    <Paragraph style={[styles.paragraph,{marginTop:10}]}><ProIcon name={'plus'} /></Paragraph></TouchableOpacity>}

                onChange={(value: any) => {
                    setSelected(value)
                    appLog('value',value)
                    fieldprops.input.onChange(value);
                }}>
            </InputField>

        </>
    )
}


const mapStateToProps = (state: any) => ({

})

export default connect(mapStateToProps)(memo(Index));

