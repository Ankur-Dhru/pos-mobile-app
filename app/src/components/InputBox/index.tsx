import * as React from 'react';
import {TextInput, withTheme, Text, Paragraph,Divider} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";
import {ItemDivider} from "../../libs/static";



class Index extends React.Component<any> {
    state = {
        text: ''
    };

    render(){
        const {label,value,defaultValue,onChange,width,extrastyle,customRef,editmode=true,underlineColor='transparent',labelstyle}:any = this.props;
        const {colors} = this.props.theme;

        return (
            <View>
                <TextInput
                    value={value}
                    ref={customRef}
                    defaultValue={defaultValue}
                    style={[styles.input,{width:width,backgroundColor:colors.backgroundColor,...extrastyle}]}
                    mode={'flat'}
                    outlineColor="transparent"
                    dense={true}
                    disabled={!editmode}

                    underlineColor={underlineColor}
                    onChangeText={(e:any) => { onChange(e) }}
                    {...this.props}
                    label={<Text style={labelstyle}>{label}</Text>}
                />
                <ItemDivider/>
            </View>
        );
    }
}

export default withTheme(Index)
