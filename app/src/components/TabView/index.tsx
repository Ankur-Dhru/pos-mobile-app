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
            style={{ backgroundColor: 'white'}}
            labelStyle={{color:'black'}}
            indicatorStyle={{backgroundColor:styles.accent.color}}
            scrollEnabled={scrollable}
        />
    );

    return (
        <Container>
            <TabView
                overScrollMode={'always'}
                navigationState={state}
                renderScene={renderScene}
                onIndexChange={ (index) => selectTab(index) }
                initialLayout={{ width: Dimensions.get('window').width, height : Dimensions.get('window').height }}
                renderTabBar={renderTabBar}
            />
        </Container>
    );
}

export default  Index
