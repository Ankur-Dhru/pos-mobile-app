import React, {useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {appLog, getFloatValue, updateComponent} from "../../libs/function";
import Button from "../Button";

let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "."]

const index = (props: any) => {

    const {defaultValue, onPressCancel, onPressOK, defaultInputValues,defaultInputAmounts, customNumber, rate} = props;

    const [numPadValue, setNumPadValue] = useState<any>(defaultValue || "");
    const [selectedTab, setSelectedTab] = useState<any>("num");

    const onPressNumKey = (keyValue: string) => {
        if (numbers[9] == keyValue) {
            // Clear
            setNumPadValue("");
        } else if (keyValue == "Cancel") {
            // Cancel
            onPressCancel && onPressCancel();
        } else if (keyValue == "OK") {
            // OK
            let newQnt = numPadValue
            if (selectedTab == "amt" && Boolean(rate)) {
                newQnt = getFloatValue(numPadValue / rate, 3)
            }
            onPressOK && onPressOK(newQnt);
        } else {
            setNumPadValue((prev: any) => {
                prev = prev.toString();
                if (numbers[11] == keyValue && prev?.includes(keyValue)) {
                    return prev;
                }
                return prev + keyValue
            });
        }
    }

    const onPressDefaultNum = (keyValue: string) => {
        setNumPadValue(keyValue);
    }
    const qntRef = React.useRef<View>(null);
    const amtRef = React.useRef<View>(null);

    return <View>
        <View style={[styles.grid, styles.justifyContent,styles.mb_5]}>
            <Button style={[styles.w_auto]}  more={{color:'white'}} onPress={() => {
                setNumPadValue("")
                setSelectedTab("num")
                updateComponent(qntRef, 'display', 'flex')
                updateComponent(amtRef, 'display', 'none')

            }} secondbutton={true}>Quick Quantity</Button>
            <Button style={[styles.ml_2, styles.w_auto]} more={{backgroundColor:styles.secondary.color,color:'black'}}  onPress={() => {
                setNumPadValue("")
                setSelectedTab("amt")
                updateComponent(qntRef, 'display', 'none')
                updateComponent(amtRef, 'display', 'flex')

            }} >Quick Amount</Button>
        </View>
        <View style={[styles.border,   styles.p_4,{marginHorizontal:5}]}>
            <Text style={[{fontSize: 24}]}>{numPadValue}</Text>
        </View>

        <View ref={qntRef} style={[styles.grid, styles.justifyContent, styles.mb_4, ]}>
            {
                defaultInputValues?.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressDefaultNum(num)}
                        style={[styles.flexGrow, styles.p_5, styles.m_2, {
                            width: "30%",
                            backgroundColor: "#fafafa"
                        }]}>
                        <Paragraph style={[styles.textCenter, styles.bold]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>

        <View ref={amtRef}
              style={[styles.grid, styles.justifyContent, {display:'none'}]}>
            {
                defaultInputAmounts?.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressDefaultNum(num)}
                        style={[styles.flexGrow, styles.p_5, styles.m_2, {
                            width: "30%",
                            borderRadius:5,
                            backgroundColor: "#fafafa"
                        }]}>
                        <Paragraph style={[styles.textCenter, styles.bold]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>


        <View
              style={[styles.grid, styles.justifyContent, ]}>
            {
                numbers.map((num: string) => {
                    let okButton = Boolean(num === numbers[13])
                    return <TouchableOpacity
                        onPress={() => onPressNumKey(num)}
                        style={[styles.flexGrow, styles.p_5, styles.m_2, {
                            width: "30%",
                            borderRadius:5,
                            backgroundColor: okButton ? styles.accent.color : "#f3f3f3"
                        }]}>
                        <Paragraph style={[styles.textCenter, styles.bold, {color: okButton ? "white" : "#333"}]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>

        <View style={[styles.grid, styles.justifyContent,styles.mt_5,]}>
            <TouchableOpacity
                onPress={() => onPressNumKey("Cancel")}
                style={[styles.flexGrow, styles.p_5, styles.m_2, {
                    width: "30%",
                    borderRadius:8,
                    backgroundColor: "#f3f3f3"
                }]}>
                <Paragraph style={[styles.textCenter, styles.bold,]}>
                    Cancel
                </Paragraph>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPressNumKey("OK")}
                style={[styles.flexGrow, styles.p_5, styles.m_2, {
                    width: "30%",
                    borderRadius:8,
                    backgroundColor: styles.accent.color
                }]}>
                <Paragraph style={[styles.textCenter, styles.bold, {color: "white"}]}>
                    OK
                </Paragraph>
            </TouchableOpacity>
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({
    defaultInputValues: state.localSettings?.defaultInputValues,
    defaultInputAmounts: state.localSettings?.defaultInputAmounts
})

export default connect(mapStateToProps)(index);

