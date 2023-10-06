import React, {useEffect, useRef, useState} from "react";
import {Platform, TouchableOpacity, View,} from "react-native";

import {connect} from "react-redux";

import {appLog, isRestaurant, loadContacts, selectItem, totalOrderQnt} from "../../libs/function";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";
import {styles} from "../../theme";
import {Paragraph, Searchbar} from "react-native-paper";
import {ProIcon, SearchBox} from "../../components";
import {useNavigation} from "@react-navigation/native";
import {ACTIONS, localredux, METHOD, STATUS, urls, VOUCHER} from "../../libs/static";
import apiService from "../../libs/api-service";
import {v4 as uuidv4} from "uuid";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";


const Index = (props: any) => {

    let searchRf: any = useRef()
    let touchableRef: any = useRef()
    const navigation = useNavigation()

    const {searchserialno} = props


    const handleSearch = async (search: any) => {
        if (search) {
            await getItemsByWhere({itemname: search, start: 0}).then((items) => {
                if (Boolean(items.length)) {
                    selectItem(items[0]).then();
                    searchRf.clear()
                } else {
                    store.dispatch(setAlert({visible: true, message: 'No any item found'}));
                }
            });
        }
        setTimeout(() => {
            searchRf?.focus()
        }, 500)
    }

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => {
        setSearchQuery(query)
    };

    useEffect(() => {
        setTimeout(() => {
            touchableRef.setNativeProps?.({hasTVPreferredFocus: true})
        }, 1000)
    }, [])

    return <View  style={[styles.grid, styles.middle, styles.justifyContent]}>

        <View style={[styles.grid, styles.middle, styles.justifyContent, styles.mb_3, styles.relative,styles.w_auto]}>
            <View style={[styles.w_auto]}>
                <Searchbar
                    ref={(ref) => {
                        searchRf = ref
                    }}
                    placeholder={`Enter SKU`}
                    onChangeText={onChangeSearch}
                    autoFocus={false}
                    value={searchQuery}

                    onSubmitEditing={() => handleSearch(searchQuery.trim(), 'submit')}
                    style={[styles.noshadow, {elevation: 0, borderRadius: 5, backgroundColor: styles.light.color}]}
                    clearIcon={{}}

                />
            </View>
            <View style={[styles.absolute, {right: 10}]}>
                <TouchableOpacity ref={e => touchableRef = e} onPress={async () => {
                    if (Platform.OS === "ios") {
                        requestMultiple([PERMISSIONS.IOS.CAMERA]).then(async (statuses: any) => {
                            if (statuses[PERMISSIONS.IOS.CAMERA]) {
                                navigation.navigate('ScanItem');
                            }
                        });
                    }
                    else{
                        navigation.navigate('ScanItem');
                    }
                }}>
                    <Paragraph style={[styles.paragraph, {marginTop: 10}]}><ProIcon
                        name={'scanner-gun'}/></Paragraph></TouchableOpacity>
            </View>



        </View>

        {searchserialno && !isRestaurant() && <View>
            <TouchableOpacity ref={e => touchableRef = e} onPress={async () => {
                if (Platform.OS === "ios") {
                    requestMultiple([PERMISSIONS.IOS.CAMERA]).then(async (statuses: any) => {
                        if (statuses[PERMISSIONS.IOS.CAMERA]) {
                            navigation.navigate('ScanSerialno');
                        }
                    });
                }
                else{
                    navigation.navigate('ScanSerialno');
                }
            }}>
                <Paragraph style={[styles.paragraph, {marginTop: 10}]}><ProIcon
                    name={'barcode-read'}/></Paragraph></TouchableOpacity>
        </View>}

    </View>
}

const mapStateToProps = (state: any) => ({
    searchserialno: state.localSettings?.searchserialno,
})

export default connect(mapStateToProps)(Index);
