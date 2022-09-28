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


const Index = ({cartData}: any) => {

    const {clientsData}:any = localredux;

    const [client, setClient] = useState({});

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

    return <Card style={[styles.mb_3]}>

        <View style={[styles.px_5]}>
            <InputField
                removeSpace={true}
                label={'Category'}
                divider={true}
                displaytype={'pagelist'}
                inputtype={'dropdown'}
                render={() => <View style={[styles.grid, styles.justifyContent, styles.py_5]}>
                    <View style={[styles.grid, styles.middle]}>
                        <View>
                            <ProIcon name={'user'} type={'solid'}/>
                        </View>
                        <View><Paragraph style={[styles.paragraph, styles.text_lg]}>{client.label}</Paragraph></View>
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
