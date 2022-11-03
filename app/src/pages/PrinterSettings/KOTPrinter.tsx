import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, List, Paragraph} from "react-native-paper"
import {appLog, getDateWithFormat, isEmpty, retrieveData, storeData, toCurrency} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, localredux, METHOD, posUrl, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import {setOrder} from "../../redux-store/reducer/orders-data";
import Button from "../../components/Button";
import store from "../../redux-store/store";
import {setDialog, setModal} from "../../redux-store/reducer/component";
import CancelReason from "../Cart/CancelReason";
import Setting from "./Setting";
import EscPosPrinter from 'react-native-esc-pos-printer';
import {
    PRINTER,
} from "../../libs/static";

const KOTPrinter = ({printers}:any) => {

    const dispatch = useDispatch()

    const {currentLocation: {departments}} = localredux.localSettingsData;

    useEffect(() => {
        EscPosPrinter.discover()
            .then((printers) => {
                appLog(printers);
            })
            .catch((e) => console.log('Print error:', e.message));
    }, [])

    const setPrinter = (value?:any) => {
        store.dispatch(setModal({
            visible: true,
            title:value.name +' Printer',
            hidecancel: true,
            component: () => <Setting type={value} />
        }))
    }


    return <Container config={{
        title: "KOT Printers",
    }}>
        <List.Section>

            {
                departments.map((department:any,index:any)=>{
                    const detail = printers[department.departmentid];
                    return <List.Item
                        key={index}
                        title={department.name}
                        description={Boolean(detail?.ip) && detail.ip}
                        onPress={()=>{
                            setPrinter({ name: department.name,departmentid: department.departmentid })
                        }}
                        left={() => <List.Icon  icon="printer" />}
                        right={() => Boolean(detail) && <List.Icon icon="check" />}
                    />
                })
            }

        </List.Section>
    </Container>

}


const mapStateToProps = (state: any) => ({
    printers: state.localSettings?.printers || {}
})

export default connect(mapStateToProps)(KOTPrinter);

