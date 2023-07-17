import React, {useRef} from "react";
import {TouchableOpacity, View,} from "react-native";

import {connect} from "react-redux";

import {appLog, selectItem} from "../../libs/function";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";
import {styles} from "../../theme";
import {Paragraph, Searchbar} from "react-native-paper";
import {ProIcon, SearchBox} from "../../components";
import {useNavigation} from "@react-navigation/native";


const Index = (props: any) => {

    let searchRf:any = useRef()
    const navigation = useNavigation()

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

    return <View>

        <View style={[styles.grid, styles.middle, styles.justifyContent,styles.mb_3]}>
            <View style={[styles.w_auto]}>
                <Searchbar
                    ref={(ref)=> {
                        searchRf = ref
                    }}
                    placeholder={`Enter SKU`}
                    onChangeText={onChangeSearch}
                    autoFocus={true}
                    value={searchQuery}

                    onSubmitEditing={() => handleSearch(searchQuery.trim(),'submit')}
                    style={[styles.noshadow,{elevation: 0,  borderRadius: 5,backgroundColor:styles.light.color}]}

                />
            </View>
            <View>
                <TouchableOpacity onPress={async () => {
                    navigation.navigate('ScanItem');
                }}>
                    <Paragraph style={[styles.paragraph, {marginTop: 10}]}><ProIcon
                        name={'scanner-gun'}/></Paragraph></TouchableOpacity>
            </View>
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(Index);
