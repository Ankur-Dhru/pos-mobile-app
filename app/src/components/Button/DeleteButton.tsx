import * as React from 'react';
import {Button, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";
import ActionSheet from "../ActionSheet";
import {ProIcon} from "../index";


class Index extends React.Component<any> {

    render(){
        let {onPress,message,title,render,buttonTitle,options,morestyle}:any = this.props;
        const Render:any = render;

        return (
            <View>
                <View>
                    <ActionSheet
                        title={title}
                        message={message}
                        styles={[styles.middle, styles.p_5]}
                        titleBox={{backgroundColor: 'pink'}}
                        options={options || ['Delete', 'Cancel']}
                        cancelButtonIndex={1}
                        destructiveButtonIndex={0}
                        onPress={onPress}>
                        <View>
                            {Boolean(render) ? <Render/> : <View  style={[styles.center, styles.middle,styles.w_100]}><Button
                                mode={'text'}
                                icon={() => <ProIcon name={'trash'} action_type={'text'} size={14} color={styles.red.color}/>}
                                contentStyle={{borderColor: styles.red.color,borderWidth:1,borderStyle:'dashed',borderRadius:7,...morestyle}}
                                labelStyle={[styles.capitalize, {color: styles.red.color}]}> {buttonTitle?buttonTitle:'Delete'} </Button></View>}
                        </View>
                    </ActionSheet>
                </View>
            </View>
        );
    }
}

export default (withTheme(Index))
