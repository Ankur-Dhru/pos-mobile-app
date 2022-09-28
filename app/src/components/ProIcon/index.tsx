import * as React from 'react';
import Icon from "react-native-fontawesome-pro";
import {withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {TouchableOpacity} from "react-native-gesture-handler";

// 13.1
class Index extends React.Component<any> {

    render() {

        const {colors}: any = this.props.theme;
        const {
            size = 20,
            type = 'light',
            name,
            color = colors.inputbox,
            onPress,
            align = 'center',
            action_type = 'button'
        }: any = this.props;

        return (
            <>
                {action_type === 'button' ? <TouchableOpacity style={[styles.center, {
                        height: 30,
                        width: 35,
                        alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
                    }]} onPress={onPress}>
                        <Icon name={name} type={type} color={color} size={size} {...this.props}    />
                    </TouchableOpacity>
                    :
                    <Icon name={name} type={type} color={color}  size={size}  {...this.props} />}
            </>
        );
    }
}

export default (withTheme(Index))
