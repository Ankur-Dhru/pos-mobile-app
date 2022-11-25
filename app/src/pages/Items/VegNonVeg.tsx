import React from "react";
import {View,Text} from "react-native";
import {styles} from "../../theme";

const Index = ({type}:any) => {

    const color = type === 'veg' ? styles.veg.color : type === 'nonveg' ? styles.nonveg.color : styles.vegan.color;

    return (
        <>
            <View style={[styles.border,{borderColor:color},{padding:2,borderRadius:2}]}>
                <View style={[{backgroundColor:color},{height:8,width:8,borderRadius:50,}]}>

                </View>
            </View>
        </>
    )
}

export default Index;
