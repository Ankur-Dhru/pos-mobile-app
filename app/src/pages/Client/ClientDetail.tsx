import React, {useEffect, useState} from "react";
import {appLog, chevronRight, clone} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, Text, Title} from "react-native-paper";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {device, localredux} from "../../libs/static";
import Avatar from "../../components/Avatar";
import store from "../../redux-store/store";
import {closePage, openPage, setModal} from "../../redux-store/reducer/component";

import AddEditClient from "./AddEditClient";
import {useNavigation} from "@react-navigation/native";


const Index = ({cartData}: any) => {

    const {clientsData}:any = localredux;
    const [client, setClient]:any = useState({});

    const dispatch = useDispatch();
    const navigation = useNavigation()

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

            {/*<TouchableOpacity onPress={()=>{
                navigation.navigate('ClientList', {
                    handleClient: selectClient,
                })
            }}>
                <View style={[styles.grid, styles.justifyContent,{paddingTop:8,paddingBottom:8}]}>
                    <View style={[styles.grid, styles.justifyContent,styles.noWrap]}>
                        <Avatar label={client.label} value={client.value} fontsize={12}  size={30}/>
                        <View style={[styles.ml_2]}><Paragraph style={[styles.paragraph,styles.bold]}> {client.label}</Paragraph></View>
                    </View>
                    <View><Text>{chevronRight}</Text></View>
                </View>
            </TouchableOpacity>*/}

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
                    dispatch(closePage(device.lastmodal))
                    if(device.tablet) {
                        navigation.navigate('AddEditClient');
                    }
                    else{
                        navigation.navigate('AddEditClient2');
                    }

                }}>
                    <Paragraph><ProIcon
                        name={'plus'}  /></Paragraph></TouchableOpacity>}
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
