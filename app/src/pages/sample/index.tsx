import React from 'react';

import {StyleSheet, View} from 'react-native';

import Tabs from "../../components/TabView"
import {styles} from "../../theme";


const Index = (props: any) => {

    const LatestRoute = () => (
        <View style={[styles.flex,{backgroundColor: '#ff4081'}]}/>
    );

    const FavoritesRoute = () => (
        <View style={[styles.flex,{backgroundColor: '#673ab7'}]}/>
    );

    const AllRoute = () => (
        <View style={[styles.flex,{backgroundColor: '#673ab7'}]}/>
    );


    return (
        <Tabs
            scenes={{latest: LatestRoute, favorites: FavoritesRoute, all: AllRoute}}
            routes={[
                {key: 'latest', title: 'Latest'},
                {key: 'favorites', title: 'Favorites'},
                {key: 'all', title: 'All'},
            ]}
        />
    );
}

export default Index
