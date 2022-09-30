import React, {useEffect} from "react";
import {isRestaurant} from "../../libs/function";
import Cart from "./Cart";
import {localredux, PRODUCTCATEGORY} from "../../libs/static";
import {useDispatch} from "react-redux";
import {withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {resetCart, setCartData,} from "../../redux-store/reducer/cart-data";

const Index = ({tabledetails}: any) => {

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const hasrestaurant = isRestaurant();
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(resetCart())
        dispatch(setCartData(tabledetails))
        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))
    }, [])

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
