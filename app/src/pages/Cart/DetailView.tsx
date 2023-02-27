import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device, localredux} from "../../libs/static";
import CartActions from "./CartActions";
import CartSummary from "./CartSummary";
import {useNavigation} from "@react-navigation/native";
import {Appbar, Card, Menu, Paragraph} from "react-native-paper";
import {Alert, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {cancelOrder, isRestaurant} from "../../libs/function";
import DeleteButton from "../../components/Button/DeleteButton";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {useDispatch} from "react-redux";
import HoldOrders from "./HoldOrders";
import Discount from "./Discount";

const Index = (props: any) => {

    const navigation: any = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const dispatch = useDispatch()
    const {cancelorder,canapplydiscount}:any = localredux?.authData?.settings;

    const askPermission = (action:any) => {
        navigation.navigate('AskPermission',{cancelOrder:cancelOrder,action:action})
    }

    navigation.setOptions({
        headerRight:()=>{
            return <View>

                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                        openMenu()
                    }}/>}>

                    <DeleteButton
                        options={['Yes','No']}
                        title={'Cancel Order'}
                        message={`Are you sure want to Cancel Order?`}
                        render={()=>{
                            return (
                                <Menu.Item  title="Cancel Order"/>
                            )
                        }}
                        onPress={(index: any) => {
                            if (index === 0) {
                                closeMenu();

                                if(cancelorder) {
                                    cancelOrder(navigation).then(r => {})
                                }
                                else{
                                    Alert.alert(
                                        "Alert",
                                        'You do not have cancel Order permission',
                                        [
                                            {text: "Cancel",onPress: () => {},style:'cancel'},
                                            {text: "Ask Permission", onPress: () => askPermission('cancelorder')}
                                        ]
                                    );
                                }
                            }
                        }}
                    />

                    {!isRestaurant() && <Menu.Item onPress={async () => {
                        closeMenu();
                        await dispatch(setBottomSheet({
                            visible: true,
                            height: '50%',
                            component: () => <HoldOrders/>
                        }))
                    }} title="Holding Orders"/>}


                    {canapplydiscount && <Menu.Item onPress={async () => {
                        closeMenu();
                        await dispatch(setBottomSheet({
                            visible: true,
                            height: '50%',
                            component: () => <Discount/>
                        }))
                    }} title="Discount"/>}

                </Menu>
            </View>
        }
    })

    let tablet:any;
    let mobile:any;
    if(device.tablet){
        tablet = {paddingHorizontal: 5,paddingVertical: 5}
    }
    else{
        mobile = {backgroundColor:styles.bg_light.backgroundColor,padding:5}
    }

    return <Container style={{padding: 0}}>
        {!device.tablet && <ClientDetail/>}
        <View style={[styles.h_100,styles.flex,mobile]}>
            <View style={[styles.bg_white,styles.flex,{borderRadius:5}]}>
                <View style={[styles.cardContent,styles.h_100,styles.flex,tablet]}>
                    <CartItems/>
                </View>

            <CartSummary navigation={navigation}/>
        </View>


        </View>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
