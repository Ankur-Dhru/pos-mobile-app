import * as React from 'react';
import {Button, withTheme, Text, Paragraph} from 'react-native-paper';
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";

class Index extends React.Component<any> {

    render(){
        let {label,children,contentStyle,disable,mode,more,secondbutton,compact}:any = this.props;
        const {colors}:any = this.props.theme;
        if(secondbutton){
            more={

                color:colors.primary,
                borderWidth:0,
                ...more,
            }
        }
        return (
            <TouchableOpacity  {...this.props}>
                <View style={[styles.center,{borderRadius:3,  height:50,backgroundColor:!Boolean(mode) ? colors.accent : 'transparent',...more}]} ><Paragraph style={[styles.px_6,styles.bold,{textAlign:'center',color:more?.color?more?.color:'white'}]}>{children}</Paragraph></View>
            </TouchableOpacity>
            /*<Button
                 mode={'contained'}
                 style={[styles.noshadow,{borderRadius:5,elevation:0,borderWidth:0}]}
                 contentStyle={[styles.noshadow,{elevation:0,height:compact?'auto':45,backgroundColor:!Boolean(mode) ? colors.accent : 'transparent',...more}]}
                 labelStyle={[styles.capitalize,styles.bold,{color:more?.color?more.color:'white',opacity:disable ? 0.3 : 1}]}
                 {...this.props}
            ></Button>*/
        );
    }
}

export default (withTheme(Index))
