import {ScrollView, TouchableOpacity, View} from "react-native";
import {Paragraph} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import Button from "../../components/Button";
import CheckBox from "../../components/CheckBox";


const Paxes = ({selectedpaxes,orderbypax}:any) => {

    const dispatch = useDispatch();

    const [paxes, setPaxes] = useState({pax: selectedpaxes, orderbypax: Boolean(orderbypax),currentpax:1})


    const noofpaxes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    return <>
        <ScrollView>


            <View style={[styles.mb_5]}>
                <CheckBox
                    label={'Order by Pax'}
                    value={Boolean(orderbypax)}
                    onChange={(value: any) => {
                        setPaxes({...paxes, orderbypax: value})
                    }}
                />
            </View>


            <View style={[styles.grid]}>
                {noofpaxes.map((number: any, index: any) => {
                    return <View key={index} style={[styles.m_2, styles.p_6, styles.flexGrow, {width: '20%',borderRadius: 10,backgroundColor: +paxes.pax === +number ? styles.secondary.color : styles.light.color}]}>
                        <TouchableOpacity    onPress={() => {
                            setPaxes({...paxes, pax: number})
                        }}>
                            <Paragraph style={[styles.bold, {
                                textAlign: 'center',
                                textAlignVertical: 'center'
                            }]}>{number}</Paragraph>
                        </TouchableOpacity>
                    </View>
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
                            dispatch(updateCartField({...paxes}))
                            dispatch(setDialog({visible: false}))
                        }}>OK
                </Button>

            </View>

        </ScrollView>
    </>
}


export default Paxes;

