import React, {useEffect, useState} from "react";
import {appLog, getTempOrders, isRestaurant, saveTempLocalOrder, voucherData} from "../../libs/function";
import Cart from "./Cart";
import {device, localredux, PRODUCTCATEGORY, VOUCHER} from "../../libs/static";
import {useDispatch} from "react-redux";
import {Appbar, withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {refreshCartData, setCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {TouchableOpacity, View} from "react-native";
import ProIcon from "../../components/ProIcon";
import SearchItem from "../Items/SearchItem";
import store from "../../redux-store/store";
import {setDialog} from "../../redux-store/reducer/component";
import Paxes from "../Tables/Paxes";

const Index = (props: any) => {

    const tabledetails: any = props?.route?.params;

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const dispatch = useDispatch();
    const navigation = useNavigation()


    useEffect(() => {
        const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
        dispatch(refreshCartData({...tabledetails, ...voucherDataJson}));

        if(tabledetails?.printcounter && !device.tablet){
            navigation.navigate('DetailViewNavigator')
        }

        if(tabledetails.invoiceitems.length === 0 && (tabledetails.ordertype === 'tableorder')){
            dispatch(setDialog({
                visible: true,
                title: "Paxes",
                hidecancel: true,
                component: () => <Paxes />
            }))
        }

        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))

    }, [])


    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if (e.data?.action?.type === 'POP') {
                    e.preventDefault();
                    const {cartData:{ordertype}}: any = store.getState();
                    if(ordertype !== 'qsr') {
                        saveTempLocalOrder().then(() => {})
                    }
                    navigation.dispatch(e.data.action)
                }
            }),
        [navigation]
    );


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

    navigation.setOptions({
        headerTitle: tabledetails?.tablename || 'Retail Order',
    })

    if (!isRestaurant()) {
        navigation.setOptions({
            headerLeft: () =>  <Appbar.Action icon="menu" onPress={() => navigation.navigate('ProfileSettingsNavigator')}/>
        })
    }

    if (!device.tablet) {
        navigation.setOptions({
            headerRight: () => <Appbar.Action icon={'magnify'} onPress={() => {
                navigation.navigate('SearchItem')
            }}/>
        })
    }

    return <Cart tabledetails={tabledetails}/>
}


export default withTheme(Index);
