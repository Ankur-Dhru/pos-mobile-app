import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";
import ActionSheet from "../ActionSheet";
import {ProIcon} from "../index";
import {Button} from "../../components";

class Index extends React.Component<any> {

    render(){
        let {onPress,message,title,render,buttonTitle}:any = this.props;
        const Render:any = render;

        return (
            <View>
                <View>
                    <ActionSheet
                        title={title}
                        message={message}
                        styles={[styles.middle, styles.p_5]}
                        titleBox={{backgroundColor: 'pink'}}
                        options={['Delete', 'Cancel']}
                        cancelButtonIndex={1}
                        destructiveButtonIndex={0}
                        onPress={onPress}>
                        <View style={[styles.center, styles.middle]}>
                            {Boolean(render) ? <Render/> : <Button
                                compact={true}
                                mode={'text'}
                                icon={() => <ProIcon name={'trash'} action_type={'text'} size={14} color={styles.red.color}/>}
                                secondbutton={false}
                                more={{borderColor: styles.red.color,borderWidth:1,borderStyle:'dashed',borderRadius:7}}
                                labelStyle={[styles.capitalize, {color: styles.red.color}]}> {buttonTitle?buttonTitle:'Delete'} </Button>}
                        </View>
                    </ActionSheet>
                </View>
            </View>
        );
    }
}

export default (withTheme(Index))
