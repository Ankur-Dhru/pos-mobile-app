import {SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Text, Title} from "react-native-paper";
import {useDispatch} from "react-redux";
import {closePage, hideLoader, setModal, showLoader} from "../../redux-store/reducer/component";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import React, {useState} from "react";
import {localredux} from "../../libs/static";
import {appLog, errorAlert, isEmpty, saveTempLocalOrder} from "../../libs/function";

import moment from "moment";

import store from "../../redux-store/store";
import KAccessoryView from "../../components/KAccessoryView"
import KeyboardScroll from "../../components/KeyboardScroll";
import {Container} from "../../components";


const ClientAndSource = (props: any) => {

    const {navigation}:any = props
    const params = props.route;


    let {tabledetails, placeOrder, title,edit} = params.params

    let defaultClientData = {
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

    if(edit){
        tabledetails = store.getState().cartData;
    }

    const dispatch = useDispatch();

    const [clientSearch, setClientSearch] = useState<any>();
    const [selectedClient, setSelectedClient] = useState<any>({...defaultClientData,...tabledetails?.client})
    const [table, setTable] = useState<any>({tableid: '', paxes: '',date: moment().format('YYYY-MM-DD'),time: moment().format('YYYY-MM-DD HH:mm'),...tabledetails?.reservetable})
    const [ordersource, setOrderSource] = useState<any>();
    const [advance, setAdvance] = useState<any>({
        date:  moment().format('YYYY-MM-DD'),
        time:  moment().format('YYYY-MM-DD HH:mm'),
        notes:  '',
        ...tabledetails?.advanceorder
    })

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

    const hasLeft = Boolean(tabledetails?.ordertype == "homedelivery" || tabledetails?.ordertype == "advanceorder" || tabledetails?.ordertype == "tableorder")
    const isSource = Boolean(tabledetails?.ordertype == "homedelivery")
    const isAdvanceorder = Boolean(tabledetails?.ordertype == "advanceorder")
    const isReserveTable = Boolean(tabledetails?.ordertype == "tableorder")


    const {currentLocation} = localredux.localSettingsData;

    /*navigation.setOptions = {
        headerCenter: () => <Title style={[styles.headertitle]}>{title}</Title>,
    }*/

    return (<Container>

        <SafeAreaView>
        <View style={[styles.middle,]}>
            <View style={[styles.middleForm]}>


        <KeyboardScroll>

            <Title style={[styles.mt_5]}>{title}  </Title>


        <View style={[styles.grid, styles.justifyContent,styles.top, styles.h_100, styles.flex]}>

                {hasLeft && <View style={[styles.noshadow,styles.w_auto,{
                    minWidth:360,maxWidth:'100%',
                }]}>
                    <View>
                        {
                            isReserveTable && <View>
                                <Paragraph  style={[styles.caption]}>Select Table</Paragraph>
                                <View style={[styles.grid]}>
                                    {
                                        currentLocation?.tables?.map((t: any) => {
                                            return <TouchableOpacity style={[styles.flexGrow,{minWidth:100,borderRadius:5}]} onPress={()=>{
                                                setTableData('tableid', t.tableid)
                                            }}><Paragraph style={[styles.paragraph,styles.p_5,styles.m_1, {borderRadius:5,textAlign:'center',backgroundColor: t.tableid === table.tableid? styles.secondary.color:'#eee'}]}>{t.tablename}</Paragraph></TouchableOpacity>
                                        })
                                    }
                                </View>


                                <InputField
                                    value={table.paxes}
                                    label={'Paxes'}
                                    inputtype={'textbox'}
                                    keyboardType='numeric'
                                    onChange={(value: any) => {
                                        setTableData('paxes', value)
                                    }}
                                />

                                <View style={[styles.grid, styles.justifyContent]}>
                                    <View style={[styles.flexGrow, {marginRight: 12}]}>
                                        <InputField
                                            label={"Date"}
                                            displaytype={'bottomlist'}
                                            inputtype={'datepicker'}
                                            mode={'date'}
                                            selectedValue={table.date}
                                            onChange={(value: any) => {
                                                setTableData("date", value);
                                            }}
                                        />
                                    </View>
                                    <View style={[styles.flexGrow, {marginRight: 12}]}>
                                        <InputField
                                            label={"Time"}
                                            displaytype={'bottomlist'}
                                            inputtype={'datepicker'}
                                            mode={'time'}
                                            selectedValue={table.time}
                                            onChange={(value: any) => {
                                                setTableData("time", value);
                                            }}
                                        />
                                    </View>
                                </View>

                            </View>
                        }
                        {
                            isSource && <View>
                                <Paragraph  style={[styles.caption]}>Select Source</Paragraph>
                                <View style={[styles.grid]}>
                                    {
                                        Object.values(localredux?.initData?.sources).map((source: any) => {
                                            return <TouchableOpacity style={[styles.flexGrow,{minWidth:100,borderRadius:5}]} onPress={()=>{
                                                setOrderSource(source);
                                            }}><Paragraph style={[styles.paragraph,styles.p_5,styles.m_1, {borderRadius:5,textAlign:'center',backgroundColor: source === ordersource? styles.secondary.color:'#eee'}]}>{source}</Paragraph></TouchableOpacity>
                                        })
                                    }
                                </View>

                            </View>
                        }
                        {isAdvanceorder && <>

                            <Paragraph  style={[styles.caption]}>Delivery On</Paragraph>

                            <View style={[styles.grid, styles.justifyContent]}>
                                <View style={[styles.flexGrow, {marginRight: 12}]}>
                                    <InputField
                                        label={"Date"}
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
                                        label={"Time"}
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
                    </View>
                </View>}



            <View style={[styles.w_auto,styles.h_100,  {minWidth: 360,maxWidth:'100%'}]}>
                {<>
                    <Paragraph style={[styles.caption]}>Client Information</Paragraph>
                    <View style={[styles.grid, styles.justifyContent]}>
                        <View style={[styles.flexGrow, styles.w_auto, {marginRight: 12}]}>
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
                        <View style={[]}>
                            <Button onPress={onClientSearch} more={{backgroundColor: styles.secondary.color,color:'black' }} >Search</Button>
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
                        <View style={[styles.flexGrow, {width: 200, marginRight: 12}]}>
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
                        <View style={[styles.flexGrow, {width: 200, marginRight: 12}]}>
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
                </>}
            </View>

        </View>

        </KeyboardScroll>

        <KAccessoryView>

            <View style={[styles.submitbutton]}>
                <Button onPress={() => {

            let clientDisplayName  = selectedClient?.displayname?.trim();


            let selectedTable = !isEmpty(table) && Boolean(table?.tableid);
            let isPaxes = !isEmpty(table) && Boolean(table?.paxes);

             if (Boolean(clientDisplayName) && (isSource ? Boolean(ordersource): true) && (isReserveTable ? selectedTable && isPaxes :true)){
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

                 if (isSource){
                     pass = {
                         ...pass,
                         tablename: ordersource
                     }
                 }

                 if(edit){
                     tabledetails = {
                         ...tabledetails,
                         ...pass
                     }
                     dispatch(showLoader())
                     saveTempLocalOrder(tabledetails).then(() => {
                         dispatch(hideLoader())
                     })
                 }
                 else {
                     placeOrder(pass)
                 }

                  navigation.goBack()
             }else {
                 let message = "";
                 if (isSource && !Boolean(ordersource)){
                     message += "Please Select Order Source\n";
                 }
                 if (isReserveTable){
                     if (!selectedTable){
                         message += "Please Select Table\n";
                     }
                     if (!isPaxes){
                         message += "Please Enter Pax\n";
                     }
                 }
                 if (!Boolean(clientDisplayName) ){
                     message += "Please Enter Display Name"
                 }
                 errorAlert(message);
             }
        }}> {edit?'Update':'Next'} </Button>

        </View>
        </KAccessoryView>

            </View>
        </View>

        </SafeAreaView>

    </Container>)


}


export default ClientAndSource;

