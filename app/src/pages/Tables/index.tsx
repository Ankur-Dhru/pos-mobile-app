import React, {useEffect, useState } from "react";
import Container from "../../components/Container";
import Tables from "./Tables";

import OrderTypes from "./OrderTypes";
import {View} from "react-native";
import PageLoader from "../../components/PageLoader";

const Index = (props: any) => {

    const {navigation} = props

    const [loaded,setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(()=>{
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if(!loaded){
        return <PageLoader page={'table'} />
    }

    //return <PageLoader page={'table'} />

    return <Container hideappbar={true} config={{title: 'Tables', hideback: true, drawer: true}} {...props}>

        <OrderTypes/>

         <Tables/>

    </Container>
}


export default Index;

