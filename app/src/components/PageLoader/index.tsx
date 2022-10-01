import React,{Component} from "react";
import {connect} from "react-redux";
import {Alert, Platform, Text, View,ActivityIndicator} from "react-native";
import {Button, Colors, Surface, withTheme} from "react-native-paper";
import {styles} from "../../theme";


const Index = (props:any) => {

    return <View  style={[styles.screenCenter,styles.h_100,styles.transparent]}>
        <ActivityIndicator style={styles.m_1} color={'#016EFE'} size='large' animating={true}   />
    </View>
}


export default Index;
