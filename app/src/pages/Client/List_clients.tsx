import {device, ItemDivider} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Card, List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, ProIcon, SearchBox} from "../../components";

import {appLog, clone, filterArray, getRoleAccess, startWith} from "../../libs/function";
import {connect} from "react-redux";

import {useNavigation} from "@react-navigation/native";
import {getClientsByWhere, getItemsByWhere} from "../../libs/Sqlite/selectData";
import PageLoader from "../../components/PageLoader";


const Index = (props: any) => {


    let [loader, setLoader]: any = useState(true);
    let [search, setSearch]: any = useState('');
    let [filteClients, setFilteClients]: any = useState([]);

    const navigation = useNavigation()

    const handleSearch = async (search?: any) => {
        setSearch(search);
    }

    useEffect(() => {
        getList()
    }, [search])


    const  getList = () => {
        getClientsByWhere({search: search}).then((clients: any) => {
            setFilteClients(clients);
            setLoader(false)
        });
    }


    const renderItem = useCallback(({item, index}: any) => {

        return <List.Item title={item.displayname}
                          titleStyle={{textTransform: 'capitalize'}}
                          onPress={()=>{
                              navigation.navigate('AddEditClient',{data: {...item,edit:true},getList:getList})
                          }}
                          right={() => <View style={[styles.mt_2]}><ProIcon name={'chevron-right'} /></View> }
        />
    }, [filteClients]);


    if(loader){
        return <PageLoader/>
    }

    const access = getRoleAccess('Clients')

    if(!access || access?.add) {
        navigation.setOptions({
            headerRight: () =>  <Appbar.Action icon="plus" onPress={() => navigation.navigate('AddEditClient',{getList:getList})}/>
        })
    }


    return (
        <Container style={{backgroundColor: 'white', padding: 0}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[styles.grid, styles.middle, styles.justifyContent, {padding: 10}]}>
                    <View style={[styles.w_auto]}>
                        <SearchBox handleSearch={handleSearch}  autoFocus={false}    placeholder="Search 123 Client..."/>
                    </View>

                </View>


                <Card style={[styles.card, styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent, {paddingVertical: 0}]}>

                        {<FlatList
                            data={filteClients}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            ItemSeparatorComponent={ItemDivider}
                            ListEmptyComponent={Boolean(filteClients?.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No result found</Text>
                                </View>
                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search Client from here</Text>
                            </View>}
                            keyExtractor={client => client.clientid}
                        />}
                    </Card.Content>
                </Card>


            </View>
        </Container>

    )

}

const mapStateToProps = (state: any) => ({

})

export default connect(mapStateToProps)(memo(Index));
