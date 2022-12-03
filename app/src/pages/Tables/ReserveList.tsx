import {FlatList, TouchableOpacity, View} from "react-native";
import {Caption, Card, Divider, List, Paragraph, Text} from "react-native-paper";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {appLog, dateFormat, getTempOrders, isEmpty} from "../../libs/function";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {current, ItemDivider} from "../../libs/static";
import moment from "moment";


const ReserveList = (props: any) => {

    const {navigation} = props;
    const [tableList,setTableList]:any = useState({})


    useEffect(()=>{
        getTempOrders().then(async (tableorders:any)=>{
            setTableList(tableorders)
        })
    },[])


    const dispatch = useDispatch();

    const onClickReserveTable = () => {
        dispatch(setBottomSheet({visible: false}))
    }

    const onClickReserveItem = (item: any) => {
        onClickReserveTable();
        setTimeout(()=>{
            navigation.navigate('CartStackNavigator', item)
        },200)
    }

    return <View style={[styles.p_6, styles.w_100, styles.h_100]}>



                <Caption style={[styles.caption]}>Reserved Tables</Caption>

        <FlatList
            data={Object.values(tableList).filter((item: any) => !isEmpty(item?.reservetable))}
            renderItem={(data: any) => {

                return <List.Item
                    style={[styles.listitem]}
                    title={`${data?.item?.tablename} - ${data?.item?.clientname} (Paxes : ${data.item?.paxes})`}
                    description={`${moment(data?.item?.date).format(dateFormat())} ${moment(data?.item?.time).format(' hh:mm A')}`}
                    onPress={() => {
                        onClickReserveItem(data?.item)
                    }}
                    right={() =>  <List.Icon icon="chevron-right"/>}
                />

            }}
            initialNumToRender={5}
            ItemSeparatorComponent={ItemDivider}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            ListEmptyComponent={() => {
                return (<View style={[]}><Paragraph  style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>No any Reserve Table</Paragraph></View>)
            }}
        />

    </View>
}

const mapStateToProps = (state: any) => ({
    tableOrdersData: state.tableOrdersData,
})

export default connect(mapStateToProps)(ReserveList);

