import React, {useEffect, useState} from "react";
import {ScrollView, TouchableOpacity, View,} from "react-native";
import {Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import ProIcon from "../../components/ProIcon";
import {isEmpty} from "../../libs/function";


const Index = (props: any) => {

    const {cartData: {pax, currentpax,orderbypax},all,paxwise} = props;


    const dispatch = useDispatch();
    const [current,setCurrent] = useState(currentpax || 1)
    const [paxdetail,setPaxdetail] = useState(paxwise)

    useEffect(()=>{
        setCurrent(currentpax)
    },[currentpax])

    useEffect(()=>{
        setPaxdetail(paxwise)
    },[paxwise])

    if(!orderbypax){
        return <></>
    }

    return <View>


        <View style={[styles.mb_2]}>
            <ScrollView>
                <View style={[styles.grid, styles.middle,styles.justifyContent]}>
                    <View  style={[styles.grid, styles.middle]}>


                    <Paragraph>Paxes : </Paragraph>
                        {
                            Array.from(Array(pax), (e, i) => {
                                return   <TouchableOpacity    key={i} onPress={() => {
                                        setCurrent((i+1))
                                        dispatch(updateCartField({currentpax:(i+1)}))
                                    }} style={[styles.bg_light, styles.px_5, styles.py_3, styles.mr_1, styles.mb_2, {
                                        borderRadius: 4,
                                        backgroundColor: +current === +(i + 1) ? styles.secondary.color : 'white'
                                }]}><Paragraph style={[styles.grid,styles.justifyContent]}>
                                        {!isEmpty(paxdetail) && Boolean(paxdetail[i+1]?.payments) && paxdetail[i+1]?.payments[0]?.remainingamount == 0 && <ProIcon name={'check'}></ProIcon>}
                                        <Paragraph>{i + 1} </Paragraph>
                                    </Paragraph>
                                </TouchableOpacity>
                            })
                        }
                    </View>

                    {all && <TouchableOpacity   onPress={() => {
                        setCurrent(('all'))
                        dispatch(updateCartField({currentpax:('all')}))
                    }} style={[styles.bg_light,   styles.mb_2, {
                        borderRadius: 4,
                        backgroundColor: current === 'all' ? styles.secondary.color : 'white'
                    }]}><Paragraph> View All </Paragraph></TouchableOpacity>}

                </View>
            </ScrollView>
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})

export default connect(mapStateToProps)(Index);
