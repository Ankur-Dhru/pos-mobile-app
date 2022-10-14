import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph} from "react-native-paper"
import {arraySome, clone, isEmpty, saveLocalSettings} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import {ProIcon} from "../../components";

const Index = ({defaultInputValues}: any) => {

    const dispatch = useDispatch();
    const [inputValues, setInputValues] = useState<any>();

    useEffect(() => {

    }, [])


    const onClickAddInputValues = async () => {
        let newData = [];
        if (!isEmpty(defaultInputValues)) {
            newData = clone(defaultInputValues)
        }
        await saveLocalSettings('defaultInputValues', [...newData, inputValues]).then(() => {
            setInputValues("")
        })
    }

    const renderitem = ({item}: any) => {
        return <>
            <TouchableOpacity>
                <View style={[styles.grid, styles.middle, styles.justifyContent, styles.bg_white, {
                    width: 'auto',
                    padding: 16,
                    borderRadius: 5,
                }]}>
                    <Paragraph style={[styles.paragraph, styles.bold]}>{item}</Paragraph>
                    <TouchableOpacity onPress={async ()=>{
                        await saveLocalSettings('defaultInputValues', defaultInputValues.filter((v: any) => v !== item)).then(() => {
                        })
                    }}>
                        <Paragraph>
                            <ProIcon name={"xmark"} action_type={'text'}/>
                        </Paragraph>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <Divider/>
        </>
    }

    return <Container config={{
        title: "Default Input Values",
    }}>
        <View style={[styles.grid, styles.justifyContent, styles.p_4]}>
            <View style={[styles.flexGrow, {width: "70%", marginRight: 12}]}>
                <InputField
                    value={inputValues}
                    label={'Amount'}
                    inputtype={'textbox'}
                    keyboardType='numeric'
                    onChange={(value: any) => {
                        setInputValues(value)
                    }}
                />
            </View>
            <View style={[styles.flexGrow, {width: "20%"}]}>
                <Button onPress={onClickAddInputValues}>Add</Button>
            </View>
        </View>
        <FlatList
            data={isEmpty(defaultInputValues) ? [] : defaultInputValues}
            renderItem={renderitem}
            initialNumToRender={5}
        />
    </Container>

}


const mapStateToProps = (state: any) => ({
    defaultInputValues: state.localSettings?.defaultInputValues || {}
})

export default connect(mapStateToProps)(Index);

