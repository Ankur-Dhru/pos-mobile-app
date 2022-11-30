import React, {useState} from "react";
import {FlatList, SafeAreaView, View} from "react-native";
import {Divider, List, Title, withTheme} from "react-native-paper";
import {useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import Button from "../../components/Button";
import {setAlert, setDialog} from "../../redux-store/reducer/component";
import {
    appLog,
    deleteTempLocalOrder,
    getTicketStatus,
    objToArray,
    printKOT,
    saveLocalOrder,
    voucherTotal
} from "../../libs/function";
import {localredux, PRINTER, TICKET_STATUS} from "../../libs/static";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import store from "../../redux-store/store";
import {CommonActions} from "@react-navigation/native";
import Container from "../../components/Container";
import KeyboardScroll from "../../components/KeyboardScroll";


const Index = (props: any) => {

    const {navigation,route} = props;

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

            const {kots,tableorderid}: any = store.getState().cartData;
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
            title={item.data}

            onPress={async () => {
                setCancelReason(item)
            }}
        />
            <Divider/>
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
                        <KeyboardScroll>
                            <View>

                                <View style={[styles.mb_5,styles.px_5]}>
                                    <Field name="cancelreason">
                                        {props => (
                                            <InputBox
                                                {...props}
                                                value={props.input.value}
                                                label={'Cancel Reason'}
                                                autoFocus={false}
                                                onChange={props.input.onChange}
                                            />
                                        )}
                                    </Field>
                                </View>


                                <FlatList
                                    data={objToArray(reasonlist)}
                                    keyboardDismissMode={'on-drag'}
                                    keyboardShouldPersistTaps={'always'}
                                    renderItem={renderitem}
                                    initialNumToRender={5}
                                />

                            </View>
                        </KeyboardScroll>


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







