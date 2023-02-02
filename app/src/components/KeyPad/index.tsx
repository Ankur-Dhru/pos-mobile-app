import React, {useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Paragraph, RadioButton, Text, ToggleButton} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {appLog, getFloatValue, saveLocalSettings, updateComponent} from "../../libs/function";
import Button from "../Button";
import ToggleButtons from "../ToggleButton";
import ProIcon from "../ProIcon";
import {setSettings} from "../../redux-store/reducer/local-settings-data";
import CheckBox from "../CheckBox";


let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "."]

const index = (props: any) => {

    const {defaultValue, onPressCancel, onPressOK, defaultInputValues,defaultInputAmount, customNumber, rate,defaultTab,unitname,canchangeamount,defaultOpenUnitType,defaultAmountOpen} = props;

    const [numPadValue, setNumPadValue] = useState<any>(defaultValue || "");
    const [selectedTab, setSelectedTab] = useState<any>("num");
    const [changeitemPrice, setChangeitemPrice] = useState<any>(customNumber?'updateqnt':'updateprice');

    const defaultPrice = getFloatValue(numPadValue/defaultValue,3);
    const defaultQnt = getFloatValue(numPadValue/rate,3);


    const onPressNumKey = (keyValue: string) => {
        if (numbers[9] == keyValue) {
            // Clear
            setNumPadValue("");
        } else if (keyValue == "Cancel") {
            // Cancel
            onPressCancel && onPressCancel();
        } else if (keyValue == "OK") {
            // OK
            let newQnt = numPadValue;
            let newPrice = rate

            if (selectedTab == "amt" && Boolean(rate)) {
                newQnt = getFloatValue(numPadValue / rate, 3)
                if(changeitemPrice === 'updateprice'){
                    newPrice = defaultPrice;
                    newQnt = defaultValue;
                }
            }

            onPressOK && onPressOK(newQnt,newPrice);
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

    const onPressDefaultNum = async (keyValue: any) => {

        const defaultPrice = getFloatValue(keyValue/defaultValue,3);

        let newQnt = keyValue;
        let newPrice = rate

        if (selectedTab == "amt" && Boolean(rate)) {
            newQnt = getFloatValue(keyValue / rate, 3)
            if(changeitemPrice === 'updateprice'){
                newPrice = defaultPrice;
                newQnt = defaultValue;
            }
        }

        onPressOK && onPressOK(newQnt,newPrice);

    }
    const qntRef = React.useRef<View>(null);
    const amtRef = React.useRef<View>(null);

    const onButtonToggle = (value:any) => {

        if(value === 'quantity'){
            setNumPadValue('')
            setSelectedTab("num")
            updateComponent(qntRef, 'display', 'flex')
            updateComponent(amtRef, 'display', 'none')
        }
        else{
            setNumPadValue('')
            setSelectedTab("amt")
            updateComponent(qntRef, 'display', 'none')
            updateComponent(amtRef, 'display', 'flex')
        }
    };


    const btns = [
        {label:'Quick Quantity',value:'quantity'}
    ]

    if(canchangeamount){
        btns.push({label:'Quick Amount',value:'amount'})
    }


    return <View>



        <ToggleButtons
            width={`${100/btns.length}%`}
            default={defaultTab || 'amount'}
            btns={btns}
            onValueChange={onButtonToggle}
        />


        <View style={[styles.grid,styles.middle,styles.border,styles.mt_5,styles.mb_3,styles.p_4,{marginHorizontal:5,borderRadius:5,borderColor:styles.accent.color}]}>
            <Text><ProIcon name={selectedTab==='num'?'scale-balanced':'indian-rupee-sign'}/></Text>
            <Text style={[{fontSize: 24}]}> {numPadValue}</Text>
            {selectedTab ==='num' && <Text style={[{fontSize: 24,marginLeft:'auto'}]}> {unitname}</Text>}
        </View>


        {selectedTab !=='num' && customNumber && <>

            <View style={[styles.bg_light,styles.p_5,{marginHorizontal:3,borderRadius:5}]}>
                <Paragraph style={[styles.paragraph,styles.noWrap]}>Auto calculate according to amount</Paragraph>
                <RadioButton.Group onValueChange={newValue => setChangeitemPrice(newValue)} value={changeitemPrice}>
                    <View style={[styles.grid]}>
                        <View style={[styles.grid,styles.middle,styles.noWrap]}>
                            <RadioButton value="updateprice" />
                            {/*<Text style={[styles.noWrap]}>{`${defaultPrice || rate} Price * ${defaultValue} Qnt =  ${numPadValue || (defaultValue*rate)} Total`}</Text>*/}
                            <Text style={[styles.noWrap]}>Update Rate</Text>
                        </View>
                        <View style={[styles.grid,styles.middle,styles.noWrap]}>
                            <RadioButton value="updateqnt" disabled={!customNumber} />
                            {/*<Text style={[styles.noWrap]}>{`${rate} Price * ${defaultQnt || defaultValue} Qnt  =  ${numPadValue || (defaultValue*rate)} Total`}</Text>*/}
                            <Text style={[styles.noWrap]}>Update Quantity</Text>
                        </View>
                    </View>
                </RadioButton.Group>
            </View>


        </> }

        <View ref={qntRef} style={[styles.grid, styles.justifyContent, styles.mb_4, ]}>
            {
                defaultInputValues?.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressDefaultNum(num)}
                        style={[ {
                            width: "33.33%",
                        }]}>
                        <Paragraph style={[styles.textCenter,styles.p_5,  styles.bold,{borderRadius:5,marginHorizontal:2,backgroundColor: styles.secondary.color}]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>

        <View ref={amtRef}
              style={[styles.grid, styles.justifyContent,styles.mb_4, {display:'none'}]}>
            {
                defaultInputAmount?.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressDefaultNum(num)}
                        style={[ {
                            width: "33.33%",
                        }]}>
                        <Paragraph style={[styles.textCenter,styles.p_5,  styles.bold,{borderRadius:5,marginHorizontal:2,backgroundColor: styles.secondary.color}]}>
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
    defaultInputAmount: state.localSettings?.defaultInputAmount,
    canchangeamount: state.localSettings?.canchangeamount,
    defaultOpenUnitType: state.localSettings?.defaultOpenUnitType,
    defaultAmountOpen: state.localSettings?.defaultAmountOpen
})

export default connect(mapStateToProps)(index);


