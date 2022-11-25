import {device} from "../../libs/static";
import React, {memo, useEffect,  useState} from "react";
import {FlatList, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, SearchBox} from "../../components";

import {gePhonebook} from "../../libs/function";


import {getClientsByWhere} from "../../libs/Sqlite/selectData";


import {useNavigation} from "@react-navigation/native";

import store from "../../redux-store/store";
import {updateCartField} from "../../redux-store/reducer/cart-data";


const Item = memo(({client}: any) => {

    const navigation = useNavigation();
    return (<TouchableOpacity onPress={() => {
         store.dispatch(updateCartField({clientid: client.clientid,clientname: client.displayname}));
        navigation.goBack()
    }} style={[styles.noshadow]}>
        <View style={[styles.p_4]}>
            <View>
                <Paragraph style={[styles.paragraph,styles.text_sm]}>{client.displayname}</Paragraph>
            </View>
        </View>
        <Divider/>
    </TouchableOpacity>)
}, (r1, r2) => {
    return ((r1.client.clientid === r2.client.clientid));
})

const Index = (props: any) => {

    let [clients, setClients] = useState([]);
    let [search, setSearch] = useState('');
    const [refreshing, setRefreshing]: any = useState(false);
    const [loading, setLoading]: any = useState(true);

    const handleSearch = async (search?: any) => {
        setLoading(false)

        await getClientsByWhere({search: search, start: 0}).then((clients) => {
            setClients(clients);
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


    useEffect(() => {
        device.search = search
    }, [search])

    const renderclients = (i: any) => {
        return (
            <Item client={i.item} index={i.index} search={true} key={i.item.clientid}/>
        );
    };


    return (
        <Container>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[{marginTop: 10}]}>
                    <SearchBox handleSearch={handleSearch} autoFocus={false}  placeholder="Search Client..."/>
                </View>

                <Card style={[styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent]}>

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
                            ListEmptyComponent={Boolean(search.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No
                                        result found</Text>
                                    <Text
                                        style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> Tap
                                        to Create New Client.</Text>
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




