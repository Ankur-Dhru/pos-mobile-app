import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device} from "../../libs/static";
import CartActions from "./CartActions";
import CartSummary from "./CartSummary";
import {useNavigation} from "@react-navigation/native";
import {Menu} from "react-native-paper";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import ProIcon from "../../components/ProIcon";
import {cancelOrder} from "../../libs/function";

const Index = (props: any) => {

    const navigation: any = useNavigation();
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);


    navigation.setOptions({
        headerRight:()=>{
            return <View>

                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<TouchableOpacity onPress={() => {
                        openMenu()
                    }} >
                        <ProIcon name={'ellipsis-vertical'}/>
                    </TouchableOpacity>}>
                    <Menu.Item onPress={() => cancelOrder(navigation).then()} title="Cancel Order"/>

                </Menu>
            </View>
        }
    })


    return <Container>
        {!device.tablet && <ClientDetail/>}
        <CartItems/>
        <CartSummary navigation={navigation}/>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
