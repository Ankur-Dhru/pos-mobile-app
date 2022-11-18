import React, { useState } from 'react';

import { Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Container from "../../components/Container";


const Index = (props: any) => {

    const {routes,scenes} = props



    const renderScene = SceneMap(scenes)

    const [state,setState]:any  = useState({
        index: 0,
        routes: routes,
    })

    function selectTab ( index:any ) {
        return setState({...state,index: index});
    }

    return (
        <Container>
            <TabView
                overScrollMode={'always'}
                navigationState={state}
                renderScene={renderScene}
                onIndexChange={ (index) => selectTab(index) }
                initialLayout={{ width: Dimensions.get('window').width, height : Dimensions.get('window').height }}
            />
        </Container>
    );
}

export default  Index
