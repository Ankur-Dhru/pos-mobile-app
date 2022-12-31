import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput as TextInputReact, ScrollView} from 'react-native';

import {appLog, getTemplate, nextFocus, printImage} from "../../libs/function";
import {  image6000,

} from "../../libs/static";

global.Buffer = require('buffer').Buffer;


import InputField from "../../components/InputField";


export default function App() {

    const [cropheight,setCropHeight]:any = useState(103)




    return (
        <View>


            <ScrollView>

                <View style={[{marginTop:10,width:300}]}>

                    <InputField
                        autoFocus={true}
                        label={'Height'}
                        inputtype={'textbox'}
                        onChange={(value:any)=>{
                            setCropHeight(+value)
                        }}
                    />

                    <TouchableOpacity style={styles.button} onPress={()=>printImage(cropheight,image6000)}>
                        <Text style={styles.buttonText}>Crop</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>




        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 20,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});
