import {ScrollView, TouchableOpacity, View} from "react-native";
import {Paragraph} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import Button from "../../components/Button";


const Split = () => {

    const dispatch = useDispatch();

    const [split, setSplit] = useState({splitinto: 1, splittable: true})


    const paxes = [1, 2, 3, 4, 5, 6]

    return <>
        <ScrollView>

            <View style={[styles.grid]}>
                {paxes.map((number: any, index: any) => {
                    return <>
                        <TouchableOpacity key={index} style={[styles.m_2,  styles.flexGrow, {
                            borderRadius: 10,
                            width: '13%',
                            backgroundColor: split.splitinto === number ? styles.secondary.color : styles.light.color
                        }]} onPress={() => {
                            setSplit({...split, splitinto: number})
                        }}>
                            <Paragraph style={[styles.bold, {
                                textAlign: 'center', textAlignVertical: 'center'
                            }]}>1/{number}</Paragraph>
                        </TouchableOpacity>
                    </>
                })}
            </View>


            <View>

            </View>




            <View style={[styles.mt_5, styles.grid, styles.justifyContent]}>
                <Button more={{color: 'black', backgroundColor: '#eee'}}
                        onPress={() => {
                            dispatch(setDialog({visible: false}))
                        }}> Close
                </Button>

                <Button more={{color: 'white'}}
                        onPress={() => {
                            dispatch(updateCartField({...split}))
                            dispatch(setDialog({visible: false}))
                        }}>OK
                </Button>

            </View>

        </ScrollView>
    </>
}


export default Split;

