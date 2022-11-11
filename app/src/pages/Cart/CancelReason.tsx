import React, {useState} from "react";
import {FlatList, Text, View} from "react-native";
import {Divider, List, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import Button from "../../components/Button";
import {setAlert, setDialog} from "../../redux-store/reducer/component";
import {appLog, getTicketStatus, objToArray, printKOT, saveLocalOrder, voucherTotal} from "../../libs/function";
import {localredux, TICKET_STATUS} from "../../libs/static";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import store from "../../redux-store/store";
import { useNavigation } from "@react-navigation/native";



const Index = (props: any) => {

    const {type,kot,navigation,setKot} = props;
    const {reason}:any = localredux.initData;

    const reasonlist = reason[type];

    const [cancelreason,setCancelReason]:any = useState('')

    const dispatch = useDispatch()

    const confirmCancelOrder = async ({cancelreason, cancelreasonid}: any) => {
        try{
            navigation.replace('ClientAreaStackNavigator');
            await store.dispatch(updateCartField({
                cancelreason: cancelreason,
                cancelreasonid: cancelreasonid,
            }));

            const {kots}:any = store.getState().cartData;
            kots.map((kot:any)=>{
                printKOT({...kot,cancelreason:cancelreason});
            })
            await saveLocalOrder().then(async () => {
                store.dispatch(setAlert({visible:true,message:'Order cancelled'}))
            })
        }
        catch(e){
            appLog('e',e)
        }
    }


    const cancelKOT = ({cancelreason, cancelreasonid,kot}: any) => {

        let {invoiceitems,invoiceitemsdeleted,kots,vouchertaxtype}:any = store.getState().cartData;
        if(!Boolean(invoiceitemsdeleted)){
            invoiceitemsdeleted = []
        }

        const openTicketStatus = getTicketStatus(TICKET_STATUS.DECLINED);

        kot = {
            ...kot,
            ticketstatus: openTicketStatus?.statusid,
            ticketstatusname: "Cancelled",
            cancelreason: cancelreason,
            cancelreasonid: cancelreasonid,
        }
        const index = kots.findIndex(function (item: any) {
            return item.kotid === kot.kotid
        });
        kots = {
            ...kots,
            [index]: kot
        }

        printKOT(kot);

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
            vouchertotaldisplay:voucherTotal(remaininginvoiceitems,vouchertaxtype),
            invoiceitemsdeleted: newdeletedinvoiceitems
        }))
    }


    const renderitem = ({item}: any) => {
        return <><List.Item
            title={item.data}
            style={{padding:0}}
            onPress={async () => {
                setCancelReason(item)
            }}
        />
            <Divider/>
        </>
    }



    const handleSubmit = (values:any) => {
        if(type === 'ticketcancelreason'){
            cancelKOT({...values, kot});
        }
        else if(type === 'ordercancelreason'){
            confirmCancelOrder(values);
        }
        dispatch(setDialog({visible:false}))
    }

    return <View>
        <Form
            initialValues={{cancelreason:cancelreason.data,cancelreasonid:cancelreason.key}}
            onSubmit={handleSubmit}

            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View style={[styles.mb_5]}>
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


                    <View style={[styles.grid,styles.justifyContent,styles.mt_5]}>
                        <Button   secondbutton={true} onPress={() => dispatch(setDialog({visible: false}))}>Cancel</Button>
                        <Button   onPress={() => {handleSubmit(values)} }>Cancel {type === 'ticketcancelreason'?'KOT':'Order'}</Button>
                    </View>

                </>
            )}
        >
        </Form>
    </View>



}



export default  withTheme(Index);







