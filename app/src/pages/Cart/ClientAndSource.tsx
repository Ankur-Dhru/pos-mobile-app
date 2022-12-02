import {ScrollView, TouchableOpacity, View} from "react-native";
import {Caption, Card, List, Paragraph} from "react-native-paper";
import {useDispatch} from "react-redux";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import React, {useState} from "react";
import {ItemDivider, localredux} from "../../libs/static";
import {appLog, errorAlert, isEmpty, saveTempLocalOrder} from "../../libs/function";

import moment from "moment";

import store from "../../redux-store/store";
import KAccessoryView from "../../components/KAccessoryView"
import KeyboardScroll from "../../components/KeyboardScroll";
import {Container} from "../../components";
import {getClientsByWhere} from "../../libs/Sqlite/selectData";
import ProIcon from "../../components/ProIcon";
import Tabs from "../../components/TabView";


const ClientAndSource = (props: any) => {

    const {navigation}: any = props
    const params = props.route;


    let {tabledetails, placeOrder, title, edit} = params.params;


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

    if (edit) {
        tabledetails = store.getState().cartData;
    }

    const dispatch = useDispatch();

    const [clientSearch, setClientSearch] = useState<any>();
    const [selectedClient, setSelectedClient] = useState<any>({...defaultClientData, ...tabledetails?.client})
    const [table, setTable] = useState<any>({
        tableid: '',
        paxes: '',
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('YYYY-MM-DD HH:mm'), ...tabledetails?.reservetable
    })
    const [ordersource, setOrderSource] = useState<any>();
    const [advance, setAdvance] = useState<any>({
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('YYYY-MM-DD HH:mm'),
        notes: '',
        ...tabledetails?.advanceorder
    })

    const onClientSearch = () => {

        getClientsByWhere({phone: clientSearch, start: 0}).then((clients) => {
            let client = clients[0];
            if (isEmpty(client) || (clientSearch.length < 10)) {
                errorAlert("Phone number not found!");
                client = defaultClientData;
            }
            setSelectedClient({...client, phone: clientSearch})
        });

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


    navigation.setOptions({
        headerTitle: tabledetails.tablename,
    })



    const AllTable = () => (
        <View style={[styles.flex,styles.px_3]}>
            <ScrollView>
            {
                isReserveTable && <Card style={[styles.card]}><Card.Content style={[styles.cardContent]}>
                    {/*<Caption style={[styles.caption]}>Tables</Caption>*/}
                    <View>
                        {
                            currentLocation?.tables?.map((t: any,index:any) => {
                                return <>
                                    <List.Item
                                        style={[styles.listitem]}
                                        key={index}
                                        title={t.tablename}
                                        onPress={() => {
                                            setTableData('tableid', t.tableid)
                                        }}
                                        left={() => <List.Icon icon={t.tableid === table.tableid?'check-circle-outline':'checkbox-blank-circle-outline'}></List.Icon>}
                                    />
                                </>
                            })
                        }
                    </View>


                </Card.Content>
                </Card>
            }
            </ScrollView>
        </View>
    );

    const Sources = () => (
        <View style={[styles.flex,styles.px_3]}>
            {
                isSource && <Card style={[styles.card]}>
                    <Card.Content style={[styles.cardContent]}>
                        {/*<Caption  style={[styles.caption]}>Sources</Caption>*/}
                        <View>
                            {
                                Object.values(localredux?.initData?.sources).map((source: any,index:any) => {
                                    return (<>
                                        <List.Item
                                            style={[styles.listitem]}
                                            key={index}
                                            title={source}
                                            onPress={() => {
                                                setOrderSource(source);
                                            }}
                                            left={() => <List.Icon icon={source === ordersource?'check-circle-outline':'checkbox-blank-circle-outline'}></List.Icon>}
                                        />

                                    </>)
                                })
                            }
                        </View>
                    </Card.Content>
                </Card>
            }
        </View>
    );

    const DeliveryOn = () => (
        <View style={[styles.flex,styles.px_3]}>
            {isAdvanceorder && <>

                <Card style={[styles.card]}>
                    <Card.Content style={[styles.cardContent]}>

                        {/*<Caption style={[styles.caption]}>Delivery On</Caption>*/}

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

                    </Card.Content>
                </Card>
            </>}
        </View>
    );

    const ClientInformation = () => (
        <View style={[styles.flex,styles.px_3]}>
            <Card style={[styles.card,styles.w_auto,  {minWidth: 360, maxWidth: '100%'}]}>
                <Card.Content style={[styles.cardContent]}>
                    {<>
                        {/*<Caption style={[styles.caption]}>Client Information</Caption>*/}
                        <View style={[styles.grid, styles.justifyContent]}>
                            <View style={[styles.flexGrow, styles.w_auto, {marginRight: 12}]}>
                                <InputField
                                    minLength={10}
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
                                <Button onPress={onClientSearch} more={{
                                    backgroundColor: styles.secondary.color,
                                    color: 'black',
                                    height:40
                                }}>Search</Button>
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

                        {isReserveTable && <View>
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
                        </View>}

                    </>}
                </Card.Content>
            </Card>
        </View>
    );


    let tabs:any = {}
    let routes = []

    if(isReserveTable){
        tabs = {...tabs, tables: AllTable}
        routes.push({key: 'tables', title: 'Tables'})
    }
    else if(isSource){
        tabs = {...tabs,sources:  Sources}
        routes.push({key: 'sources', title: 'Sources'})
    }
    else if(isAdvanceorder){
        tabs = {...tabs,deliveryon:  DeliveryOn}
        routes.push({key: 'deliveryon', title: 'Delivery On'})
    }

    tabs =  {...tabs,clientinformation: ClientInformation}
    routes.push({key: 'clientinformation', title: 'Client Information'})


    return (<Container  style={{padding:0}}>

                    <Tabs
                        scenes={tabs}
                        routes={routes}
                        scrollable={false}
                        style={{minWidth:190,width:'50%'}}
                    />


                <KAccessoryView>

                    <View style={[styles.submitbutton,styles.px_3]}>
                        <Button more={{color:'white'}}  onPress={() => {

                            let clientDisplayName = selectedClient?.displayname?.trim();


                            let selectedTable = !isEmpty(table) && Boolean(table?.tableid);
                            let isPaxes = !isEmpty(table) && Boolean(table?.paxes);

                            if (Boolean(clientDisplayName) && (isSource ? Boolean(ordersource) : true) && (isReserveTable ? selectedTable && isPaxes : true)) {
                                let pass = {
                                    ordersource: "POS",
                                    tablename: tabledetails.tablename,
                                    clientid: selectedClient.clientid,
                                    clientname: clientDisplayName,
                                    newclient: Boolean(selectedClient?.clientid == "0") ? 1 : 0,
                                    client: selectedClient,
                                    advanceorder: isAdvanceorder ? advance : false,
                                    reservetable: isReserveTable ? table : false
                                }

                                if (isSource) {
                                    pass = {
                                        ...pass,
                                        tablename: ordersource
                                    }
                                }

                                if (edit) {
                                    tabledetails = {
                                        ...tabledetails,
                                        ...pass
                                    }
                                    dispatch(showLoader())
                                    saveTempLocalOrder(tabledetails).then(() => {
                                        dispatch(hideLoader())
                                    })
                                } else {
                                    placeOrder(pass)
                                }

                                navigation.goBack()
                            } else {
                                let message = "";
                                if (isSource && !Boolean(ordersource)) {
                                    message += "Please Select Order Source\n";
                                }
                                if (isReserveTable) {
                                    if (!selectedTable) {
                                        message += "Please Select Table\n";
                                    }
                                    if (!isPaxes) {
                                        message += "Please Enter Pax\n";
                                    }
                                }
                                if (!Boolean(clientDisplayName)) {
                                    message += "Please Enter Display Name"
                                }
                                errorAlert(message);
                            }
                        }}> {edit ? 'Update' : 'Next'} </Button>

                    </View>
                </KAccessoryView>


    </Container>)


}


export default ClientAndSource;

