import * as React from 'react';
import {Checkbox, Divider, Paragraph, Text} from 'react-native-paper';
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {appLog} from "../../libs/function";

const CheckBox = (props:any) => {
    const {editmode=true, description,disabled}:any = props;
    const [checked, setChecked] = React.useState(props.value);


    return (
        <View style={{marginLeft:-20}}>
            <TouchableOpacity onPress={() => {
                if(editmode && !disabled) {
                    setChecked(!checked);
                    props.onChange(!checked);
                }
            }} style={[styles.grid,styles.middle]}>
                <Checkbox.Item
                    mode={'android'}
                    position={'leading'}
                    label={props.label}
                    labelStyle={{textTransform:'capitalize'}}
                    disabled={!editmode}
                    status={(checked) ? 'checked' : 'unchecked'}
                    {...props}
                />
                {/*<Paragraph>{props.label}</Paragraph>*/}

            </TouchableOpacity>
            {Boolean(description) && <Text style={[styles.paragraph]}><Text>{description} </Text></Text>}
        </View>
    );
};

export default CheckBox;
