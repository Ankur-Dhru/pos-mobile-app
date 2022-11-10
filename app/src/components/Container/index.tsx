import * as React from 'react';
import {Surface, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {SafeAreaView} from "react-native-safe-area-context";
//import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Index = ({children,surface,hideappbar,navigation,config,style,theme:{colors}}:any) => {


    const Actions = config?.actions;
    //const insets = useSafeAreaInsets();


    return (
        <>
            {/*{!hideappbar && <Appbar.Header style={[styles.bg_white]}>
                {config?.drawer && <Appbar.Action  size={26} icon={()=> <ProIcon name={'bars'}  /> } onPress={()=> { navigation.openDrawer() } } />}
                {!config?.hideback && <Appbar.Action  size={26} icon={()=> <ProIcon name={'chevron-left'}  /> }  onPress={() => {navigation.goBack(); Boolean(config?.backAction) && config.backAction() }} /> }
                <Appbar.Content  title={config?.title} titleStyle={{fontWeight:'bold'}} subtitle={config?.subtitle} />
                {Boolean(config?.actions) &&  <Actions/>}
            </Appbar.Header>}

            <View style={[styles.coverScreen]}>
                <View style={[styles.pageContent,style,{backgroundColor: '#fff'}]}>
                    {children}
                </View>
            </View>*/}

            <Surface style={[styles.coverScreen,{backgroundColor:'#fff'}]}>

                    {children}

            </Surface>

        </>
    );
}




export default  withTheme(Index)
