import React, {useCallback, useEffect, useState} from "react";

import {FlatList, Text, View} from "react-native";

import {styles} from "../../theme";
import {Caption} from "react-native-paper";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";
import {ItemDivider} from "../../libs/static";
import {Item} from "./ItemListMobile";
import {connect, useDispatch} from "react-redux";
import {Button} from "../../components";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {appLog} from "../../libs/function";


const Index = (props: any) => {

    const {comboitem, invoiceitems} = props;

    const [loading, setLoading]: any = useState(false);
    const [dataSource, setDataSource]: any = useState([]);

    const dispatch = useDispatch()

    useEffect(() => {


        getItemsByWhere({groupid: comboitem.comboid}).then((newitems: any) => {

            if (Boolean(newitems.length > 0)) {
                newitems = newitems?.map((i: any) => {
                    const find = invoiceitems.filter((ii: any) => {
                        return ((+i.itemid === +ii.itemid) && Boolean(ii.added));
                    })
                    if (Boolean(find) && Boolean(find[0])) {
                        return find[0]
                    }
                    return i;
                })

                setDataSource([...newitems]); //...dataSource,
            } else {
                setDataSource([]);
            }
            setLoading(true)
        });

    }, [comboitem.comboid, invoiceitems])


    const renderItem = useCallback(({item, index}: any) => {
        return <Item item={{...item}} index={index} key={item.productid}/>
    }, [comboitem.comboid]);


    if (!loading) {
        return <></>
    }

    return (
        <>
            <Caption style={[styles.caption]}>{comboitem.itemname}</Caption>
            <View style={[styles.h_100, styles.w_100,styles.flex, styles.p_5]}>
                <FlatList
                    data={dataSource}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    renderItem={renderItem}
                    getItemLayout={(data, index) => {
                        return {length: 100, offset: 100 * index, index};
                    }}
                    ItemSeparatorComponent={ItemDivider}
                    ListFooterComponent={() => {
                        return <View style={{height: 100}}></View>
                    }}
                    ListEmptyComponent={<View>
                        <View style={[styles.p_6]}>
                            <Text style={[styles.paragraph, styles.text_xs, styles.muted, {textAlign: 'center'}]}> No
                                any item(s) found</Text>
                        </View>
                    </View>}
                />

                <View>
                    <Button more={{color: 'black',backgroundColor:styles.secondary.color}}  onPress={() => {
                        dispatch(setBottomSheet({visible:false}))
                    }}> Close </Button>
                </View>

            </View>

        </>
    )
}

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
