import React from "react";
import Container from "../../components/Container";
import Tables from "./Tables";

import OrderTypes from "./OrderTypes";
import {View} from "react-native";

const Index = (props: any) => {


    return <Container hideappbar={true} config={{title: 'Tables', hideback: true, drawer: true}} {...props}>

        <OrderTypes/>

         <Tables/>

    </Container>
}


export default Index;

