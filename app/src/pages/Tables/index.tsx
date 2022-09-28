import React from "react";
import Container from "../../components/Container";
import Tables from "./Tables";
import {appLog} from "../../libs/function";

const Index = (props: any) => {

    const {navigation} = props;

    return <Container config={{title: 'Tables', hideback: true, drawer: true}} {...props}>
        <Tables navigation={navigation}/>
    </Container>
}


export default Index;

