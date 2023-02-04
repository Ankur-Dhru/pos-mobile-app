import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import DetailView from "./DetailView";
import GroupList from "../Items/GroupList";
import {useDispatch} from "react-redux";
import {Card, List, Paragraph} from "react-native-paper";
import Button from "../../components/Button";


import {device} from "../../libs/static";

import CartActions from "./CartActions";
import {Container, ProIcon} from "../../components";
import SearchItem from "../Items/SearchItem";
import ClientDetail from "../Client/ClientDetail";
import {useNavigation} from "@react-navigation/native";
import {cancelOrder, isRestaurant, saveTempLocalOrder} from "../../libs/function";
import NumPad from "../Items/NumPad";
import ItemListMobile from "../Items/ItemListMobile";
import ItemListTablet from "../Items/ItemListTablet";


const Index = (props: any) => {


    const {tabledetails} = props;
    const navigation = useNavigation()

    const [numpad, setNumpad] = useState(false)

    const hasrestaurant = isRestaurant();

    const dispatch = useDispatch();

    return <>

        <View style={[styles.h_100, styles.flex, styles.w_100]}>

            {
                device.tablet ? <>

                    <View style={[styles.grid, styles.w_100, styles.justifyContent,styles.bg_light,{padding:5}]}>
                        {hasrestaurant ?
                            <Card style={[styles.card]}>
                                <TouchableOpacity style={[{padding:7}]}  onPress={() => {
                                    saveTempLocalOrder().then(() => {
                                        navigation.goBack();
                                    })
                                }}>
                                    <ProIcon name={'arrow-left'}/>
                                </TouchableOpacity>
                            </Card>
                            :

                            <Card style={[styles.card]}>
                                <TouchableOpacity style={[{padding:7}]}   onPress={() => navigation.navigate('ProfileSettingsNavigator')}>
                                    <ProIcon name={'bars'}/>
                                </TouchableOpacity>
                            </Card>

                        }


                        <Card style={[styles.card, styles.w_auto, {minWidth: 60,marginLeft:5,marginRight:5,padding:0}]}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('SearchItem')}>
                                    <Paragraph style={[styles.p_4,styles.px_5,styles.bold]}>Search Item</Paragraph>
                                </TouchableOpacity>

                             {/*<TouchableOpacity style={[styles.px_6,{backgroundColor:'white',padding:11,borderRadius:5,marginLeft:5}]} onPress={()=>setNumpad(!numpad)}>
                                <Paragraph><ProIcon name={'keyboard'} color={!numpad?'#ccc':'#000'} action_type={'text'}/></Paragraph>
                            </TouchableOpacity>*/}
                        </Card>
                        <ClientDetail/>
                        <View style={[{marginLeft: 5}]}>
                            <Button
                                onPress={() => cancelOrder(navigation).then()}
                                more={{backgroundColor: styles.red.color, color: 'white', height: 45}}
                            > Cancel </Button>
                        </View>
                    </View>

                    <View style={[styles.h_100, styles.w_100, styles.flex,styles.bg_light,{paddingHorizontal:5,paddingBottom:3}]}>
                        <View  style={[styles.grid, styles.justifyContent,   styles.h_100, styles.w_100, styles.flex]}>


                            <View style={[styles.flexGrow]}>
                                <Card style={[styles.card]}>

                                    <View style={[styles.grid,styles.justifyContent,styles.top]}>
                                        <View style={[{width:100}]}>
                                            <GroupList navigation={navigation}/>
                                        </View>


                                        <View style={[styles.flexGrow,{
                                            backgroundColor:'#fff',
                                            padding:3,
                                            borderRadius:7,
                                            minWidth:250
                                        }]}>

                                            {!numpad ?
                                                <ItemListTablet navigation={navigation}/> :
                                                <NumPad/>
                                            }
                                        </View>
                                    </View>


                                </Card>
                            </View>

                            <View style={[styles.flexGrow,styles.h_100,styles.flex,{paddingRight: 0,minWidth:220,maxWidth:350}]}>
                                <Card style={[styles.card,styles.h_100,styles.flex,{marginLeft:4,}]}>
                                    <DetailView/>
                                </Card>
                            </View>

                        </View>


                    </View>

                    <CartActions/>


                </> :

                    <Container style={{padding:0}}>
                        <View style={[styles.h_100, styles.flex, {flexDirection: 'column'}]}>
                            <ItemListMobile navigation={navigation}/>
                        </View>
                    </Container>

            }

        </View>

    </>
}


export default Index;
