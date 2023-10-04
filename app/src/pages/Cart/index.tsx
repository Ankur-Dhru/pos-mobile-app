import React, {useEffect, useState} from "react";
import {
    checkPrinterSettings,
    getLocalSettings,
    isRestaurant,
    prelog,
    saveLocalSettings,
    saveTempLocalOrder,
    voucherData
} from "../../libs/function";
import Cart from "./Cart";
import {device, localredux, PRINTER, PRODUCTCATEGORY, VOUCHER} from "../../libs/static";
import {connect, useDispatch} from "react-redux";
import {Appbar, Menu} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {refreshCartData, updateCartField} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";

import SearchItem from "../Items/SearchItem";
import store from "../../redux-store/store";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import Paxes from "../Tables/Paxes";
import {setTableOrders} from "../../redux-store/reducer/table-orders-data";
import HoldOrders from "./HoldOrders";
import crashlytics from "@react-native-firebase/crashlytics";
import InvoicesList from "./InvoicesList";
import OnlineorderList from "./OnlineorderList";


const Index = (props: any) => {

    const tabledetails: any = props?.route?.params;

    const {advancecartview, orderbypax, pax} = props;

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [loaded, setLoaded] = useState(false)
    const [gridView, setGridView] = useState(false)

    device.tablet = Boolean(advancecartview)

    useEffect(() => {


        crashlytics().log('cart useffect');

        const voucherDataJson: any = voucherData(tabledetails?.vouchertypeid ? tabledetails.vouchertypeid : VOUCHER.INVOICE, false);


        const {kots, numOfKOt}: any = tabledetails || {}

        if (kots?.length > 0 || numOfKOt > 0) {
            let {staffid, staffname, ...others}: any = voucherDataJson;
            dispatch(refreshCartData({...tabledetails, ...others}));
        } else {
            dispatch(refreshCartData({...voucherDataJson,...tabledetails}));
        }


        if (tabledetails?.printcounter && !device.tablet) {
            navigation.navigate('DetailViewNavigator')
        }


        if (tabledetails?.invoiceitems?.length === 0 && (tabledetails?.ordertype === 'tableorder')) {
            if (!props.disabledpax) {
                dispatch(setDialog({
                    visible: true,
                    title: "Paxes",
                    hidecancel: true,
                    component: () => <Paxes selectedpaxes = {tabledetails.paxes}/>
                }))
            }
        }

        getLocalSettings(`gridview-${localredux.authData.adminid}`).then((data: any) => {
            setGridView(data)
        })
        dispatch(setSelected({value: [mainproductgroupid], field: 'group'}))

    }, [])



    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if ((e.data?.action?.type === 'POP') || (e.data?.action?.type === 'GO_BACK')) {
                    e.preventDefault();
                    const {cartData: {ordertype, invoiceitems}}: any = store.getState();
                    if (ordertype !== 'qsr') {
                        if (Boolean(invoiceitems.length)) {
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


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                setLoaded(true)
            })
        });
        return unsubscribe;
    }, []);


    useEffect(()=>{

        navigation.setOptions({
            headerTitle: tabledetails?.tablename || 'Retail Order',
        })
        if (!isRestaurant()) {
            navigation.setOptions({
                headerLeft: () => <Appbar.Action icon="menu"   onPress={() => navigation.navigate('ProfileSettingsNavigator')}/>
            })
        }


        if (!device.tablet) {
            navigation.setOptions({
                headerRight: () => <>

                    <Appbar.Action icon={'magnify'} onPress={() => {
                        navigation.navigate('SearchItem')
                    }}/>


                    {<Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => {
                            openMenu()
                        }}/>}>

                        <Menu.Item onPress={async () => {
                            closeMenu()
                            let view = !gridView;
                            saveLocalSettings(`gridview-${localredux?.authData?.adminid}`, view).then();
                            setGridView(view)
                        }} title={!gridView ? 'Grid View' : 'List View'}/>


                        {pax > 1 && isRestaurant() && <Menu.Item onPress={async () => {
                            closeMenu()
                            dispatch(updateCartField({orderbypax: !orderbypax}))
                        }} title={`${orderbypax ? 'Disabled' : 'Enable'} by Pax`}/>}


                        {!isRestaurant() && <><Menu.Item onPress={async () => {
                            closeMenu()
                            await dispatch(setBottomSheet({
                                visible: true,
                                height: '90%',
                                component: () => <HoldOrders/>
                            }))
                        }} title="Holding Orders"/><Menu.Item onPress={async () => {
                            closeMenu()
                            await dispatch(setBottomSheet({
                                visible: true,
                                height: '90%',
                                component: () => <InvoicesList/>
                            }))
                        }} title="Invoices"/></>}




                        {isRestaurant() && <Menu.Item onPress={async () => {
                            closeMenu()
                            await dispatch(setBottomSheet({
                                visible: true,
                                height: '90%',
                                component: () => <OnlineorderList/>
                            }))
                        }} title="Online Orders"/> }


                        {/*{isRestaurant() && <Menu.Item onPress={async () => {
                        closeMenu();
                        navigation?.navigate('UpdateOrderInfo')
                    }} title="Update basic info"/>}*/}


                    </Menu>}

                </>
            })
        }

    },[visible])



    if (!loaded) {
        return <PageLoader page={'cart'}/>
    }


    return <Cart tabledetails={tabledetails}   gridView={gridView}/>

}


const mapStateToProps = (state: any) => ({
    disabledpax: state.localSettings?.disabledpax,
    advancecartview: state.localSettings?.advancecartview,
    orderbypax: state.cartData.orderbypax,
    pax: state.cartData.pax,
})

export default connect(mapStateToProps)(Index);

