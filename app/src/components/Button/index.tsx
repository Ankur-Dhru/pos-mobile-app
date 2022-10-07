import * as React from 'react';
import {Button, withTheme} from 'react-native-paper';
import {styles} from "../../theme";

class Index extends React.Component<any> {

    render(){
        let {label,children,contentStyle,disable,mode,more,secondbutton,compact}:any = this.props;
        const {colors}:any = this.props.theme;
        if(secondbutton){
            more={
                backgroundColor:colors.secondary,
                color:colors.primary,
                borderWidth:0,
                ...more,
            }
        }
        return (
            <Button
                 mode={'contained'}
                 style={[styles.noshadow,{borderRadius:5,elevation:0,borderWidth:0}]}
                 contentStyle={[styles.noshadow,{elevation:0,height:compact?'auto':45,backgroundColor:!Boolean(mode) ? colors.accent : 'transparent',...more}]}
                 labelStyle={[styles.capitalize,styles.bold,{color:secondbutton?more.color:'white',opacity:disable ? 0.3 : 1}]}
                 {...this.props}
            >{children}</Button>
        );
    }
}

export default (withTheme(Index))
