import React, {useState} from "react";
import {FlatList, SafeAreaView, View} from "react-native";
import {Card, List, withTheme} from "react-native-paper";
import {useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import Button from "../../components/Button";
import {appLog, deleteTempLocalOrder, getTicketStatus, objToArray, printKOT, voucherTotal} from "../../libs/function";
import {ItemDivider, localredux, TICKET_STATUS} from "../../libs/static";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import store from "../../redux-store/store";
import {CommonActions} from "@react-navigation/native";
import Container from "../../components/Container";


const Index = (props: any) => {

    const {navigation, route} = props;

    const type = route?.params?.type;
    const setKot = route?.params?.setKot;
    const kot = route?.params?.kot;

    const {reason}: any = localredux.initData;

    const {adminid} = localredux.authData;

    const reasonlist = reason[type];

    const [cancelreason, setCancelReason]: any = useState('')

    const dispatch = useDispatch()

    const confirmCancelOrder = async ({cancelreason, cancelreasonid}: any) => {
        try {

            await store.dispatch(updateCartField({
                cancelreason: cancelreason,
                cancelreasonid: cancelreasonid,
            }));

            const {kots, tableorderid}: any = store.getState().cartData;
            kots.map((kot: any) => {
                printKOT({...kot, cancelreason: cancelreason, cancelled: true, adminid: adminid,});
            })

            deleteTempLocalOrder(tableorderid).then();

            /*await saveLocalOrder().then(async () => {
                store.dispatch(setAlert({visible: true, message: 'Order cancelled'}))
            })*/

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'ClientAreaStackNavigator'},
                    ],
                })
            );

        } catch (e) {
            appLog('e', e)
        }
    }


    const cancelKOT = ({cancelreason, cancelreasonid, kot}: any) => {

        let {invoiceitems, invoiceitemsdeleted, kots, vouchertaxtype}: any = store.getState().cartData;
        if (!Boolean(invoiceitemsdeleted)) {
            invoiceitemsdeleted = []
        }

        const openTicketStatus = getTicketStatus(TICKET_STATUS.DECLINED);



        kot = {
            ...kot,
            ticketstatus: openTicketStatus?.statusid,
            ticketstatusname: "Cancelled",
            cancelreason: cancelreason,
            cancelled: true,
            adminid: adminid,
            cancelreasonid: cancelreasonid,
        }
        const index = kots.findIndex(function (item: any) {
            return item.kotid === kot.kotid
        });
        kots = {
            ...kots,
            [index]: kot
        }



        printKOT(kot).then();

        setKot(kot);

        const remaininginvoiceitems = invoiceitems.filter(function (item: any) {
            return item.kotid !== kot.kotid
        });

        const addtoinvoiceitemsdeleted = invoiceitems.filter(function (item: any) {
            return item.kotid === kot.kotid
        });
        const newdeletedinvoiceitems = invoiceitemsdeleted.concat(addtoinvoiceitemsdeleted);

        store.dispatch(updateCartField({
            kots: Object.values(kots),
            invoiceitems: remaininginvoiceitems,
            vouchertotaldisplay: voucherTotal(remaininginvoiceitems, vouchertaxtype),
            invoiceitemsdeleted: newdeletedinvoiceitems
        }))

        navigation.goBack()
    }


    const renderitem = ({item}: any) => {
        return <><List.Item
            style={[styles.listitem]}
            title={item.data}
            onPress={async () => {
                setCancelReason(item)
            }}
            right={() => <List.Icon icon="chevron-right"/>}
        />

        </>
    }


    const handleSubmit = (values: any) => {
        if (type === 'ticketcancelreason') {
            cancelKOT({...values, kot});
        } else if (type === 'ordercancelreason') {
            confirmCancelOrder(values).then();
        }
    }

    return <Container>
        <SafeAreaView>
            <Form
                initialValues={{cancelreason: cancelreason.data, cancelreasonid: cancelreason.key}}
                onSubmit={handleSubmit}

                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View style={[styles.middle]}>
                        <View style={[styles.middleForm]}>
                            <View style={[styles.h_100, styles.flex]}>
                                <View>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>
                                            <Field name="cancelreason">
                                                {props => (
                                                    <InputBox
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'Cancel Reason'}
                                                        autoFocus={true}
                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </Card.Content>
                                    </Card>


                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>
                                            <FlatList
                                                data={objToArray(reasonlist)}
                                                keyboardDismissMode={'on-drag'}
                                                keyboardShouldPersistTaps={'always'}
                                                renderItem={renderitem}
                                                ItemSeparatorComponent={ItemDivider}
                                                initialNumToRender={5}
                                            />
                                        </Card.Content>
                                    </Card>

                                </View>
                            </View>


                            <View style={[styles.submitbutton]}>
                                <Button onPress={() => {
                                    handleSubmit(values)
                                }}>Cancel {type === 'ticketcancelreason' ? 'KOT' : 'Order'}</Button>
                            </View>

                        </View>
                    </View>

                )}
            >
            </Form>
        </SafeAreaView>
    </Container>


}


export default withTheme(Index);







