import {ordertypes} from "../../libs/static";
import React from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";

import {setSelected} from "../../redux-store/reducer/selected-data";
import ProIcon from "../../components/ProIcon";
import {useNavigation} from "@react-navigation/native";
import {Menu, Paragraph} from "react-native-paper";
import {setDialog} from "../../redux-store/reducer/component";
import ReserveList from "./ReserveList";
import AddTable from "./AddTable";


const OrderType = (props: any) => {
    const {type, selected, getOrder} = props;
    const navigation: any = useNavigation();
    const dispatch = useDispatch()


    return <>
        <TouchableOpacity onPress={() => {
            if (type.value === 'qsr') {
                navigation.navigate('CartStackNavigator', {
                    tablename: type.label,
                    ordertype: type.value,
                    invoiceitems: [],
                    kots: []
                });
            } else {
                dispatch(setSelected({...type, field: 'ordertype'}))
            }
        }}>
            <Paragraph
                style={[selected ? styles.muted : styles.primary, styles.bold, styles.text_sm, styles.p_6]}>{type.label}</Paragraph>
        </TouchableOpacity>
    </>
}


const Index = (props: any) => {

    const {ordertype, shifttable, setShifttable, getOrder} = props;
    const navigation: any = useNavigation();
    const dispatch = useDispatch();

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const onClickReserveTable = () => {
        closeMenu();
        dispatch(setDialog({
            visible: true,
            title: "Reserved Tables",
            hidecancel: true,
            width: '90%',
            component: () => <ReserveList navigation={navigation}/>
        }))
    }

    const onClickAddTable = () => {
        navigation.navigate('AddTable', {getOrder: getOrder})
        closeMenu();
    }

    return (

        <>
            <View style={[styles.grid, styles.noWrap, styles.justifyContent]}>

                <View>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('ProfileSettingsNavigator')
                    }} style={[{paddingLeft:10}]}>
                        <ProIcon name={'bars'}/>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal={true}>
                    {
                        ordertypes.map((type: any) => {
                            if (shifttable) {
                                return <Paragraph style={[styles.p_6]}> </Paragraph>
                            }
                            return <OrderType selected={ordertype?.value !== type.value} type={type} key={type.value}/>
                        })
                    }
                </ScrollView>

                <View>

                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<TouchableOpacity onPress={() => {
                            openMenu()
                        }} style={[styles.p_5]}>
                            <ProIcon name={'ellipsis-vertical'}/>
                        </TouchableOpacity>}>
                        <Menu.Item onPress={onClickAddTable} title="Add Table"/>
                        {!shifttable && <Menu.Item onPress={() => {
                            setShifttable(true)
                        }} title="Shift Table"/>}
                        {shifttable && <Menu.Item onPress={() => {
                            setShifttable(false)
                        }} title="Disable Shift"/>}
                        <Menu.Item onPress={onClickReserveTable} title="Reserve Tables"/>
                    </Menu>
                </View>

            </View>


        </>
    )
}

const mapStateToProps = (state: any) => ({
    ordertype: state.selectedData.ordertype,
})

export default connect(mapStateToProps)(Index);

