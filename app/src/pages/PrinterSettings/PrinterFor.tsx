import React from "react";
import {isRestaurant} from "../../libs/function";
import {ScrollView, View} from "react-native";
import {Card, List} from "react-native-paper";
import {styles} from "../../theme";
import {useNavigation} from "@react-navigation/native";
import {ItemDivider, PRINTER} from "../../libs/static";

import {Container} from "../../components";


const PrinterFor = () => {

    const navigation = useNavigation()


    return <Container>


        <View style={[styles.middle]}>

            <View style={[styles.middleForm, {maxWidth: 600}]}>


                <ScrollView keyboardShouldPersistTaps='handled' style={[styles.h_100]}>


                    <View>


                        {<View>
                            <View>

                                <Card style={[styles.card]}>
                                    <Card.Content style={[styles.cardContent]}>

                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Invoice / Receipt Printer"
                                            onPress={() => {
                                                navigation.navigate('PrinterSettings', {
                                                    type: {
                                                        name: 'Invoice',
                                                        departmentid: PRINTER.INVOICE
                                                    }
                                                })
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>


                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Sales Return Printer"
                                            onPress={() => {
                                                navigation.navigate('PrinterSettings', {
                                                    type: {
                                                        name: 'Sales Return',
                                                        departmentid: PRINTER.SALESRETURN
                                                    }
                                                })
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>


                                        <List.Item
                                            style={[styles.listitem]}
                                            title="Day End Report Printer"
                                            onPress={() => {
                                                navigation.navigate('PrinterSettings', {
                                                    type: {
                                                        name: 'Day End Report',
                                                        departmentid: PRINTER.DAYENDREPORT
                                                    }
                                                })
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />

                                        <ItemDivider/>


                                        {isRestaurant() && <List.Item
                                            style={[styles.listitem]}
                                            title="Kitchen / KOT Printer"
                                            onPress={() => {
                                                navigation.navigate("KOTPrinter");
                                            }}
                                            left={() => <List.Icon icon="printer-outline"/>}
                                            right={() => <List.Icon icon="chevron-right"/>}
                                        />}



                                    </Card.Content>
                                </Card>


                                <View style={{marginTop: 'auto'}}>


                                </View>
                            </View>
                        </View>}


                    </View>

                </ScrollView>
            </View>
        </View>


    </Container>
}


export default PrinterFor;


