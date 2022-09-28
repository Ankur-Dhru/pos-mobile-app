import React from "react";


import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import Container from "../../components/Container";
import Avatar from "../../components/Avatar";
import {Card, Text} from "react-native-paper";
import KeyboardScroll from "../../components/KeyboardScroll";
import {localredux} from "../../libs/static";


const Index = (props: any) => {

    const {navigation}: any = props;
    const {staff}: any = localredux.initData;

    const selectedStaff = (staff: any) => {
        navigation.navigate('Pin', staff);
    }

    if(Boolean(staff) && Object.keys(staff).length === 1){
        navigation.replace('Pin',{...staff[1],onlyone:true});
        return
    }


    return <Container config={{title:'Staff',hideback:true}}>

                <Card style={[styles.h_100]}>

                    <KeyboardScroll>
                        <View style={[styles.grid]}>
                            {
                                Boolean(staff) && Object.values(staff).map((stf: any, index: any) => {
                                    return (
                                        <View style={[styles.flexGrow,{width: 150}]} key={stf.adminid}>
                                            <TouchableOpacity onPress={() => selectedStaff(stf)} style={[styles.p_5,styles.m_2, ]}>
                                                <View style={[{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }, styles.pb_4]}>
                                                    <Avatar label={stf.username} value={1} fontsize={20} lineheight={50}
                                                            size={50}/>
                                                    <View style={[styles.mt_4]}>
                                                        <Text style={[styles.textCenter]}>{stf.username}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </KeyboardScroll>
                </Card>


    </Container>
}




export default Index;


