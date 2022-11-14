import React, {useEffect} from "react";
import {List} from "react-native-paper"
import {appLog} from "../../libs/function";
import Container from "../../components/Container";
import {connect, useDispatch} from "react-redux";
import {localredux} from "../../libs/static";
import EscPosPrinter from 'react-native-esc-pos-printer';
import {useNavigation} from "@react-navigation/native";

const KOTPrinter = ({printers}: any) => {

    const navigation:any = useNavigation()

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

            {
                departments.map((department: any, index: any) => {
                    const detail = printers[department.departmentid];
                    return <List.Item
                        key={index}
                        title={department.name}
                        description={Boolean(detail?.host) && detail.host}
                        onPress={() => {
                            setPrinter({name: department.name, departmentid: department.departmentid})
                        }}
                        left={() => <List.Icon icon="printer"/>}
                        right={() => Boolean(detail) && <List.Icon icon="check"/>}
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

