import React, {useEffect, useState} from "react";
import {chevronRight, clone} from "../../libs/function";
import {View} from "react-native";
import {Card, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import {connect, useDispatch} from "react-redux";
import ProIcon from "../../components/ProIcon";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {localredux} from "../../libs/static";
import Avatar from "../../components/Avatar";


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
        setClient(client)
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
                search={false}
                listtype={'staff'}
                onChange={(value: any, client: any) => {
                    selectClient(client)
                }}
            />
        </View>

    </Card>
}

const mapStateToProps = (state: any) => ({
    cartData: state.cartData,
})


export default connect(mapStateToProps)(Index);
