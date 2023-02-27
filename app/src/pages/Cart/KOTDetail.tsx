import React from "react";
import {styles} from "../../theme";

import {View} from "react-native";

import KeyboardScroll from "../../components/KeyboardScroll";
import Kot from "./Kot";
import {Container} from "../../components";
import {useNavigation} from "@react-navigation/native";


const Index = (props:any) => {

    const kotdetail: any = props?.route.params?.kotdetail;
    const navigation = useNavigation()

    navigation.setOptions({
        headerTitle:`${kotdetail.ticketnumberprefix} - ${kotdetail.kotid}`
    })


    return (

        <Container style={styles.bg_white}>

            <View style={[styles.middle,styles.p_5]}>
                <View style={[styles.middleForm, {maxWidth: 400,}]}>
                    <KeyboardScroll>
                        <Kot kot={kotdetail}/>
                    </KeyboardScroll>
                </View>
            </View>

        </Container>


    )
}


export default Index;
