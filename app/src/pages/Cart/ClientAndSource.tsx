import {ScrollView, TouchableOpacity, View} from "react-native";
import {Caption, Card, List, Paragraph} from "react-native-paper";
import {useDispatch} from "react-redux";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import React, {memo, useEffect, useRef, useState} from "react";
import {ItemDivider, localredux} from "../../libs/static";
import {appLog, errorAlert, getLocalSettings, isEmpty, nextFocus, saveTempLocalOrder} from "../../libs/function";

import moment from "moment";

import store from "../../redux-store/store";
import KAccessoryView from "../../components/KAccessoryView"

import {Container} from "../../components";
import {getClientsByWhere} from "../../libs/Sqlite/selectData";

import {SceneMap, TabBar, TabView} from "react-native-tab-view";


let globalTable:any = {};
let jump:any;

const AllTable = memo(({tabledetails,jumpTo}:any) => {

    const {currentLocation} = localredux.localSettingsData;
    const isReserveTable = Boolean(tabledetails?.ordertype == "tableorder");

    const [table, setTable] = useState<any>({
        tableid: '',
        paxes: '',
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('YYYY-MM-DD HH:mm'), ...tabledetails?.reservetable
    })

    useEffect(()=>{
        globalTable.table = table
    },[table])

    const setTableData = (key: any, value: any) => {
        setTable((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }


    return (
        <View style={[styles.flex,styles.px_3]}>
            <ScrollView>

            {
                isReserveTable && <>

                <Card style={[styles.card]}>
                    <Card.Content style={[styles.cardContent]}>

                        <View>
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

                    </Card.Content>
                </Card>

                <Card style={[styles.card]}><Card.Content style={[styles.cardContent]}>
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
                                            jumpTo('clientinformation')
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

                </>
            }
            </ScrollView>

        </View>
    );
})

const Sources =memo(({tabledetails,jumpTo}:any) => {

    const [ordersource, setOrderSource] = useState<any>();

    useEffect(()=>{
        globalTable.ordersource = ordersource
    },[ordersource])

    return <View  style={[styles.flex,styles.px_3]}>
        <ScrollView>
            <Card style={[styles.card]}>
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
                                            jumpTo('clientinformation')
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
        </ScrollView>
    </View>
})

const DeliveryOn = memo(({tabledetails}:any) => {

    const isAdvanceorder = Boolean(tabledetails?.ordertype == "advanceorder")

    const [advance, setAdvance] = useState<any>({
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('YYYY-MM-DD HH:mm'),
        notes: '',
        ...tabledetails?.advanceorder
    })

    const setAdvanceData = (key: any, value: any) => {
        setAdvance((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    useEffect(()=>{
        globalTable.advance = advance
    },[advance])

    return <>
        {isAdvanceorder && <View   style={[styles.flex,styles.px_3]}>

            <ScrollView>

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
            </ScrollView>
        </View>}
    </>
})

const ClientInformation = memo(({tabledetails}:any) => {

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


    const [clientSearch, setClientSearch] = useState<any>();
    const [selectedClient, setSelectedClient] = useState<any>({...defaultClientData, ...tabledetails?.client});

    let  inputRef = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()]

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

    useEffect(()=>{
        globalTable.selectedClient = selectedClient;
    },[selectedClient])

    return <View   style={[styles.flex,styles.px_3]}><ScrollView>
        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>
                {<>
                    {/*<Caption style={[styles.caption]}>Client Information</Caption>*/}
                    <View style={[styles.grid, styles.justifyContent]}>
                        <View style={[styles.flexGrow, styles.w_auto, {marginRight: 12}]}>
                            <InputField
                                minLength={10}
                                value={clientSearch}
                                label={'Mobile'}
                                customRef={inputRef[0]}
                                onSubmitEditing={()=> {
                                    onClientSearch();
                                    nextFocus(inputRef[1])
                                }}
                                returnKeyType={'search'}
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
                                customRef={inputRef[1]}
                                onSubmitEditing={()=> nextFocus(inputRef[2])}
                                returnKeyType={'next'}
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
                                customRef={inputRef[2]}
                                onSubmitEditing={()=> nextFocus(inputRef[3])}
                                returnKeyType={'next'}
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
                                customRef={inputRef[3]}
                                onSubmitEditing={()=> nextFocus(inputRef[4])}
                                returnKeyType={'next'}
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
                                customRef={inputRef[4]}

                                label={'City'}
                                inputtype={'textbox'}
                                onChange={(value: any) => {
                                    setClientData("city", value);
                                }}
                            />
                        </View>
                    </View>



                </>}
            </Card.Content>
        </Card>
    </ScrollView>
    </View>
})


const ClientAndSource = (props: any) => {

    const {navigation}: any = props
    const params = props.route;
    const dispatch = useDispatch()

    let {tabledetails, placeOrder, title, edit} = params.params;
    const [loading,setLoading]:any = useState(false);
    const [asksources,setAsksources]:any = useState({});
    const [index,setIndex]:any = useState(0)

    let tabRef = useRef();


    if (edit) {
        tabledetails = store.getState().cartData;
    }

    const isReserveTable = Boolean(tabledetails?.ordertype == "tableorder");
    const isSource = Boolean(((tabledetails?.ordertype === "homedelivery") && !asksources?.homedelivery) || ((tabledetails?.ordertype === "takeaway") && !asksources?.takeaway))
    const isAdvanceorder = Boolean(tabledetails?.ordertype == "advanceorder")

    globalTable = tabledetails;


    navigation.setOptions({
        headerTitle: tabledetails.tablename,
    })

    useEffect(()=>{
        getLocalSettings('asksources').then(r => {
            setAsksources(r);
            setLoading(true)
        });
    },[])


    let routes = []

    if(isReserveTable){
        routes.push({key: 'tables', title: 'Table & Pax'})
    }
    else if(isSource){
        routes.push({key: 'sources', title: 'Sources'})
    }
    else if(isAdvanceorder){
        routes.push({key: 'deliveryon', title: 'Delivery On'})
    }

    routes.push({key: 'clientinformation', title: 'Client Information'})


    if(!loading){
        return <></>
    }

    const renderScene = ({ route, jumpTo }:any) => {
        jump = jumpTo
        switch (route.key) {
            case 'tables':
                return <AllTable tabledetails={tabledetails} jumpTo={jumpTo} />;
            case 'sources':
                return <Sources tabledetails={tabledetails}  jumpTo={jumpTo} />;
            case 'deliveryon':
                return <DeliveryOn tabledetails={tabledetails}  jumpTo={jumpTo} />;
            case 'clientinformation':
                return <ClientInformation tabledetails={tabledetails}  jumpTo={jumpTo} />;
        }
    };

    const renderTabBar = (props:any) => (
        <TabBar
            {...props}
            style={[styles.noshadow,styles.mb_3,{ backgroundColor: 'white',}]}
            labelStyle={[{color:'black',textTransform:'capitalize'}]}
            indicatorStyle={{backgroundColor:styles.accent.color}}
            scrollEnabled={true}
            tabStyle={{minWidth:190,width:'50%'}}
        />
    );


    return (<Container style={{padding:0}}>


        <TabView
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
        />


                <KAccessoryView>

                    <View style={[styles.submitbutton,styles.px_3,styles.mb_3]}>
                        <Button more={{color:'white'}}  onPress={() => {

                            const {selectedClient,table,ordersource,advance} = globalTable;

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
                                    jump('sources')
                                    message += "Please Select Order Source\n";
                                }
                                if (isReserveTable) {
                                    jump('tables')
                                    if (!selectedTable) {
                                        message += "Please Select Table\n";
                                    }
                                    if (!isPaxes) {
                                        message += "Please Enter Pax\n";
                                    }
                                }
                                if (!Boolean(clientDisplayName)) {
                                    jump('clientinformation')
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

