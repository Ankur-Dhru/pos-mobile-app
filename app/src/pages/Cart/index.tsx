import React, {useEffect, useState} from "react";
import {isRestaurant, saveTempLocalOrder, voucherData} from "../../libs/function";
import Cart from "./Cart";
import {device, localredux, PRODUCTCATEGORY, VOUCHER} from "../../libs/static";
import {useDispatch} from "react-redux";
import {withTheme} from "react-native-paper";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {refreshCartData} from "../../redux-store/reducer/cart-data";
import {useNavigation} from "@react-navigation/native";
import PageLoader from "../../components/PageLoader";
import {TouchableOpacity, View} from "react-native";
import ProIcon from "../../components/ProIcon";
import SearchItem from "../Items/SearchItem";
import store from "../../redux-store/store";

const Index = (props: any) => {

    const tabledetails: any = props?.route?.params;

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const dispatch = useDispatch();
    const navigation = useNavigation()


    useEffect(() => {
        const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
        dispatch(refreshCartData({...tabledetails, ...voucherDataJson}));

        if(tabledetails?.printcounter){
            navigation.navigate('DetailViewNavigator')
        }

        dispatch(setSelected({value: mainproductgroupid, field: 'group'}))

    }, [])


    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if (e.data?.action?.type === 'POP') {
                    e.preventDefault();
                    const {ordertype}: any = store.getState().cartData;
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
            headerLeft: () => <View>
                <TouchableOpacity   onPress={() => {
                    navigation.navigate('ProfileSettingsNavigator')
                }}>
                    <ProIcon name={'bars'}/>
                </TouchableOpacity>
            </View>
        })
    }

    if (!device.tablet) {
        navigation.setOptions({
            headerRight: () => <View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SearchItem')
                    }}>
                    <ProIcon name={'magnifying-glass'}/>
                </TouchableOpacity>
            </View>
        })
    }



    return <Cart tabledetails={tabledetails}/>
}


export default withTheme(Index);
