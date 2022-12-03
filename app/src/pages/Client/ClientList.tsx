import {device, ItemDivider} from "../../libs/static";
import React, {memo, useEffect,  useState} from "react";
import {FlatList, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import {Card, Divider, List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, SearchBox} from "../../components";

import {appLog, gePhonebook} from "../../libs/function";


import {getClientsByWhere} from "../../libs/Sqlite/selectData";


import {useNavigation} from "@react-navigation/native";

import store from "../../redux-store/store";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";


const Item = memo(({client}: any) => {

    const navigation = useNavigation();

    return (
        <List.Item

            key={client.clientid}
            title={client.displayname}
            description={client.phone}
            onPress={() => {
                store.dispatch(updateCartField({clientid: client.clientid,clientname: client.displayname}));
                navigation.goBack()
            }}
            left={() => <Avatar label={client.displayname} value={client.clientid} fontsize={14} size={40}/>}

        />
    )

    return (<TouchableOpacity onPress={() => {
         store.dispatch(updateCartField({clientid: client.clientid,clientname: client.displayname}));
        navigation.goBack()
    }} style={[styles.noshadow]}>
        <View style={[styles.p_4,styles.grid,styles.noWrap,styles.middle]}>
            <View>
                <Avatar label={client.displayname} value={client.clientid} fontsize={12} size={40}/>
            </View>
            <View style={[styles.ml_2]}>
                <Paragraph style={[styles.paragraph,styles.text_sm]}>{client.displayname}</Paragraph>
            </View>
        </View>

    </TouchableOpacity>)
}, (r1, r2) => {
    return ((r1.client.clientid === r2.client.clientid));
})

const Index = (props: any) => {

    let [clients, setClients] = useState([]);
    let [search, setSearch] = useState('');
    const [refreshing, setRefreshing]: any = useState(false);
    const [loading, setLoading]: any = useState(false);
    const navigation = useNavigation()

    const handleSearch = async (search?: any) => {
        await getClientsByWhere({search: search, start: 0}).then((clients) => {
            setClients(clients);
            setSearch(search)
            setLoading(true)
        });
    }

    useEffect(()=>{
        getPhones(false).then()
    },[])

    const getPhones = async (force:any) => {
        await gePhonebook(force);
        force && handleSearch().then()
    }


    const renderclients = (i: any) => {
        return (
            <Item client={i.item} index={i.index} search={true} key={i.item.clientid}/>
        );
    };


    return (
        <Container style={{padding:0,backgroundColor:'white'}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[{padding: 10}]}>
                    <SearchBox handleSearch={handleSearch} onIconPress={() => navigation.goBack()}
                               icon={{ source: 'arrow-left', direction: 'auto' }} autoFocus={false}  placeholder="Search Client..."/>
                </View>

                <Card style={[styles.card,styles.h_100, styles.flex,{marginBottom:0}]}>
                    <Card.Content style={[styles.cardContent,{paddingHorizontal:5,paddingVertical:0}]}>

                        {loading && <FlatList
                            data={clients}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => getPhones(true)}
                                />
                            }
                            renderItem={renderclients}
                            ItemSeparatorComponent={ItemDivider}
                            ListEmptyComponent={Boolean(search.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No
                                        result found</Text>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> Tap
                                        to Create New Client.</Text>

                                    <View style={[styles.grid, styles.center,styles.mt_3]}>
                                        <Button
                                            more={{color:'white'}}
                                            secondbutton={true}
                                            onPress={async () => {
                                                navigation.navigate("AddEditClient",{search:search});
                                            }}> + Create Client
                                        </Button>
                                    </View>

                                </View>

                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search
                                    Client from here</Text>
                            </View>}
                            keyExtractor={client => client.clientid}
                        />}
                    </Card.Content>
                </Card>

            </View>
        </Container>

    )

}



export default Index;




