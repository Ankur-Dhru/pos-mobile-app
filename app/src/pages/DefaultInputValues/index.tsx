import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, Text} from "react-native-paper"
import {arraySome, clone, isEmpty, saveLocalSettings, updateComponent} from "../../libs/function";
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

    return <Container config={{
        title: "Quick Quantity & Amount",
    }}>

        <View style={[styles.middle,styles.h_100]}>

            <View style={[styles.middleForm]}>
        <View>
            <View style={[styles.grid, styles.justifyContent, styles.p_4]}>
                <Button style={[styles.w_auto]} compact={true} onPress={() => {
                    setSelectedTab("num")


                }} secondbutton={true}><Text style={{color: 'black'}}>Quick Quantity</Text></Button>
                <Button style={[styles.ml_2, styles.w_auto]} compact={true} onPress={() => {
                    setSelectedTab("amt")


                }} secondbutton={true}><Text style={{color: 'black'}}>Quick Amount</Text></Button>
            </View>
        </View>

        <View style={[styles.grid,styles.justifyContent,styles.middle,styles.px_5]}>
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
                <Button onPress={onClickAddInputValues}>Add</Button>
            </View>
        </View>

        <FlatList
            data={selectedTab === 'num' ? isEmpty(defaultInputValues) ? [] : defaultInputValues : isEmpty(defaultInputAmounts) ? [] : defaultInputAmounts}
            renderItem={renderitem}
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

