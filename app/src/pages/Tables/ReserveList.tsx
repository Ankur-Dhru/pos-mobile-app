import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, Text} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import React from "react";
import {connect, useDispatch} from "react-redux";
import {appLog, dateFormat, isEmpty} from "../../libs/function";
import {styles} from "../../theme";
import {Button} from "../../components";
import {current} from "../../libs/static";
import moment from "moment";

const ReserveList = (props: any) => {

    const {tableOrdersData,navigation} = props;

    const dispatch = useDispatch();

    const onClickReserveTable = () => {
        dispatch(setDialog({visible: false}))
    }

    const onClickReserveItem = (item: any) => {
        onClickReserveTable();
        navigation.navigate('CartStackNavigator', item)
    }

    return <View>
        <FlatList
            data={Object.values(tableOrdersData).filter((item: any) => !isEmpty(item?.reservetable))}
            renderItem={(data: any) => {

                return <TouchableOpacity onPress={() => onClickReserveItem(data?.item)}>
                    <View style={[styles.py_4]}>
                        <View><Text style={[styles.bold]}>{data?.item?.clientname}</Text></View>
                        <View style={[styles.grid]}><Text>{data?.item?.tablename} </Text><Text> {moment(data?.item?.date).format(dateFormat())}</Text><Text> {moment(data?.item?.time).format('HH:mm')}</Text></View>
                    </View>
                    <Divider/>
                </TouchableOpacity>
            }}
            initialNumToRender={5}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            ListEmptyComponent={() => {
                return (<View style={[]}><Paragraph  style={[styles.paragraph, styles.p_6, styles.muted, {textAlign: 'center'}]}>No any Table</Paragraph></View>)
            }}
        />
        <View style={[styles.grid, styles.justifyContent, styles.mt_4]}>
            <View></View>
            <Button onPress={onClickReserveTable}>close</Button>
        </View>
    </View>
}

const mapStateToProps = (state: any) => ({
    tableOrdersData: state.tableOrdersData,
})

export default connect(mapStateToProps)(ReserveList);

