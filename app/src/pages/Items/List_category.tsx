import {device, ItemDivider} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Card, List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, ProIcon, SearchBox} from "../../components";

import {
    appLog,
    clone,
    filterArray,
    getItemImage,
    getRoleAccess,
    isRestaurant,
    selectItem,
    toCurrency
} from "../../libs/function";
import {connect, useDispatch} from "react-redux";

import {useNavigation} from "@react-navigation/native";


const Item = memo(({item, navigation}: any) => {

    return <List.Item title={item.itemgroupname}
                      titleStyle={{textTransform: 'capitalize'}}
                      onPress={() => {
                          navigation.navigate('AddEditCategory', {data: {...item, edit: true}})
                      }}
                      right={() => <View style={[styles.mt_2]}><ProIcon name={'chevron-right'}/></View>}
    />
}, (r1, r2) => {
    return ((r1.item === r2.item));
})

const Index = ({grouplist}: any) => {


    let [category, setCategory]: any = useState(grouplist);

    const navigation = useNavigation()

    const handleSearch = async (search?: any) => {
        if (Boolean(search.length)) {
            setCategory(filterArray(Object.values(grouplist), ['itemgroupname'], search))
        } else {
            setCategory(Object.values(grouplist))
        }
    }

    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={item} navigation={navigation}/>
    }, [grouplist]);


    useEffect(() => {
        setCategory(Object.values(grouplist))
    }, [grouplist])


    const access = getRoleAccess('Item Category')

    if(access.add) {
        navigation.setOptions({
            headerRight: () => <Appbar.Action icon="plus" onPress={() => navigation.navigate('AddEditCategory')}/>
        })
    }


    return (
        <Container style={{backgroundColor: 'white', padding: 0}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[styles.grid, styles.middle, styles.justifyContent, {padding: 10}]}>
                    <View style={[styles.w_auto]}>
                        <SearchBox handleSearch={handleSearch} autoFocus={false} placeholder="Search Category..."/>
                    </View>

                </View>


                <Card style={[styles.card, styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent, {paddingVertical: 0}]}>

                        {<FlatList
                            data={Object.values(category)}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            ItemSeparatorComponent={ItemDivider}
                            ListEmptyComponent={Boolean(Object.values(category)?.length > 0) ? <View>
                                <View style={[styles.p_6]}>
                                    <Text
                                        style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No
                                        result found</Text>
                                </View>
                            </View> : <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search
                                    Category from here</Text>
                            </View>}
                            keyExtractor={item => item.itemgroupid}
                        />}
                    </Card.Content>
                </Card>


            </View>
        </Container>

    )

}

const mapStateToProps = (state: any) => ({
    grouplist: state.groupList
})

export default connect(mapStateToProps)(memo(Index));
