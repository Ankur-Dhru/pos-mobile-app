
import React from 'react'
import {ActivityIndicator, View} from "react-native";
import {Card, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {chevronRight} from "../../libs/function";
import {ProIcon} from "../index";

import Avatar from "../Avatar";
import Button from "../Button";

class Index extends React.Component<any> {

    render(){
        const {theme:{colors}}:any = this.props

        return (
            <View style={[styles.h_100, styles.flex,styles.w_100,{padding:5}]}>
                <View style={[styles.grid,styles.justifyContent]}>
                    <View  style={[styles.grid,styles.middle,styles.bg_white,{width:150,height:45,borderRadius:5,backgroundColor: styles.yellow.color}]}>

                    </View>
                    <View style={[styles.flexGrow,{paddingLeft:6,paddingRight:6}]}>
                        <Card style={[styles.card,styles.grid, styles.justifyContent,{height:45}]}></Card>
                    </View>
                    <View style={{width:385}}>
                        <Card style={[styles.card,styles.grid, styles.justifyContent,{height:45}]}></Card>
                    </View>
                </View>

                <View  style={[styles.grid, styles.justifyContent, styles.noWrap, styles.h_100, styles.flex, styles.py_4]}>


                    <View style={[styles.flex, styles.column, styles.h_100, {minWidth: '40%'}]}>

                        <View style={[styles.grid, styles.flex, styles.h_100, styles.noWrap]}>
                            <View style={[styles.grid, styles.flexGrow, styles.h_100, styles.w_auto, {
                                minWidth: 150,
                                maxWidth: 150
                            }]}>
                                <Card style={[styles.card,styles.w_100]}>
                                    <View style={[styles.bg_light,styles.m_2,{height:40,borderRadius: 5}]}></View>
                                    <View style={[styles.bg_light,styles.m_2,{height:40,borderRadius: 5}]}></View>
                                    <View style={[styles.bg_light,styles.m_2,{height:40,borderRadius: 5}]}></View>
                                </Card>
                            </View>
                            <Card style={[styles.card,styles.flexGrow,{maxWidth:500,marginLeft: 5,marginRight:5}]}>
                                <View style={[styles.grid,styles.flex,{padding:2}]}>
                                    <View style={[styles.m_2,styles.flexGrow,{backgroundColor:styles.secondary.color,height:100,borderRadius: 5}]}></View>
                                    <View style={[styles.m_2,styles.flexGrow,{backgroundColor:styles.secondary.color,height:100,borderRadius: 5}]}></View>
                                    <View style={[styles.m_2,styles.flexGrow,{backgroundColor:styles.secondary.color,height:100,borderRadius: 5}]}></View>
                                </View>
                            </Card>

                        </View>

                    </View>

                    <View style={[styles.flexGrow, {width: 200}]}>
                        <Card style={[styles.card,styles.w_100,styles.h_100]}>
                            <View style={[styles.bg_light,styles.m_2,{height:40,borderRadius: 5}]}></View>
                        </Card>
                    </View>

                </View>


                <Card style={[styles.card]}>

                    {<View>
                        <View>
                            <View style={[styles.grid, styles.justifyContent, styles.noWrap]}>

                                <View style={[styles.w_auto]}>
                                    <Button  more={{backgroundColor: styles.green.color, color: 'white'}}>   </Button>
                                </View>

                                <View style={[styles.w_auto, styles.ml_1]}>
                                    <Button  more={{backgroundColor: styles.yellow.color,  }}>   </Button>
                                </View>


                                <View style={[styles.w_auto, styles.ml_1]}>
                                    <Button  more={{backgroundColor: styles.accent.color,  }}>   </Button>
                                </View>

                                <View style={[styles.w_auto, styles.ml_1]}>
                                    <Button  more={{backgroundColor: styles.green.color, color: 'white'}}>
                                    </Button>
                                </View>
                            </View>
                        </View>

                    </View>}

                </Card>

            </View>
        )
    }
}

export default withTheme(Index)





