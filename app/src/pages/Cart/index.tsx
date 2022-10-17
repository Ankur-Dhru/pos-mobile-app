import React, {useEffect, useState} from "react";
import {appLog, isRestaurant, retrieveData, saveTempLocalOrder, voucherData} from "../../libs/function";
import Cart from "./Cart";
import {localredux, PRODUCTCATEGORY, VOUCHER} from "../../libs/static";
import {useDispatch} from "react-redux";
import {withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {Container} from "../../components";
import {hideLoader, setDialog, showLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import KeyPad from "../../components/KeyPad";
import ClientAndSource from "./ClientAndSource";

const Index = ({tabledetails}: any) => {

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const hasrestaurant = isRestaurant();
    const dispatch = useDispatch();
    const navigation = useNavigation()


    useEffect(() => {
        const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
        dispatch(refreshCartData({...tabledetails, ...voucherDataJson}))
        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))


        if ((Boolean(tabledetails?.ordertype) && tabledetails?.ordertype !== "tableorder") && !Boolean(tabledetails?.tableorderid)) {
            dispatch(setDialog({
                visible: true,
                title: "Source & Client",
                hidecancel: true,
                width: 'auto',
                component: () => <ClientAndSource navigation={navigation} tabledetails={tabledetails}/>
            }))
        }

    }, [])

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
        return <PageLoader page={'cart'}/>
    }

    return <Cart tabledetails={tabledetails}/>
}


export default withTheme(Index);
