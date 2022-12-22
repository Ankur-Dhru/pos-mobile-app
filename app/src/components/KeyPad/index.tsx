import React, {useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Paragraph, Text, ToggleButton} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {appLog, getFloatValue, updateComponent} from "../../libs/function";
import Button from "../Button";
import ToggleButtons from "../ToggleButton";
import ProIcon from "../ProIcon";


let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "."]

const index = (props: any) => {

    appLog('props',props)

    const {defaultValue, onPressCancel, onPressOK, defaultInputValues,defaultInputAmounts, customNumber, rate,defaultTab,unitname} = props;

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

    const onButtonToggle = (value:any) => {
        setNumPadValue("")
        if(value === 'quantity'){
            setSelectedTab("num")
            updateComponent(qntRef, 'display', 'flex')
            updateComponent(amtRef, 'display', 'none')
        }
        else{
            setSelectedTab("amt")
            updateComponent(qntRef, 'display', 'none')
            updateComponent(amtRef, 'display', 'flex')
        }
    };


    return <View>



        <ToggleButtons
            width={'50%'}
            default={defaultTab || 'amount'}
            btns={[{label:'Quick Quantity',value:'quantity'},{label:'Quick Amount',value:'amount'}]}
            onValueChange={onButtonToggle}
        />


        <View style={[styles.grid,styles.middle,styles.border,styles.mt_5,styles.mb_3,styles.p_4,{marginHorizontal:5,borderRadius:5,borderColor:styles.accent.color}]}>
            <Text><ProIcon name={selectedTab==='num'?'scale-balanced':'indian-rupee-sign'}/></Text>
            <Text style={[{fontSize: 24}]}> {numPadValue}</Text>
            {selectedTab ==='num' && <Text style={[{fontSize: 24,marginLeft:'auto'}]}> {unitname}</Text>}
        </View>

        <View ref={qntRef} style={[styles.grid, styles.justifyContent, styles.mb_4, ]}>
            {
                defaultInputValues?.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressDefaultNum(num)}
                        style={[ {
                            width: "33.33%",
                        }]}>
                        <Paragraph style={[styles.textCenter,styles.p_5,  styles.bold,{borderRadius:5,marginHorizontal:2,backgroundColor: "#f3f3f3"}]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>

        <View ref={amtRef}
              style={[styles.grid, styles.justifyContent,styles.mb_4, {display:'none'}]}>
            {
                defaultInputAmounts?.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressDefaultNum(num)}
                        style={[ {
                            width: "33.33%",
                        }]}>
                        <Paragraph style={[styles.textCenter,styles.p_5,  styles.bold,{borderRadius:5,marginHorizontal:2,backgroundColor: "#f3f3f3"}]}>
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
                        style={[ {
                            width: "33.33%",
                        }]}>
                        <Paragraph style={[styles.textCenter,styles.p_5,   styles.bold, {borderRadius:5,marginHorizontal:2,
                            backgroundColor: okButton ? styles.accent.color : "#f3f3f3",color: okButton ? "white" : "#333"}]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>

        <View style={[styles.grid, styles.justifyContent,styles.mt_5,]}>
            <TouchableOpacity
                onPress={() => onPressNumKey("Cancel")}
                style={[  styles.p_2, {
                    width: "49%",
                    borderRadius:8,
                    backgroundColor: styles.secondary.color
                }]}>
                <Paragraph style={[styles.p_5,styles.textCenter, styles.bold,]}>
                    Cancel
                </Paragraph>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPressNumKey("OK")}
                style={[ styles.p_2, {
                    width: "49%",
                    borderRadius:8,
                    backgroundColor: styles.accent.color
                }]}>
                <Paragraph style={[styles.p_5,styles.textCenter, styles.bold, {color: "white"}]}>
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

