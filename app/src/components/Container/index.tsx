import * as React from 'react';
import {Appbar, Surface, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import Avatar from "../Avatar/PhoneAvatar";
import ProIcon from "../ProIcon";
import {device} from "../../libs/static";
import {appLog} from "../../libs/function";


const Index = ({children,surface,hideappbar,navigation,config,style,theme:{colors}}:any) => {

    if(!Boolean(navigation)){
        navigation = useNavigation()
    }

    const Actions = config?.actions;



    return (
        <>
            {!hideappbar && <Appbar.Header style={[styles.bg_white]}>
                {config?.drawer && <Appbar.Action  size={26} icon={()=> <ProIcon name={'bars'}  /> } onPress={()=> { navigation.openDrawer() } } />}
                {!config?.hideback && <Appbar.BackAction    onPress={() => {navigation.goBack(); Boolean(config.backAction) && config.backAction() }}/>}
                <Appbar.Content  title={config?.title} subtitle={config?.subtitle} />
                {Boolean(config?.actions) &&  <Actions/>}
            </Appbar.Header>}

            <View style={[styles.coverScreen]}>
                <View style={[styles.pageContent,style,{backgroundColor: '#fff'}]}>
                    {children}
                </View>
            </View>
        </>
    );
}




export default  withTheme(Index)
