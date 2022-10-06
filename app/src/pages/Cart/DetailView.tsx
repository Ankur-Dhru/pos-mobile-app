import React from "react";

import Container from "../../components/Container";

import CartItems from "./CartItems";
import ClientDetail from "../Client/ClientDetail";
import {device} from "../../libs/static";
import CartActions from "./CartActions";
import {appLog} from "../../libs/function";
import CartSummary from "./CartSummary";


const Index = (props: any) => {


    return <Container config={{title: 'Cart Detail'}} hideappbar={device.tablet} {...props}  >
        {/*<ClientDetail/>*/}
        <CartItems/>
        <CartSummary/>
        {!device.tablet && <CartActions/>}
    </Container>
}


export default Index;
