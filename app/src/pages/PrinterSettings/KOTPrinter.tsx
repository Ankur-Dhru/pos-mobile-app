import React, {useEffect} from "react";
import {Card, Divider, List} from "react-native-paper"
import {appLog} from "../../libs/function";
import Container from "../../components/Container";
import {connect, useDispatch} from "react-redux";
import {ItemDivider, localredux} from "../../libs/static";
import EscPosPrinter from 'react-native-esc-pos-printer';
import {useNavigation} from "@react-navigation/native";
import {styles} from "../../theme";

const KOTPrinter = ({printers}: any) => {

    const navigation:any = useNavigation()

    const {currentLocation: {departments}} = localredux.localSettingsData;

    /*useEffect(() => {
        EscPosPrinter.discover()
            .then((printers) => {
                appLog(printers);
            })
            .catch((e) => console.log('Print error:', e.message));
    }, [])*/

    const setPrinter = (value?: any) => {
        navigation.navigate('PrinterSettings', {type: value})
    }


    return <Container>
        <Card style={[styles.card]}>
            <Card.Content  style={[styles.cardContent]}>


            {
                departments.map((department: any, index: any) => {
                    return <><List.Item
                        style={[styles.listitem]}
                        key={index}
                        title={department.name}
                        onPress={() => {
                            setPrinter({name: department.name, departmentid: department.departmentid})
                        }}
                        right={() =>  <List.Icon icon="chevron-right"/>}
                    />
                        <ItemDivider/>
                    </>
                })
            }




            </Card.Content>
        </Card>
    </Container>

}


const mapStateToProps = (state: any) => ({
    printers: state.localSettings?.printers || {}
})

export default connect(mapStateToProps)(KOTPrinter);

