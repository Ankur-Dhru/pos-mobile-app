import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device} from "../../libs/static";
import CartActions from "./CartActions";
import CartSummary from "./CartSummary";

const Index = (props: any) => {

    return <Container>
        {!device.tablet && <ClientDetail/>}
        <CartItems/>
        <CartSummary/>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
