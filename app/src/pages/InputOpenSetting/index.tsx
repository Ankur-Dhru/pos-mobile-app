import React, {useEffect} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph} from "react-native-paper"
import {appLog, arraySome, clone, isEmpty, objToArray, saveLocalSettings} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {localredux} from "../../libs/static";

import {ProIcon} from "../../components";

const Index = ({defaultAmountOpen}: any) => {

    const dispatch = useDispatch()
    const {unit: units}: any = localredux.initData
    const {currentLocation: {departments}} = localredux.localSettingsData;

    useEffect(() => {

    }, [])


    const onPressSetDefault = async (unitKey: any) => {
        let newData = [];
        if (!isEmpty(defaultAmountOpen)) {
            newData = clone(defaultAmountOpen)
        }

        if (arraySome(newData, unitKey)) {
            newData = newData.filter((k: string) => k !== unitKey)
        } else {
            newData = [...newData, unitKey]
        }
        await saveLocalSettings('defaultAmountOpen', newData).then(() => {
            // dispatch(setDialog({visible: false}))
        })
    }

    const renderitem = ({item}: any) => {
        appLog("item", item);

        let text = item?.data?.unitname;
        if (item?.data?.unitcode) {
            text = text + " (" + item?.data?.unitcode + ")";
        }

        return <>
            <TouchableOpacity onPress={() => onPressSetDefault(item?.key)}>
                <View style={[styles.grid, styles.middle, styles.bg_white, {
                    width: 'auto',
                    padding: 16,
                    borderRadius: 5,
                }]}>
                    <Paragraph style={[styles.grid, styles.middle, styles.bg_white, {
                        marginRight: 6
                    }]}><ProIcon name={arraySome(defaultAmountOpen, item?.key) ? "square-check" : "square"}
                                 action_type={'text'}/></Paragraph>
                    <Paragraph style={[styles.paragraph, styles.bold]}>  {text}</Paragraph>
                </View>
            </TouchableOpacity>
            <Divider/>
        </>
    }


    return <Container>
        <FlatList
            data={objToArray(units)?.filter((u: any) => Boolean(u?.data?.isdecimal))}
            renderItem={renderitem}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'always'}
            initialNumToRender={5}
        />
    </Container>

}


const mapStateToProps = (state: any) => ({
    defaultAmountOpen: state.localSettings?.defaultAmountOpen || {}
})

export default connect(mapStateToProps)(Index);

