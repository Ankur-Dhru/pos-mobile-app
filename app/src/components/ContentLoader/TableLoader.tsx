
import React from 'react'
import {ScrollView, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Surface, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";

class Index extends React.Component<any> {

    render(){
        const {theme:{colors}}:any = this.props

        return (
            <View style={[styles.px_4,styles.h_100, styles.flex,styles.w_100]}>
                <View style={[styles.grid, styles.noWrap]}>

                    <View style={{width:45}}>

                    </View>
                    <View>
                        <ScrollView horizontal={true}>
                            <Paragraph style={[styles.primary,styles.bold,styles.text_sm,styles.p_6]}>All</Paragraph>
                            <Paragraph style={[styles.muted,styles.bold,styles.text_sm,styles.p_6]}>Tables</Paragraph>
                            <Paragraph style={[styles.muted,styles.bold,styles.text_sm,styles.p_6]}>Home Delivery</Paragraph>
                            <Paragraph style={[styles.muted,styles.bold,styles.text_sm,styles.p_6]}>Takeaway</Paragraph>
                            <Paragraph style={[styles.muted,styles.bold,styles.text_sm,styles.p_6]}>Advance Order</Paragraph>
                            <Paragraph style={[styles.muted,styles.bold,styles.text_sm,styles.p_6]}>Reserve Table</Paragraph>
                        </ScrollView>
                    </View>

                </View>

                <View style={[styles.grid,styles.flex]}>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                    <View style={[styles.m_2,styles.flexGrow,{minWidth: 200,height: 125,backgroundColor:styles.light.color,borderRadius:5}]}></View>
                </View>

            </View>
        )
    }
}

export default withTheme(Index)





