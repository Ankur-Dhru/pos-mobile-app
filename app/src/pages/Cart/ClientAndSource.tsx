import {Alert, ScrollView, TouchableOpacity, View} from "react-native";
import {Text, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";
import {setDialog} from "../../redux-store/reducer/component";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import React, {memo, useState} from "react";
import {localredux} from "../../libs/static";
import {appLog, errorAlert, isEmpty} from "../../libs/function";
import {updateCartField} from "../../redux-store/reducer/cart-data";


const ClientAndSource = (props: any) => {
    const {tabledetails,navigation} = props;

    const dispatch = useDispatch();

    const [clientSearch, setClientSearch] = useState<any>();
    const [selectedClient, setSelectedClient] = useState<any>({})
    const [ordersource, setOrderSource] = useState<any>();
    const [advance, setAdvance] = useState<any>({datetime:'',notes:''})

    const onClientSearch = () => {
        let findClient: any = Object.values(localredux?.clientsData).find((client: any) => client?.phone == clientSearch);
        appLog("findClient", findClient);
        if (isEmpty(findClient)) {
            findClient = {
                "clientid": "0",
                "newclient": "1",
                "customertype": "individual",
                "clientconfig": {"pricingtemplate": "default", "taxregtype": ["c"], "taxid": [[""]]},
                "status": "active",
                "firstname": "",
                "lastname": "",
                "company": "",
                "paymentterm": "date",
                "clienttype": 0,
                "country": localredux?.initData?.general?.data?.country || "IN",
                "state": localredux?.initData?.general?.data?.state || "IN-GJ",
                "email": "",
                "phone": clientSearch,
                "address1": "",
                "address2": "",
                "city": "",
                "pin": "",
            };
        }
        setSelectedClient({...findClient, phone: clientSearch})
    }


    const setClientData = (key: any, value: any) => {
        setSelectedClient((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }
    const setAdvanceData = (key: any, value: any) => {
        setAdvance((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    let isSource = Boolean(tabledetails?.ordertype == "homedelivery")
    let isAdvanceorder = Boolean(tabledetails?.ordertype == "advanceorder")

    return <View >


        <ScrollView>

        <View  style={[styles.grid, styles.justifyContent,styles.top]}>

        {isAdvanceorder && <View style={[styles.flexGrow, {maxWidth:400,marginRight:20}]}><View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow, {marginRight: 12}]}>


                <InputField
                    value={advance?.datetime}
                    label={'Delivery Date Time'}
                    inputtype={'datepicker'}
                    onChange={(value: any) => {
                        setAdvanceData("datetime", value);
                    }}
                />
            </View>



            <View style={[styles.grid, styles.justifyContent]}>
                <View style={[styles.flexGrow]}>
                    <InputField
                        value={advance?.notes}
                        label={'Notes'}
                        multiline={true}
                        inputtype={'textbox'}
                        onChange={(value: any) => {
                            setAdvanceData("notes", value);
                        }}
                    />
                </View>
            </View>

        </View></View>}


        <View  style={[styles.flexGrow,{maxWidth:400,}]}>

        {
            isSource && <View>
                <InputField
                    label={'Select Source'}
                    mode={'flat'}
                    list={Object.values(localredux?.initData?.sources).map((s) => ({label: s, value: s}))}
                    value={ordersource}
                    selectedValue={ordersource}
                    displaytype={'pagelist'}
                    inputtype={'dropdown'}
                    listtype={'other'}
                    onChange={(value: any) => {
                        setOrderSource(value)
                    }}>
                </InputField>
            </View>
        }
        <View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow, {width: "70%", marginRight: 12}]}>
                <InputField
                    value={clientSearch}
                    label={'Mobile'}
                    inputtype={'textbox'}
                    keyboardType='numeric'
                    onChange={(value: any) => {
                        setClientSearch(value)
                    }}
                />
            </View>
            <View style={[styles.flexGrow, {width: "20%"}]}>
                <Button onPress={onClientSearch}>Search</Button>
            </View>
        </View>

        <View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow, {marginRight: 12}]}>
                <InputField
                    value={selectedClient?.displayname}
                    label={'Display Name'}
                    inputtype={'textbox'}
                    onChange={(value: any) => {
                        setClientData("displayname", value);
                    }}
                />
            </View>
        </View>

        <View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow, {marginRight: 12}]}>
                <InputField
                    value={selectedClient?.address1}
                    label={'Address1'}
                    inputtype={'textbox'}
                    onChange={(value: any) => {
                        setClientData("address1", value);
                    }}
                />
            </View>
        </View>

        <View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow, {marginRight: 12}]}>
                <InputField
                    value={selectedClient?.address2}
                    label={'Address2'}
                    inputtype={'textbox'}
                    onChange={(value: any) => {
                        setClientData("address2", value);
                    }}
                />
            </View>
        </View>

        <View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow, {marginRight: 12}]}>
                <InputField
                    value={selectedClient?.city}
                    label={'City'}
                    inputtype={'textbox'}
                    onChange={(value: any) => {
                        setClientData("city", value);
                    }}
                />
            </View>
        </View>

        </View>
        </View>

        </ScrollView>

        <View style={[styles.grid,styles.justifyContent]}>

            <Button more={{backgroundColor: styles.light.color,color:'black'  }}
                    onPress={() => {
                        dispatch(setDialog({visible: false,}));
                        navigation.replace('DrawerStackNavigator');
                    }}>Cancel</Button>


        <Button onPress={() => {

             if (Boolean(selectedClient?.displayname) && (isSource ? Boolean(ordersource): true)){
                 let pass = {
                     ordersource: "POS",
                     tablename: ordersource,
                     clientid: selectedClient.clientid,
                     clientname: selectedClient.displayname,
                     newclient: Boolean(selectedClient?.clientid == "0") ? 1 : 0,
                     client: selectedClient,
                     advanceorder:advance
                 }
                 dispatch(updateCartField(pass))
                 dispatch(setDialog({visible: false}))
             }else {
                 let message = "";
                 if (isSource && !Boolean(ordersource)){
                     message += "Please Select Order Source\n";
                 }
                 if (!Boolean(selectedClient?.displayname) ){
                     message += "Please Enter Display Name"
                 }
                 errorAlert(message);
             }
        }}>Save</Button>

        </View>

    </View>
}


export default ClientAndSource;

