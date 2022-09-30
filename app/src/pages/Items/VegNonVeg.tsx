import React from "react";
import {View} from "react-native";
import {styles} from "../../theme";

const Index = ({veg}:any) => {

    const color = veg === 'veg' ? styles.veg.color : veg === 'nonveg' ? styles.nonveg.color : styles.vegan.color

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
