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
import moment from "moment";


const ClientAndSource = (props: any) => {
    const {tabledetails,navigation,placeOrder} = props;

    let defaultClientData =  {
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
        "address1": "",
        "address2": "",
        "city": "",
        "pin": "",
    }

    const dispatch = useDispatch();

    const [clientSearch, setClientSearch] = useState<any>();
    const [selectedClient, setSelectedClient] = useState<any>(defaultClientData)
    const [table, setTable] = useState<any>({tableid:'',paxes:''})
    const [ordersource, setOrderSource] = useState<any>();
    const [advance, setAdvance] = useState<any>({date:moment().format('YYYY-MM-DD'),time:moment().format('YYYY-MM-DD HH:mm'),notes:''})

    const onClientSearch = () => {
        let findClient: any = Object.values(localredux?.clientsData).find((client: any) => client?.phone == clientSearch);

        if (isEmpty(findClient)) {
            errorAlert("Phone number not found!");
            findClient = defaultClientData;
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
    const setTableData = (key: any, value: any) => {
        setTable((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    const hasLeft = Boolean(tabledetails?.ordertype == "homedelivery" || tabledetails?.ordertype == "advanceorder"  || tabledetails?.ordertype == "tableorder")
    const isSource = Boolean(tabledetails?.ordertype == "homedelivery")
    const isAdvanceorder = Boolean(tabledetails?.ordertype == "advanceorder")
    const isReserveTable = Boolean(tabledetails?.ordertype == "tableorder")



    const {currentLocation} = localredux.localSettingsData;

    return <View >



        <View  style={[styles.grid, styles.justifyContent,styles.top]}>

        {hasLeft && <View style={[styles.flexGrow, {maxWidth:200,marginRight:20}]}>

            {
                isReserveTable && <View style={{width:360}}>
                    <InputField
                        label={'Select Table'}
                        mode={'flat'}
                        list={currentLocation?.tables?.map((t: any) => ({
                            ...t,
                            label:t.tablename,
                            value:t.tableid
                        }))}
                        value={table.tableid}
                        selectedValue={table.tableid}
                        displaytype={'pagelist'}
                        inputtype={'dropdown'}
                        listtype={'other'}
                        onChange={(value: any) => {
                            setTableData('tableid',value)
                        }}>
                    </InputField>


                    <InputField
                        value={table.paxes}
                        label={'Paxes'}
                        inputtype={'textbox'}
                        keyboardType='numeric'
                        onChange={(value: any) => {
                            setTableData('paxes',value)
                        }}
                    />

                </View>
            }

            {
                isSource && <View style={{width:360}}>
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

            {isAdvanceorder && <>
                <View style={[styles.grid, styles.justifyContent]}>
                    <View style={[styles.flexGrow, {marginRight: 12}]}>
                        <InputField
                            label={"Delivery Date"}
                            displaytype={'bottomlist'}
                            inputtype={'datepicker'}
                            mode={'date'}
                            selectedValue={advance.date}
                            onChange={(value: any) => {
                                setAdvanceData("date", value);
                            }}
                        />
                    </View>
                    <View style={[styles.flexGrow, {marginRight: 12}]}>
                        <InputField
                            label={"Delivery Time"}
                            displaytype={'bottomlist'}
                            inputtype={'datepicker'}
                            mode={'time'}
                            selectedValue={advance.time}
                            onChange={(value: any) => {
                                setAdvanceData("time", value);
                            }}
                        />
                    </View>
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
            </>}

        </View>}


        <View  style={[styles.flexGrow,{maxWidth:400,}]}>


        <View style={[styles.grid, styles.justifyContent]}>
            <View style={[styles.flexGrow,styles.w_auto, {  marginRight: 12}]}>
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
            <View style={[styles.flexGrow,{maxWidth:120}]}>
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
            <View style={[styles.flexGrow, {width:200,marginRight: 12}]}>
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
            <View style={[styles.flexGrow, {width:200,marginRight: 12}]}>
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


        <View style={[styles.grid,styles.justifyContent]}>

            <Button more={{backgroundColor: styles.light.color,color:'black'  }}
                    onPress={() => {
                        dispatch(setDialog({visible: false,}));

                    }}>Cancel</Button>


        <Button onPress={() => {

            let clientDisplayName  = selectedClient?.displayname?.trim();
            let selectedTable = !isEmpty(table) && Boolean(table?.tableid);

             if (Boolean(clientDisplayName) && (isSource ? Boolean(ordersource): true) && (isReserveTable ? selectedTable :true)){
                 let pass = {
                     ordersource: "POS",
                     tablename: tabledetails.tablename,
                     clientid: selectedClient.clientid,
                     clientname: clientDisplayName,
                     newclient: Boolean(selectedClient?.clientid == "0") ? 1 : 0,
                     client: selectedClient,
                     advanceorder:isAdvanceorder ? advance : false,
                     reservetable:isReserveTable ? table : false
                 }
                 placeOrder(pass)

                 dispatch(setDialog({visible: false}))
             }else {
                 let message = "";
                 if (isSource && !Boolean(ordersource)){
                     message += "Please Select Order Source\n";
                 }
                 if (isReserveTable && !selectedTable){
                     message += "Please Select Table\n";
                 }
                 if (!Boolean(clientDisplayName) ){
                     message += "Please Enter Display Name"
                 }
                 errorAlert(message);
             }
        }}>Save</Button>

        </View>

    </View>
}


export default ClientAndSource;

