import React, {useEffect, useState} from "react";
import {chevronRight} from "../../libs/function";
import {View} from "react-native";
import {Card, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import Avatar from "../../components/Avatar";
import {useNavigation} from "@react-navigation/native";


const Index = ({clientid, clientname}: any) => {


    const [client, setClient]: any = useState({});

    const navigation = useNavigation()

    useEffect(() => {
        setClient({label: clientname, value: clientid})
    }, [clientid])

    return <Card style={[styles.noshadow]} onPress={() => {
        navigation.navigate('ClientList');
    }}>

        <View style={[styles.px_5]}>

            <View style={[styles.grid, styles.justifyContent, {paddingTop: 8, paddingBottom: 8}]}>
                <View style={[styles.grid, styles.justifyContent, styles.noWrap]}>
                    <Avatar label={client.label} value={client.value} fontsize={12} size={30}/>
                    <View style={[styles.ml_2]}><Paragraph
                        style={[styles.paragraph, styles.bold]}> {client.label}</Paragraph></View>
                </View>
                <View><Text>{chevronRight}</Text></View>
            </View>

        </View>

    </Card>


    /*return <Card style={[styles.noshadow]}>

        <View style={[styles.px_5]}>



            <InputField
                removeSpace={true}
                label={'Clients'}
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
                list={Object.values({}).map((client: any) => {
                    return {...client, label: client.displayname, value: client.clientid}
                })}
                addItem={<TouchableOpacity onPress={async () => {
                    navigation.navigate('AddEditClient',{callback:selectClient});
                }}>
                    <Paragraph><ProIcon
                        name={'plus'}  /></Paragraph></TouchableOpacity>}
                search={false}
                listtype={'other'}
                onChange={(value: any, client: any) => {
                    selectClient(client).then()
                }}
            />
        </View>

    </Card>*/
}

const mapStateToProps = (state: any) => ({
    clientid: state.cartData.clientid,
    clientname: state.cartData.clientname,
})


export default connect(mapStateToProps)(Index);
