import React, {memo, useEffect, useState} from "react";
import {appLog, chevronRight} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, List, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import Avatar from "../../components/Avatar";
import {useNavigation} from "@react-navigation/native";
import {ProIcon} from "../../components";
import {device} from "../../libs/static";


const Index = ({clientdetail,clientid,clientname,commonkotnote,vouchernotes,vehicleno}: any) => {


    const navigation = useNavigation()

    return <Card style={[styles.card,  {minWidth:310,padding:5,paddingHorizontal:device.tablet?7:15}]} onPress={() => {
        navigation.navigate('ClientList');
    }}>
        <View style={[styles.grid,styles.middle]}>
            <View style={[styles.w_auto,styles.borderRight]}>
                <List.Item style={[styles.listitem]}
                           titleStyle={[styles.bold]}
                           title={clientname || clientdetail?.displayname}
                           left={() => <View>
                               <Avatar label={clientname || clientdetail?.displayname} thumbnailPath={clientdetail?.thumbnailPath} value={clientid || clientdetail?.clientid} fontsize={14} size={35}/>
                           </View>}

                />
            </View>
            <TouchableOpacity style={{paddingLeft:10}} onPress={()=>{
                navigation.navigate('KotNote',{commonkotnote:commonkotnote,vouchernotes:vouchernotes,vehicleno:vehicleno})
            }}>
                <ProIcon name={'notes'}/>
            </TouchableOpacity>
        </View>
    </Card>


    /*return <Card style={[styles.card,styles.noshadow]}>

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
    clientid:state.cartData.clientid,
    clientname:state.cartData.clientname,
    clientdetail:state.cartData.client,
    commonkotnote:state.cartData?.commonkotnote,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
