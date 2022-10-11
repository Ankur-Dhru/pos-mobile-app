import React, {useEffect, useState} from "react";
import {isRestaurant, saveTempLocalOrder, voucherData} from "../../libs/function";
import Cart from "./Cart";
import {localredux, PRODUCTCATEGORY, VOUCHER} from "../../libs/static";
import {useDispatch} from "react-redux";
import {withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import { Container } from "../../components";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";

const Index = ({tabledetails}: any) => {

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const hasrestaurant = isRestaurant();
    const dispatch = useDispatch();
    const navigation = useNavigation()


    useEffect(() => {
        const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
        dispatch(refreshCartData({...tabledetails,...voucherDataJson}))
        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))
    }, [])


    /*const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);
    if (!loaded) {
        return <PageLoader page={'cart'}/>
    }*/

    return <Cart tabledetails={tabledetails}/>
}


export default withTheme(Index);
