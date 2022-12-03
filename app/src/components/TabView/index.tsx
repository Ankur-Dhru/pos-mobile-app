import React, { useState } from 'react';

import { Dimensions } from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Container from "../../components/Container";
import {styles} from "../../theme";


const Index = (props: any) => {

    const {routes,scenes,scrollable,style} = props



    const renderScene = SceneMap(scenes)

    const [state,setState]:any  = useState({
        index: 0,
        routes: routes,
    })


    function selectTab ( index:any ) {
        return setState({...state,index: index});
    }

    const renderTabBar = (props:any) => (
        <TabBar
            {...props}
            style={[styles.noshadow,styles.mb_3,{ backgroundColor: 'white',}]}
            labelStyle={[{color:'black',textTransform:'capitalize'}]}
            indicatorStyle={{backgroundColor:styles.accent.color}}
            scrollEnabled={scrollable}

            tabStyle={{minWidth:80,width:'auto',...style}}
        />
    );

    return (
        <TabView
            overScrollMode={'always'}
            navigationState={state}
            renderScene={renderScene}
            onIndexChange={ (index) => selectTab(index) }
            initialLayout={{ width: Dimensions.get('window').width, height : Dimensions.get('window').height }}
            renderTabBar={renderTabBar}
        />
    );
}

export default  Index
