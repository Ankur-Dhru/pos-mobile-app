import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import DetailView from "./DetailView";
import GroupList from "../Items/GroupList";
import {useDispatch} from "react-redux";
import {Card, List, Paragraph} from "react-native-paper";
import Button from "../../components/Button";
import CartTotal from "./CartTotal";


import {device} from "../../libs/static";

import CartActions from "./CartActions";
import {Container, ProIcon} from "../../components";
import SearchItem from "../Items/SearchItem";
import GroupHeading from "../Items/GroupHeading";
import ClientDetail from "../Client/ClientDetail";
import {useNavigation} from "@react-navigation/native";
import {cancelOrder, isRestaurant, saveTempLocalOrder} from "../../libs/function";
import NumPad from "../Items/NumPad";
import ItemListMobile from "../Items/ItemListMobile";
import ItemListTablet from "../Items/ItemListTablet";
import GroupListMobile from "../Items/GroupListMobile";
import Icon from "react-native-fontawesome-pro";


const Index = (props: any) => {


    const {tabledetails} = props;
    const navigation = useNavigation()

    const [numpad, setNumpad] = useState(false)

    const hasrestaurant = isRestaurant();

    const dispatch = useDispatch()


    return <>

        <View style={[styles.h_100, styles.flex,styles.w_100]}>

            {
                device.tablet ? <>

                    <View style={[styles.grid,styles.w_100,styles.justifyContent,styles.p_3]}>
                        {hasrestaurant ?
                            <Card style={[styles.card,{marginRight:5}]} onPress={() => {
                                saveTempLocalOrder().then(() => {navigation.goBack();})
                            }}>
                                <List.Item style={[styles.listitem]}  title={tabledetails?.tablename} left={()=><List.Icon icon={'chevron-left'}/>}/>
                            </Card>
                          :
                            <Card style={[styles.card,styles.w_auto,{maxWidth:60,marginRight:5}]}  onPress={() => navigation.navigate('ProfileSettingsNavigator')}>
                                <List.Item style={[styles.listitem]}  title={''} left={()=><List.Icon icon={'menu'}/>}/>
                        </Card>}
                        <Card style={[styles.card,styles.w_auto,{minWidth: 120,marginRight:5,paddingLeft:10}]}  onPress={() => navigation.navigate('SearchItem')}>
                            <List.Item style={[styles.listitem]} titleStyle={[styles.bold]}  title={'Search Item'} right={()=> <List.Icon icon="text-search"/>  }/>

                            {/*<TouchableOpacity style={[styles.px_6,{backgroundColor:'white',padding:11,borderRadius:5,marginLeft:5}]} onPress={()=>setNumpad(!numpad)}>
                            <Paragraph><ProIcon name={'keyboard'} color={!numpad?'#ccc':'#000'} action_type={'text'}/></Paragraph>
                        </TouchableOpacity>*/}
                        </Card>
                        <ClientDetail/>
                        <View style={[{marginLeft:5}]}>
                            <Button
                                onPress={() => cancelOrder(navigation).then()}
                                more={{backgroundColor: styles.red.color, color: 'white',height:55}}
                            > Cancel </Button>
                        </View>
                    </View>

                    <View style={[styles.h_100,styles.flex]}>
                    <View
                        style={[styles.grid, styles.justifyContent, styles.noWrap, styles.h_100, styles.flex]}>


                        <Card style={[styles.card,styles.w_auto, {minWidth: 120,marginLeft:5}]}>
                            <GroupList navigation={navigation}/>
                        </Card>

                        <Card style={[styles.card,styles.flexGrow,  styles.w_auto,{
                            marginHorizontal:5,
                            minWidth: '40%'
                        }]}>

                            {!numpad ?
                                <ItemListTablet navigation={navigation}/> :
                                <NumPad/>
                            }
                        </Card>

                        <View style={[styles.w_auto,styles.h_100,styles.flex,{minWidth: '40%',marginRight:5}]}>
                            <DetailView />
                        </View>

                    </View>



                    </View>

                    <CartActions/>


                </> : <Container>

                    <View style={[styles.h_100, styles.flex, {flexDirection: 'column'}]}>





                            <ItemListMobile navigation={navigation}/>


                    </View>
                </Container>
            }

        </View>

    </>
}


export default Index;
