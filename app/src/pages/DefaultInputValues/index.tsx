import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph, Text} from "react-native-paper"
import {clone, isEmpty, saveLocalSettings, updateComponent} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import {ProIcon} from "../../components";
import {ItemDivider} from "../../libs/static";
import ToggleButtons from "../../components/ToggleButton";

const Index = ({defaultInputValues, defaultInputAmount}: any) => {

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
            if (!isEmpty(defaultInputAmount)) {
                newData = clone(defaultInputAmount)
            }
        }
        if (Boolean(inputValues)) {
            await saveLocalSettings(isNumSelected ? 'defaultInputValues' : 'defaultInputAmount', [...newData, inputValues]).then(() => {
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
                            await saveLocalSettings('defaultInputAmount', defaultInputAmount.filter((v: any) => v !== item)).then(() => {
                            })
                        }
                    }}>
                        <Paragraph>
                            <ProIcon name={"xmark"} action_type={'text'}/>
                        </Paragraph>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        </>
    }

    const qntRef = React.useRef<View>(null);
    const amtRef = React.useRef<View>(null);

    const onButtonToggle = (value:any) => {
        if(value === 'quantity'){
            setSelectedTab("num")
        }
        else{
            setSelectedTab("amt")
        }
    };

    return <Container>

        <View style={[styles.middle]}>

            <View style={[styles.middleForm]}>

                <Card style={[styles.card]}>
                    <Card.Content  style={[styles.cardContent]}>

                        <ToggleButtons
                            width={'50%'}
                            default={'quantity'}
                            btns={[{label:'Quick Quantity',value:'quantity'},{label:'Quick Amount',value:'amount'}]}
                            onValueChange={onButtonToggle}
                        />



                <View style={[styles.grid, styles.justifyContent, styles.middle, styles.mt_5]}>
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
                    data={selectedTab === 'num' ? isEmpty(defaultInputValues) ? [] : defaultInputValues : isEmpty(defaultInputAmount) ? [] : defaultInputAmount}
                    renderItem={renderitem}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    ItemSeparatorComponent={ItemDivider}
                    initialNumToRender={5}
                />

                    </Card.Content>
                </Card>

            </View>

        </View>

    </Container>

}


const mapStateToProps = (state: any) => ({
    defaultInputValues: state.localSettings?.defaultInputValues || {},
    defaultInputAmount: state.localSettings?.defaultInputAmount || {}
})

export default connect(mapStateToProps)(Index);

