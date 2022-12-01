import React, { useState } from 'react';

import { Dimensions } from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Container from "../../components/Container";
import {styles} from "../../theme";


const Index = (props: any) => {

    const {routes,scenes,scrollable} = props



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
            style={[styles.noshadow,{ backgroundColor: 'white',marginBottom:5,}]}
            labelStyle={[{color:'black',textTransform:'capitalize'}]}
            indicatorStyle={{backgroundColor:styles.accent.color}}
            scrollEnabled={scrollable}
            tabStyle={{width:'auto',minWidth:80}}
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
