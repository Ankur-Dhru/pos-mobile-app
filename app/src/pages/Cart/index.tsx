import React, {useEffect, useState} from "react";
import {isRestaurant} from "../../libs/function";
import Cart from "./Cart";
import {localredux, PRODUCTCATEGORY} from "../../libs/static";
import {useDispatch} from "react-redux";
import {withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {resetCart, setCartData,} from "../../redux-store/reducer/cart-data";
import {ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";

const Index = ({tabledetails}: any) => {

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const hasrestaurant = isRestaurant();
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const [loaded,setLoaded] = useState(false)

    useEffect(() => {
        dispatch(resetCart())
        dispatch(setCartData(tabledetails))
        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))
    }, [])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(()=>{
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);


    if(!loaded){
        return <PageLoader />
    }

    return <Cart tabledetails={tabledetails}/>

    /*return <Container  config={{
        title: tabledetails?.tablename || 'Retail',
        backAction: () => {
            saveTempLocalOrder().then(() => {})
        },
        actions:()=><Appbar.Action
                        icon={()=><ProIcon name={'print'}
                               color={'white'}
                               action_type={'text'} />}
                                onPress={() => {
                                    dispatch(setBottomSheet({
                                        visible: true,
                                        fullView: true,
                                        height:'100%',
                                        component: ()=> <SearchItem/>
                                    }))
                                }}
                        />,
        drawer: !hasrestaurant,
        hideback: !hasrestaurant
    }}>
        <Cart tabledetails={tabledetails}   />
    </Container>*/
}


export default withTheme(Index);
