import React, {useEffect, useState} from "react";
import Container from "../../components/Container";
import {appLog, isRestaurant, retrieveData, saveTempLocalOrder} from "../../libs/function";
import Cart from "./Cart";
import {localredux, PRODUCTCATEGORY} from "../../libs/static";
import {useDispatch} from "react-redux";
import {Appbar, withTheme} from "react-native-paper";
import {setSelectedData} from "../../redux-store/reducer/selected-data";
import SearchItem from "../Items/SearchItem";
import ProIcon from "../../components/ProIcon";
import {setBottomSheet} from "../../redux-store/reducer/component";

const Index = ({tabledetails}: any) => {

    const mainproductgroupid = localredux.localSettingsData?.currentLocation?.mainproductgroupid || PRODUCTCATEGORY.DEFAULT

    const hasrestaurant = isRestaurant();
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(setSelectedData({group:mainproductgroupid}))
    }, [])

    return <Cart tabledetails={tabledetails}   />

    return <Container  config={{
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
    </Container>
}



export default  withTheme(Index);
