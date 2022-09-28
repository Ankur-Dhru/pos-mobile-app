import apiService from "../../libs/api-service";
import {ACTIONS, METHOD, STATUS} from "../../libs/static";
import React, {useState} from "react";
import {View} from "react-native";
import {Button, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";


const Index = ({orders}:any) => {

    const [name, setName] = useState('Helo');

    console.log('orders',orders)

    return <View>
        <Paragraph style={[styles.paragraph, styles.mb_5]}>Cart</Paragraph>
    </View>
}

const mapStateToProps = (state: any) => ({
    orders: state.ordersData || {},
})

export default connect(mapStateToProps)(Index);
