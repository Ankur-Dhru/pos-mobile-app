import {ordertypes} from "../../libs/static";
import React from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import Button from "../../components/Button";

import {setSelected, setSelectedData} from "../../redux-store/reducer/selected-data";
import ProIcon from "../../components/ProIcon";
import {useNavigation} from "@react-navigation/native";
import {Paragraph, Text} from "react-native-paper";


const OrderType = (props: any) => {
    const {type, selected} = props;

    const dispatch = useDispatch()


    return <>
        <TouchableOpacity
                           onPress={() =>  dispatch(setSelected({...type,field:'ordertype'})) }>
            <Paragraph style={[selected?styles.muted:styles.primary,styles.bold,styles.text_sm,styles.p_6]}>{type.label}</Paragraph>
        </TouchableOpacity>
    </>
}


const Index = (props: any) => {

    const {ordertype} = props;
    const navigation:any = useNavigation()


    return (

        <>
            <View style={[styles.grid, styles.noWrap,styles.justifyContent]}>

                <View>
                    <TouchableOpacity onPress={()=> { navigation.openDrawer() } } style={[styles.p_5]}>
                        <ProIcon name={'bars'}  />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal={true}>
                    {
                        ordertypes.map((type: any) => {
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

