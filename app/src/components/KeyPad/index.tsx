import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";

let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", ".", "Cancel", "OK"]

const index = (props: any) => {

    const {defaultValue, onPressCancel, onPressOK} = props;

    const [numPadValue, setNumPadValue] = useState<any>(defaultValue || "");

    const onPressNumKey = (keyValue: string) => {
        if (numbers[9] == keyValue) {
            // Clear
            setNumPadValue("");
        } else if (numbers[12] == keyValue) {
            // Cancel
            onPressCancel && onPressCancel();
        } else if (numbers[13] == keyValue) {
            // OK
            onPressOK && onPressOK(numPadValue);
        } else {
            setNumPadValue((prev: any) => {
                if (numbers[11] == keyValue && prev.includes(keyValue)) {
                    return prev;
                }
                return prev + keyValue
            });
        }
    }

    return <View>
        <View style={[styles.border, styles.mb_5, styles.p_4]}>
            <Text style={[{fontSize: 24}]}>{numPadValue}</Text>
        </View>
        <View style={[styles.grid, styles.justifyContent, {marginLeft: -4, marginRight: -4}]}>
            {
                numbers.map((num: string) => {
                    return <TouchableOpacity
                        onPress={() => onPressNumKey(num)}
                        style={[styles.flexGrow, styles.p_5, styles.m_2, {width: "30%", backgroundColor: "#f3f3f3"}]}>
                        <Paragraph style={[styles.textCenter, styles.bold]}>
                            {num}
                        </Paragraph>
                    </TouchableOpacity>
                })
            }
        </View>
    </View>
}

export default index;
