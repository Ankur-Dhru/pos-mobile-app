import React, {useEffect, useState} from "react";
import {appLog, chevronRight, clone} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Text, Title} from "react-native-paper";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {localredux} from "../../libs/static";
import Avatar from "../../components/Avatar";
import store from "../../redux-store/store";
import {setModal, setPageSheet} from "../../redux-store/reducer/component";

import AddEditClient from "./AddEditClient";


const Index = ({cartData}: any) => {

    const {clientsData}:any = localredux;
    const [client, setClient]:any = useState({});

    const dispatch = useDispatch()

    const selectClient = async (client: any) => {

        cartData = {
            ...cartData,
            clientid: client.clientid,
            clientname: client.displayname
        }

        dispatch(setCartData(clone(cartData)));
        setClient(client);
    }

    useEffect(() => {
        setClient({label: cartData?.clientname, value: cartData?.clientid})
    }, [])

    return <Card style={[styles.noshadow]}>

        <View style={[styles.px_5]}>
            <InputField
                removeSpace={true}
                label={'Category'}
                divider={true}

                displaytype={'pagelist'}
                inputtype={'dropdown'}
                render={() => <View style={[styles.grid, styles.justifyContent,{paddingTop:8,paddingBottom:8}]}>
                    <View style={[styles.grid, styles.justifyContent,styles.noWrap]}>
                        <Avatar label={client.label} value={client.value} fontsize={12}  size={30}/>
                        <View style={[styles.ml_2]}><Paragraph style={[styles.paragraph,styles.bold]}> {client.label}</Paragraph></View>
                    </View>
                    <View><Text>{chevronRight}</Text></View>
                </View>}
                list={Object.values(clientsData).map((client: any) => {
                    return {...client, label: client.displayname, value: client.clientid}
                })}
                addItem={<TouchableOpacity onPress={async () => {
                    store.dispatch(setPageSheet({
                        visible: true,
                        hidecancel: true,
                        width: 300,
                        component: () => <AddEditClient callback={(value:any)=>{
                            selectClient(value)
                        }}   />
                    }))
                }}>
                    <Title
                        style={[styles.px_6]}><ProIcon
                        name={'plus'}/></Title></TouchableOpacity>}
                search={false}
                listtype={'staff'}
                onChange={(value: any, client: any) => {
                    selectClient(client).then()
                }}
            />
        </View>

    </Card>
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData,
})


export default connect(mapStateToProps)(Index);
