import {ordertypes} from "../../libs/static";
import React from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";

import {setSelected} from "../../redux-store/reducer/selected-data";
import {useNavigation} from "@react-navigation/native";
import {Paragraph} from "react-native-paper";


const OrderType = (props: any) => {
    const {type, selected} = props;
    const navigation: any = useNavigation();
    const dispatch = useDispatch()


    return <>
        <TouchableOpacity onPress={() => {
            if (type.value === 'qsr') {
                navigation.navigate('CartStackNavigator', {
                    tablename: type.label,
                    ordertype: type.value,
                    invoiceitems: [],
                    kots: []
                });
            } else {
                dispatch(setSelected({...type, field: 'ordertype'}))
            }
        }}>
            <Paragraph
                style={[selected ? styles.muted : styles.primary, styles.bold, styles.text_sm, styles.p_6]}>{type.label}</Paragraph>
        </TouchableOpacity>
    </>
}


const Index = (props: any) => {

    const {ordertype, shifttable} = props;


    return (

        <>
            <View style={[styles.grid, styles.noWrap, styles.justifyContent]}>


                <ScrollView horizontal={true}>
                    {
                        ordertypes.map((type: any) => {
                            if (shifttable) {
                                return <Paragraph style={[styles.p_6]}> </Paragraph>
                            }
                            return <OrderType selected={ordertype?.value !== type.value} type={type} key={type.value}/>
                        })
                    }
                </ScrollView>


            </View>


        </>
    )
}

const mapStateToProps = (state: any) => ({
    ordertype: state.selectedData.ordertype,
})

export default connect(mapStateToProps)(Index);

