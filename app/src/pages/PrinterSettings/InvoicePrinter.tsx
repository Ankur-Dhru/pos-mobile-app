import React, {useEffect} from "react";
import {List} from "react-native-paper"
import {appLog} from "../../libs/function";
import Container from "../../components/Container";
import {connect} from "react-redux";
import {localredux, PRINTER} from "../../libs/static";
import EscPosPrinter from 'react-native-esc-pos-printer';
import {useNavigation} from "@react-navigation/native";

const InvoicePrinter = ({printers}: any) => {

    const navigation: any = useNavigation()

    const {currentLocation: {departments}} = localredux.localSettingsData;

    useEffect(() => {
        EscPosPrinter.discover()
            .then((printers) => {
                appLog(printers);
            })
            .catch((e) => console.log('Print error:', e.message));
    }, [])

    const setPrinter = (value?: any) => {
        navigation.navigate('PrinterSettings', {type: value})
    }


    return <Container>
        <List.Section>
            <List.Item
                title="Invoice"
                description={Boolean(printers[PRINTER.INVOICE]?.ip) && printers[PRINTER.INVOICE]?.ip}
                onPress={() => {
                    setPrinter({name: 'Invoice', departmentid: PRINTER.INVOICE})
                }}
                left={() => <List.Icon icon="printer"/>}
                right={() => Boolean(printers[PRINTER.INVOICE]) && <List.Icon icon="check"/>}
            />
        </List.Section>
    </Container>

}


const mapStateToProps = (state: any) => ({
    printers: state.localSettings?.printers || {}
})

export default connect(mapStateToProps)(InvoicePrinter);

