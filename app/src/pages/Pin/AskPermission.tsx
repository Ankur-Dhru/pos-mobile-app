import React, {useEffect, useRef, useState} from "react";

import {View} from "react-native";
import Container from "../../components/Container";
import ReactNativePinView from "react-native-pin-view"
import {useDispatch} from "react-redux";

import {setAlert} from "../../redux-store/reducer/component";
import {Caption, Card, List} from "react-native-paper";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import {localredux} from "../../libs/static";


const md5 = require('md5');


const Index = (props: any) => {

    const {navigation, route} = props;

    const kot = route?.params?.kot;
    const cancelKOTDialog = route?.params?.cancelKOTDialog;
    const cancelOrder = route?.params?.cancelOrder;


    let stafflist = localredux?.initData?.staff;

    stafflist = Object.values(stafflist)?.filter((staff: any) => {
        if (Boolean(kot)) {
            return staff.settings.cancelkot
        } else {
            return staff.settings.cancelorder
        }
    }).map((staff: any) => {
        return {label: staff.username, value: staff.adminid, more: staff}
    })

    const dispatch = useDispatch()
    let staffRef = useRef();

    const pinView: any = useRef(null)
    const [enteredPin, setEnteredPin] = useState("")
    const [selectedstaff, setSelectedStaff]: any = useState();

    useEffect(() => {
        staffRef.current?.props?.onPress()
    }, [])


    useEffect(() => {

        setTimeout(async () => {
            if (enteredPin.length === 5) {
                if (md5(enteredPin) === selectedstaff?.loginpin) {
                    navigation.goBack()
                    Boolean(cancelKOTDialog) && cancelKOTDialog(kot, true).then();
                    Boolean(cancelOrder) && cancelOrder(navigation).then();

                } else {
                    dispatch(setAlert({visible: true, message: 'Wrong Pin'}));
                }
                pinView.current.clearAll()
            }
        }, 200)
    }, [enteredPin])


    return <Container style={{padding: 0}}>

        <Card style={[styles.card, {paddingBottom: 100}]}>

            <View>
                <InputField
                    label={'Staff'}
                    customRef={staffRef}
                    divider={true}
                    displaytype={'bottomlist'}
                    inputtype={'dropdown'}
                    list={stafflist}
                    render={() => {
                        return <View>
                            <List.Item
                                style={[styles.listitem]}
                                title={`${selectedstaff?.username || 'Select Staff'}`}
                                left={() => <List.Icon icon="account-outline"/>}
                                right={() => <List.Icon icon="chevron-right"/>}
                            />
                        </View>
                    }}
                    search={false}
                    listtype={'other'}
                    selectedValue={''}
                    onChange={(value: any, more: any) => {
                        setSelectedStaff(more.more)
                    }}
                />
            </View>

            <View style={[styles.center, styles.h_100, styles.middle]}>

                <View style={{width: 300}}>


                    {Boolean(selectedstaff) && <>

                        <Caption style={[styles.caption, {textAlign: 'center'}]}>Enter PIN
                            of {selectedstaff?.username}</Caption>

                        <ReactNativePinView
                            inputSize={12}
                            ref={pinView}
                            pinLength={5}
                            onValueChange={value => value.length === 5 && setEnteredPin(value)}
                            inputViewEmptyStyle={{
                                backgroundColor: "transparent",
                                borderWidth: 1,
                                borderColor: "#ccc",
                            }}
                            inputViewFilledStyle={{
                                backgroundColor: "#222",
                            }}
                            buttonViewStyle={{
                                borderWidth: 0,
                                backgroundColor: styles.secondary.color,
                                borderColor: styles.secondary.color,
                                width: 60,
                                height: 60,
                                borderRadius: 50
                            }}
                            buttonTextStyle={{
                                color: "#222",
                                fontSize: 18,
                            }}
                            inputViewStyle={{
                                marginBottom: 0
                            }}


                        /></>}
                </View>

            </View>


        </Card>
    </Container>
}


export default Index;

//
