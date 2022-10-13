import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device} from "../../libs/static";
import CartActions from "./CartActions";
import {appLog, cancelOrder} from "../../libs/function";
import CartSummary from "./CartSummary";
import {Button, Divider, Menu } from "react-native-paper";
import {useNavigation} from "@react-navigation/native";


const Index = (props: any) => {

    const navigation = useNavigation()

    return <Container config={{title: 'Cart Detail',actions:()=> <Button onPress={()=>cancelOrder(navigation)}>Cancel</Button> }} hideappbar={device.tablet} {...props}  >
        {!device.tablet && <ClientDetail/>}
        <CartItems/>
        <CartSummary/>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
