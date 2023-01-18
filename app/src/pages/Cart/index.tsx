import React, {useEffect, useState} from "react";
import {
    appLog,
    cancelOrder,
    getLocalSettings,
    getTempOrders,
    isRestaurant,
    saveTempLocalOrder,
    voucherData
} from "../../libs/function";
import Cart from "./Cart";
import {device, localredux, METHOD, PRODUCTCATEGORY, STATUS, urls, VOUCHER} from "../../libs/static";
import {connect, useDispatch} from "react-redux";
import {Appbar, Menu, withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {refreshCartData, setCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";

import SearchItem from "../Items/SearchItem";
import store from "../../redux-store/store";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import Paxes from "../Tables/Paxes";
import {setTableOrders} from "../../redux-store/reducer/table-orders-data";
import HoldOrders from "./HoldOrders";
import DeleteButton from "../../components/Button/DeleteButton";
import apiService from "../../libs/api-service";

const Index = (props: any) => {

    const tabledetails: any = props?.route?.params;

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);


    useEffect(() => {
        const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
        dispatch(refreshCartData({...tabledetails, ...voucherDataJson}));



            if (tabledetails?.printcounter && !device.tablet) {
                navigation.navigate('DetailViewNavigator')
            }

            if (tabledetails?.invoiceitems.length === 0 && (tabledetails?.ordertype === 'tableorder')) {

                if (!props.disabledpax) {
                    dispatch(setDialog({
                        visible: true,
                        title: "Paxes",
                        hidecancel: true,
                        component: () => <Paxes/>
                    }))
                }

            }

        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))

    }, [])


    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if ((e.data?.action?.type === 'POP') || (e.data?.action?.type === 'GO_BACK')) {
                    e.preventDefault();
                    const {cartData:{ordertype,invoiceitems}}: any = store.getState();
                    if(ordertype !== 'qsr') {
                        if(Boolean(invoiceitems.length)) {
                            saveTempLocalOrder().then((order: any) => {
                                dispatch(setTableOrders(order))
                            })
                        }
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
            headerRight: () =><><Appbar.Action icon={'magnify'} onPress={() => {
                navigation.navigate('SearchItem')
            }}/>

                {!isRestaurant() &&   <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                        openMenu()
                    }}/>}>


                    {!isRestaurant() && <Menu.Item onPress={async () => {
                        closeMenu()
                        await dispatch(setBottomSheet({
                            visible: true,
                            height: '50%',
                            component: () => <HoldOrders/>
                        }))
                    }} title="Holding Orders"/>}
                </Menu>}

            </>
        })
    }

    return <Cart tabledetails={tabledetails}/>
}


const mapStateToProps = (state: any) => ({
    disabledpax: state.localSettings?.disabledpax,
})

export default connect(mapStateToProps)(Index);

