import React, {useState} from "react";
import {View} from "react-native";
import {styles} from "../../theme";
import DetailView from "./DetailView";
import GroupList from "../Items/GroupList";
import {useDispatch} from "react-redux";
import {Card, List} from "react-native-paper";
import Button from "../../components/Button";


import {device} from "../../libs/static";

import CartActions from "./CartActions";
import {Container} from "../../components";
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

                    <View style={[styles.grid, styles.w_100, styles.justifyContent,{backgroundColor:styles.light.color,padding:5}]}>
                        {hasrestaurant ?
                            <Card style={[styles.card,{padding:0,marginRight:5}]} onPress={() => {
                                saveTempLocalOrder().then(() => {
                                    navigation.goBack();
                                })
                            }}>
                                <List.Item style={[styles.listitem]} title={tabledetails?.tablename}
                                           left={() => <List.Icon icon={'chevron-left'}/>}/>
                            </Card>
                            :
                            <Card style={[styles.card, styles.w_auto, {maxWidth: 60, marginRight: 5}]}
                                  onPress={() => navigation.navigate('ProfileSettingsNavigator')}>
                                <List.Item style={[styles.listitem]} title={''}
                                           left={() => <List.Icon icon={'menu'}/>}/>
                            </Card>}
                        <Card style={[styles.card, styles.w_auto, {minWidth: 60, marginRight: 5, paddingLeft: 5}]}
                              onPress={() => navigation.navigate('SearchItem')}>
                            <List.Item titleStyle={[styles.bold]} title={'Search Item'}
                                      />

                            {/*<TouchableOpacity style={[styles.px_6,{backgroundColor:'white',padding:11,borderRadius:5,marginLeft:5}]} onPress={()=>setNumpad(!numpad)}>
                            <Paragraph><ProIcon name={'keyboard'} color={!numpad?'#ccc':'#000'} action_type={'text'}/></Paragraph>
                        </TouchableOpacity>*/}
                        </Card>
                        <ClientDetail/>
                        <View style={[{marginLeft: 5}]}>
                            <Button
                                onPress={() => cancelOrder(navigation).then()}
                                more={{backgroundColor: styles.red.color, color: 'white', height: 50}}
                            > Cancel </Button>
                        </View>
                    </View>

                    <View style={[styles.h_100, styles.w_100, styles.flex,{paddingHorizontal:7,paddingBottom:5}]}>
                        <View
                            style={[styles.grid, styles.justifyContent, styles.noWrap, styles.h_100, styles.w_100, styles.flex]}>


                            <View  style={[styles.card,styles.flexGrow]}>
                                <Card style={[styles.card]}>

                                    <View style={[styles.grid,styles.justifyContent,]}>
                                        <View style={[{width:120}]}>
                                            <GroupList navigation={navigation}/>
                                        </View>


                                        <View style={[styles.flexGrow,{
                                            backgroundColor:'#fff',
                                            padding:3,
                                            borderRadius:7,
                                        }]}>

                                            {!numpad ?
                                                <ItemListTablet navigation={navigation}/> :
                                                <NumPad/>
                                            }
                                        </View>
                                    </View>


                                </Card>
                            </View>

                            <Card style={[styles.h_100, styles.flexGrow, {marginLeft:7,maxWidth:400}]}>
                                <DetailView/>
                            </Card>

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
