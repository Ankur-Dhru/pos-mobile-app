import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import DetailView from "./DetailView";
import GroupList from "../Items/GroupList";
import {useDispatch} from "react-redux";
import {Appbar, Card, List, Menu, Paragraph} from "react-native-paper";
import Button from "../../components/Button";


import {device, localredux, urls} from "../../libs/static";

import CartActions from "./CartActions";
import {Container, ProIcon} from "../../components";
import SearchItem from "../Items/SearchItem";
import ClientDetail from "../Client/ClientDetail";
import {useNavigation} from "@react-navigation/native";
import {appLog, cancelOrder, isRestaurant, saveTempLocalOrder} from "../../libs/function";
import NumPad from "../Items/NumPad";
import ItemListMobile from "../Items/ItemListMobile";
import ItemListTablet from "../Items/ItemListTablet";
import {setBottomSheet} from "../../redux-store/reducer/component";
import HoldOrders from "./HoldOrders";
import Discount from "./Discount";


const Index = (props: any) => {


    const {tabledetails,gridView} = props;
    const navigation = useNavigation();

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [numpad, setNumpad] = useState(false)

    const hasrestaurant = isRestaurant();

    const dispatch = useDispatch();

    const {canapplydiscount}:any = localredux?.authData?.settings;


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


                        <Card style={[styles.card, styles.w_auto, {minWidth:110,marginLeft:5,marginRight:5,padding:0}]}>
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

                           <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                                    openMenu()
                                }}/>}>
                                <Menu.Item onPress={() => cancelOrder(navigation).then()} title="Cancel Order"/>

                               {canapplydiscount &&   <Menu.Item onPress={() =>  dispatch(setBottomSheet({
                                    visible: true,
                                    height: '80%',
                                    component: () => <Discount/>
                                })) } title="Discount"/>}

                            </Menu>


                        </View>

                    </View>

                    <View style={[styles.h_100, styles.w_100, styles.flex,styles.bg_light,{paddingHorizontal:5,paddingBottom:3}]}>
                        <View  style={[styles.grid, styles.justifyContent,   styles.h_100, styles.w_100, styles.flex]}>


                            <View style={[styles.flexGrow]}>
                                <Card style={[styles.card]}>

                                    <View style={[styles.grid,styles.justifyContent,styles.top]}>
                                        <View style={[{width:110}]}>
                                            <GroupList navigation={navigation}/>
                                        </View>


                                        <View style={[styles.flexGrow,{
                                            backgroundColor:'#fff',
                                            padding:3,
                                            borderRadius:7,
                                            minWidth:250,
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
                            <ItemListMobile navigation={navigation} gridView={gridView}/>
                        </View>
                    </Container>

            }

        </View>

    </>
}


export default Index;
