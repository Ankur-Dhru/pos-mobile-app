import {ScrollView, TouchableOpacity, View} from "react-native";
import {Paragraph} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import Button from "../../components/Button";
import CheckBox from "../../components/CheckBox";


const Paxes = () => {

    const dispatch = useDispatch();

    const [split, setSplit] = useState({pax: '', splittable: false,currentpax:1})


    const paxes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    return <>
        <ScrollView>


            <View style={[styles.mb_5]}>
                <CheckBox
                    label={'Split Table'}
                    onChange={(value: any) => {
                        setSplit({...split, splittable: value})
                    }}
                />
            </View>


            <View style={[styles.grid]}>
                {paxes.map((number: any, index: any) => {
                    return <>
                        <TouchableOpacity key={index} style={[styles.m_2, styles.p_6, styles.flexGrow, {
                            borderRadius: 10,
                            width: '20%',
                            backgroundColor: split.pax === number ? styles.secondary.color : styles.light.color
                        }]} onPress={() => {
                            setSplit({...split, pax: number})
                        }}>
                            <Paragraph style={[styles.bold, {
                                textAlign: 'center',
                                textAlignVertical: 'center'
                            }]}>{number}</Paragraph>
                        </TouchableOpacity>
                    </>
                })}
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


export default Paxes;

