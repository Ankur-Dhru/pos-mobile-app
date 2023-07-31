import React, {useState} from "react";
import {ScrollView, TouchableOpacity, View,} from "react-native";
import {Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import {updateCartField} from "../../redux-store/reducer/cart-data";


const Index = (props: any) => {

    const {cartData: {pax, currentpax,splittable}} = props;
    const dispatch = useDispatch();
    const [current,setCurrent] = useState(currentpax)

    if(!splittable){
        return <></>
    }

    return <View>


        <View style={[styles.mb_2]}>
            <ScrollView>
                <View style={[styles.grid, styles.middle]}>
                    <Paragraph>Paxes : </Paragraph>
                    {
                        Array.from(Array(pax), (e, i) => {
                            return   <TouchableOpacity key={i} onPress={() => {
                                    setCurrent((i+1))
                                    dispatch(updateCartField({currentpax:(i+1)}))
                                }} style={[styles.bg_light, styles.px_5, styles.py_3, styles.mr_1, styles.mb_2, {
                                    borderRadius: 4,
                                    backgroundColor: +current === +(i + 1) ? styles.secondary.color : 'white'
                                }]}><Paragraph>{i + 1} </Paragraph></TouchableOpacity>
                        })
                    }
                </View>
            </ScrollView>
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})

export default connect(mapStateToProps)(Index);
