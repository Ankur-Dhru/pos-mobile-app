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
                    style={[styles.input,{width:width,...extrastyle}]}

                    mode={'outlined'}
                    outlineColor={'#eee'}
                    underlineColor={underlineColor}
                    activeOutlineColor={styles.accent.color}
                    dense={false}
                    disabled={!editmode}
                    onChangeText={(e:any) => { onChange(e) }}
                    {...this.props}
                    label={<Paragraph style={{backgroundColor:'white',...labelstyle}}> {label} </Paragraph>}
                />
                {/*<ItemDivider/>*/}
            </View>
        );
    }
}

export default withTheme(Index)
