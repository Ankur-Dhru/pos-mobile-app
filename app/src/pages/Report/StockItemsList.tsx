import {device, ItemDivider} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Card, List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, ProIcon, SearchBox} from "../../components";

import {connect} from "react-redux";

import {useNavigation} from "@react-navigation/native";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import PageLoader from "../../components/PageLoader";


const Index = (props: any) => {


    let [loader, setLoader]: any = useState(true);
    let [search, setSearch]: any = useState('');
    let [filteItems, setFilteItems]: any = useState([]);

    const navigation = useNavigation()

    const handleSearch = async (search?: any) => {
        setSearch(search);
    }

    useEffect(() => {
        getList()
    }, [search])




    const  getList = () => {
        getItemsByWhere({itemname: search}).then((items: any) => {
            setFilteItems(items);
            setLoader(false)
        });
    }


    const renderItem = useCallback(({item, index}: any) => {

        return <List.Item title={item.itemname}
                          titleStyle={{textTransform: 'capitalize'}}
                          onPress={()=>{
                              navigation.push('CurrentStock',{item: item})
                          }}
                          right={() => <View style={[styles.mt_2]}><ProIcon name={'chevron-right'} /></View> }
        />
    }, [filteItems]);


    if(loader){
        return <PageLoader/>
    }



    return (
        <Container style={{backgroundColor: 'white', padding: 0}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[styles.grid, styles.middle, styles.justifyContent, {padding: 10}]}>
                    <View style={[styles.w_auto]}>
                        <SearchBox handleSearch={handleSearch}  autoFocus={false}    placeholder="Search Item..."/>
                    </View>

                </View>


                <Card style={[styles.card, styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent, {paddingVertical: 0}]}>

                        {<FlatList
                            data={filteItems}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            ItemSeparatorComponent={ItemDivider}
                            ListEmptyComponent={Boolean(filteItems?.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No result found</Text>
                                </View>
                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search Item from here</Text>
                            </View>}
                            keyExtractor={item => item.itemid}
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
