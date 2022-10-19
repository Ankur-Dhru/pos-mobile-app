import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device} from "../../libs/static";
import CartActions from "./CartActions";
import {cancelOrder} from "../../libs/function";
import CartSummary from "./CartSummary";
import {useNavigation} from "@react-navigation/native";
import Button from "../../components/Button";
import {styles} from "../../theme";


const Index = (props: any) => {

    const navigation = useNavigation()

    return <Container config={{title: 'Cart Detail',actions:()=> <Button more={{backgroundColor:styles.red.color}} compact={true} onPress={()=>cancelOrder(navigation)}>Cancel</Button> }} hideappbar={device.tablet} {...props}  >
        {!device.tablet && <ClientDetail/>}
        <CartItems/>
        <CartSummary/>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
