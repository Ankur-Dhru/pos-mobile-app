import React, {useEffect, useState} from "react";
import Container from "../../components/Container";
import Tables from "./Tables";

import PageLoader from "../../components/PageLoader";
import {useDispatch} from "react-redux";

const Index = (props: any) => {

    const {navigation} = props;
    const dispatch = useDispatch()

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

    /*React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                Alert.alert(
                    'Alert',
                    'Want to exit app?',
                    [
                        { text: "Don't exit", style: 'cancel', onPress: () => {} },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ]
                );
            }),
        [navigation]
    );*/


    return <Container>
        <Tables/>
    </Container>
}


export default Index;

