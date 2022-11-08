import {device, localredux} from "../../libs/static";
import React, {memo, useEffect, useRef, useState} from "react";
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Button, ProIcon, SearchBox} from "../../components";

import {appLog, filterArray, selectItem} from "../../libs/function";

import AddButton from "./AddButton";
import {connect, useDispatch} from "react-redux";
import {closePage, setModal} from "../../redux-store/reducer/component";
import {getItemsByWhere, readTable} from "../../libs/Sqlite/selectData";

import {AddItem} from "./ItemListTablet";
import Search from "../../components/SearchBox";


const Item = memo(({item}:any) => {

    const dispatch = useDispatch()

    return (<TouchableOpacity onPress={() => {
        selectItem(item);
        dispatch(closePage(device.lastmodal))
    }} style={[styles.noshadow]}>
        <View style={[styles.grid, styles.noWrap, styles.top,styles.p_4]}>
            <View style={[{width:'62%'}]}>
                <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>
            </View>
            {<View  style={[styles.ml_auto]}>
                <AddButton item={item}  />
            </View>}
        </View>

        <Divider/>

    </TouchableOpacity>)
},(r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})

const Index = ({navigation,pageKey}:any) => {


    const dispatch = useDispatch();
    const searchRf = useRef();


    let [items, setItems] = useState([]);
    let [search,setSearch] = useState('');
    const [loading,setLoading]:any = useState(false);


    const handleSearch = async (search:any) => {
        if (Boolean(search) && search.length>3) {
            setSearch(search);
            await getItemsByWhere({itemname:search,start:0}).then((items)=>{
                setItems(items);
                setLoading(true)
            });
        }
    }


    useEffect(()=>{
        device.search = search
    },[search])

    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index} search={true} key={i.item.key || i.item.productid}/>
        );
    };

    return (
        <SafeAreaView style={[styles.h_100]}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <Appbar.Header style={[styles.bg_white,styles.noshadow,styles.borderBottom,styles.justifyContent,]}>

                    <View><TouchableOpacity onPress={()=>{dispatch(closePage(device.lastmodal))}} style={[styles.p_5]}><Paragraph><ProIcon name={'xmark'}/></Paragraph></TouchableOpacity></View>

                    <View style={[styles.w_auto]}>
                        <Paragraph style={[styles.paragraph,styles.bold,{textAlign:'center'}]}>{'Items'}</Paragraph>
                    </View>

                    <TouchableOpacity style={[styles.p_5]} onPress={async () => {
                        await dispatch(closePage(device.lastmodal))
                        navigation.navigate('AddEditItemNavigator2');
                    }}>
                        <Paragraph><ProIcon  name={'plus'}/></Paragraph></TouchableOpacity>

                </Appbar.Header>



                <View style={[styles.grid, styles.middle]}>
                    <View style={[styles.flexGrow]}>
                        <SearchBox      handleSearch={handleSearch} autoFocus={true} placeholder="Search Item..."/>
                    </View>
                </View>

                <Card style={[styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent]}>
                        {loading &&  <FlatList
                            data={items}
                            renderItem={renderitems}
                            ListEmptyComponent={Boolean(search) ? <View>
                                <View  style={[styles.p_6]}>
                                    <Text style={[styles.paragraph,styles.mb_2, styles.muted, {textAlign: 'center'}]}> No result found</Text>
                                    <Text style={[styles.paragraph,  styles.text_xs,styles.muted, {textAlign: 'center'}]}> Tap to Create New Item.</Text>
                                </View>
                                <AddItem navigation={navigation}   />
                            </View> : <View  style={[styles.p_6]}>
                                <Text style={[styles.paragraph,styles.mb_2, styles.muted, {textAlign: 'center'}]}>Search Item from here</Text>
                            </View> }
                            keyExtractor={item => item.itemid}
                        />}
                    </Card.Content>
                </Card>

                {/*<View style={[styles.submitbutton]}>
                    <Button more={{backgroundColor: styles.light.color, color: 'black'}}
                            onPress={() => {
                                dispatch(closePage(device.lastmodal))
                            }}> Cancel
                    </Button>
                </View>*/}

            </View>
        </SafeAreaView>

    )

}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
