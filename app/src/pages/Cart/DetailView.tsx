import React, {useEffect} from "react";

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
import Adjustment from "./Adjustment";
import store from "../../redux-store/store";
import ExtraCharges from "./ExtraCharges";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import PaxesSelection from "../Items/PaxesSelection";

const Index = (props: any) => {

    const navigation: any = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const [extrachargesvisible, setExtrachargesvisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const dispatch = useDispatch()

    const {isadjustment} = store.getState().cartData


    useEffect(() => {
        getItemsByWhere({treatby: true}).then((items: any) => {
            if (Boolean(items?.length)) {
                setExtrachargesvisible(true)
            }
        })

        navigation.setOptions({
            headerRight: () => {
                return <View>

                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                            openMenu()
                        }}/>}>

                        <DeleteButton
                            options={['Yes', 'No']}
                            title={'Cancel Order'}
                            message={`Are you sure want to Cancel Order?`}
                            render={() => {
                                return (<Menu.Item title="Cancel Order"/>)
                            }}
                            onPress={(index: any) => {
                                if (index === 0) {
                                    closeMenu();

                                    if (cancelorder) {
                                        cancelOrder(navigation).then(r => {
                                        })
                                    } else {
                                        Alert.alert("Alert", 'You do not have cancel Order permission', [{
                                            text: "Cancel",
                                            onPress: () => {
                                            },
                                            style: 'cancel'
                                        }, {text: "Ask Permission", onPress: () => askPermission('cancelorder')}]);
                                    }
                                }
                            }}
                        />

                        {!isRestaurant() && <Menu.Item onPress={async () => {
                            closeMenu();
                            await dispatch(setBottomSheet({
                                visible: true, height: '50%', component: () => <HoldOrders/>
                            }))
                        }} title="Holding Orders"/>}


                        {canapplydiscount && <Menu.Item onPress={async () => {
                            closeMenu();
                            await dispatch(setBottomSheet({
                                visible: true, height: '80%', component: () => <Discount/>
                            }))
                        }} title="Discount"/>}


                        {extrachargesvisible && <Menu.Item onPress={async () => {
                            closeMenu();
                            await dispatch(setBottomSheet({
                                visible: true, height: '80%', component: () => <ExtraCharges/>
                            }))
                        }} title="Extra Charges"/>}


                        {isadjustment && <Menu.Item onPress={async () => {
                            closeMenu();
                            await dispatch(setBottomSheet({
                                visible: true, height: '80%', component: () => <Adjustment/>
                            }))
                        }} title="Adjustment"/>}


                    </Menu>
                </View>
            }
        })


    }, [visible])

    const {cancelorder, canapplydiscount}: any = localredux?.authData?.settings;

    const askPermission = (action: any) => {
        navigation.navigate('AskPermission', {cancelOrder: cancelOrder, action: action})
    }


    let tablet: any;
    let mobile: any;
    if (device.tablet) {
        tablet = {paddingHorizontal: 5, paddingVertical: 5}
    } else {
        mobile = {backgroundColor: styles.bg_light.backgroundColor, padding: 0}
    }



    return <Container style={[styles.p_3]}>
        {!device.tablet && <ClientDetail/>}
        <View style={[styles.h_100, styles.flex, mobile]}>
            <View style={[styles.bg_white, styles.flex]}>


                <View>
                    <PaxesSelection all={true}/>
                </View>

                <View style={[ styles.h_100, styles.flex, tablet]}>
                    <CartItems/>
                </View>

                <CartSummary navigation={navigation}/>
            </View>


        </View>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
