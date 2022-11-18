import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, Text} from "react-native-paper"
import {clone, isEmpty, saveLocalSettings} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import {ProIcon} from "../../components";

const Index = ({defaultInputValues, defaultInputAmounts}: any) => {

    const dispatch = useDispatch();
    const [inputValues, setInputValues] = useState<any>();
    const [selectedTab, setSelectedTab] = useState<any>("num");

    useEffect(() => {

    }, [])


    const onClickAddInputValues = async () => {
        let newData = [];
        let isNumSelected = (selectedTab === 'num');
        if (isNumSelected) {
            if (!isEmpty(defaultInputValues)) {
                newData = clone(defaultInputValues)
            }
        } else {
            if (!isEmpty(defaultInputAmounts)) {
                newData = clone(defaultInputAmounts)
            }
        }
        if (Boolean(inputValues)) {
            await saveLocalSettings(isNumSelected ? 'defaultInputValues' : 'defaultInputAmounts', [...newData, inputValues]).then(() => {
                setInputValues("")
            })
        }
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
                    <TouchableOpacity onPress={async () => {
                        if (selectedTab === 'num') {
                            await saveLocalSettings('defaultInputValues', defaultInputValues.filter((v: any) => v !== item)).then(() => {
                            })
                        } else {
                            await saveLocalSettings('defaultInputAmounts', defaultInputAmounts.filter((v: any) => v !== item)).then(() => {
                            })
                        }
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

    const qntRef = React.useRef<View>(null);
    const amtRef = React.useRef<View>(null);

    return <Container>

        <View style={[styles.middle]}>

            <View style={[styles.middleForm,styles.px_6]}>
                <View>
                    <View style={[styles.grid, styles.justifyContent,styles.mt_5]}>
                        <Button more={{color:'white'}}  style={[styles.w_auto]}  onPress={() => {
                            setSelectedTab("num")


                        }} secondbutton={true}>Quick Quantity</Button>
                        <Button style={[styles.ml_2, styles.w_auto]} more={{color:'white'}}  onPress={() => {
                            setSelectedTab("amt")


                        }} secondbutton={true}>Quick Amount</Button>
                    </View>
                </View>

                <View style={[styles.grid, styles.justifyContent, styles.middle, styles.px_5]}>
                    <View style={[styles.w_auto]}>
                        <InputField
                            value={inputValues}
                            label={selectedTab === 'num' ? 'Quantity' : 'Amount'}
                            inputtype={'textbox'}
                            keyboardType='numeric'
                            onChange={(value: any) => {
                                setInputValues(value)
                            }}
                        />
                    </View>
                    <View style={[styles.ml_2]}>
                        <Button more={{color:'white'}}  onPress={onClickAddInputValues}>Add</Button>
                    </View>
                </View>

                <FlatList
                    data={selectedTab === 'num' ? isEmpty(defaultInputValues) ? [] : defaultInputValues : isEmpty(defaultInputAmounts) ? [] : defaultInputAmounts}
                    renderItem={renderitem}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    initialNumToRender={5}
                />

            </View>

        </View>

    </Container>

}


const mapStateToProps = (state: any) => ({
    defaultInputValues: state.localSettings?.defaultInputValues || {},
    defaultInputAmounts: state.localSettings?.defaultInputAmounts || {}
})

export default connect(mapStateToProps)(Index);

