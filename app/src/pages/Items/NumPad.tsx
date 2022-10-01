import React, {useRef, useState} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import {styles} from "../../theme";
import {appLog} from "../../libs/function";
import ReactNativePinView from "react-native-pin-view";
import {Card, Paragraph} from "react-native-paper";

const Index = ({}:any) => {

    const [inputNumber,setInputNumber]:any = useState()

    let model = {

        _keys: [],

        _listeners: [],

        addKey(key:any) {
            this._keys.push(key);
            this._notify();
        },

        delKey() {
            this._keys.pop();
            this._notify();
        },

        clearAll() {
            this._keys = [];
            this._notify();
        },

        getKeys() {
            return this._keys;
        },

        onChange(listener:any) {
            if (typeof listener === 'function') {
                this._listeners.push(listener);
            }
        },

        _notify() {
            this._listeners.forEach((listner) => {
                listner(this);
            });
        }
    };

    model.onChange((model:any) => {
        appLog('asdf',model.getKeys().join(''))
        setInputNumber(model.getKeys().join(''))
    });

   const _handleClear = () => {
        model.clearAll();
    }

    const _handleDelete= () =>  {
        model.delKey();
    }

    const _handleKeyPress= (key:any) =>  {
        model.addKey(key);
    }


    const numbers1 = [1,2,3]
    const numbers2 = [4,5,6]
    const numbers3 = [7,8,9]
    const numbers4 = ['',0,'']

    console.log('inputnumber',inputNumber)

    return (
        <View style={[styles.p_5]}>

            <View style={{flex: 1}}>
                <Text style={styles.text}>{inputNumber}</Text>
            </View>

            <View style={[styles.grid]}>
                {
                    numbers1.map((number:any)=>{
                        return <TouchableOpacity style={[{backgroundColor:styles.secondary.color,borderRadius:50,margin:5}]} onPress={()=>_handleKeyPress(number)}>
                            <Paragraph style={[styles.paragraph,styles.bold,styles.text_md,{height:50,width:50,textAlign:'center',lineHeight:50}]}>
                                {number}
                            </Paragraph>
                        </TouchableOpacity>
                    })
                }
            </View>

            <View style={[styles.grid]}>
                {
                    numbers2.map((number:any)=>{
                        return <TouchableOpacity style={[{backgroundColor:styles.secondary.color,borderRadius:50,margin:5}]} onPress={()=>_handleKeyPress(number)}>
                            <Paragraph style={[styles.paragraph,styles.bold,styles.text_md,{height:50,width:50,textAlign:'center',lineHeight:50}]}>
                                {number}
                            </Paragraph>
                        </TouchableOpacity>
                    })
                }
            </View>

            <View style={[styles.grid]}>
                {
                    numbers3.map((number:any)=>{
                        return <TouchableOpacity style={[{backgroundColor:styles.secondary.color,borderRadius:50,margin:5}]} onPress={()=>_handleKeyPress(number)}>
                            <Paragraph style={[styles.paragraph,styles.bold,styles.text_md,{height:50,width:50,textAlign:'center',lineHeight:50}]}>
                                {number}
                            </Paragraph>
                        </TouchableOpacity>
                    })
                }
            </View>

            <View style={[styles.grid]}>
                {
                    numbers4.map((number:any)=>{
                        return <TouchableOpacity style={[{backgroundColor:styles.secondary.color,borderRadius:50,margin:5}]} onPress={()=>_handleKeyPress(number)}>
                            <Paragraph style={[styles.paragraph,styles.bold,styles.text_md,{height:50,width:50,textAlign:'center',lineHeight:50}]}>
                                {number}
                            </Paragraph>
                        </TouchableOpacity>
                    })
                }
            </View>



        </View>
    )
}

export default Index;
