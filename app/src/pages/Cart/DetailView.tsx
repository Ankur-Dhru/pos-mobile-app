import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device} from "../../libs/static";
import CartActions from "./CartActions";
import CartSummary from "./CartSummary";
import {useNavigation} from "@react-navigation/native";
import {Appbar, Card, Menu} from "react-native-paper";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import ProIcon from "../../components/ProIcon";
import {cancelOrder, isRestaurant} from "../../libs/function";
import Button from "../../components/Button";
import DeleteButton from "../../components/Button/DeleteButton";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {useDispatch} from "react-redux";
import HoldOrders from "./HoldOrders";

const Index = (props: any) => {

    const navigation: any = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const dispatch = useDispatch()



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
                                cancelOrder(navigation).then(r => {})
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
                </Menu>
            </View>
        }
    })

    let tablet:any;

    if(device.tablet){
        tablet = {padding:0}
    }

    return <Container style={{...tablet, paddingBottom: 0}}>
        {!device.tablet && <ClientDetail/>}
        <Card style={[styles.card,styles.flex]}>
            <Card.Content style={[styles.cardContent]}>
                <CartItems/>
            </Card.Content>
        </Card>
        <CartSummary navigation={navigation}/>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
