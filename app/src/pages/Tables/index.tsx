import React, {useEffect, useState} from "react";
import Container from "../../components/Container";
import Tables from "./Tables";

import PageLoader from "../../components/PageLoader";

const Index = (props: any) => {

    const {navigation} = props;


    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader page={'table'}/>
    }


    return <Container style={{padding:0}}>
        <Tables/>
    </Container>
}


export default Index;

