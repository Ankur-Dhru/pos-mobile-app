import React from "react";
import {FlatList, Text, View} from "react-native";
import {Caption, List, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {current} from "../../libs/static";
import {styles} from "../../theme";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {toCurrency} from "../../libs/function";


const Index = (props: any) => {

    const {tableorders} = props;

    const dispatch = useDispatch()

    const renderitem = ({item}: any) => {
        return <List.Item
            title={item.clientname}
            description={item.localdatetime}
            left={(props: any) => <List.Icon {...props} icon="folder"/>}
            right={(props: any) => <View><Text>{toCurrency(item.vouchertotaldisplay)}</Text></View>}
            onPress={async () => {
                current.table = item;
                await dispatch(setBottomSheet({visible: false}))
                dispatch(setCartData(item))
            }}
        />
    }


    return <View style={[styles.p_5, styles.w_100, styles.h_100]}>
        <Caption style={[styles.paragraph, styles.ml_2]}>{'On Hold List'}</Caption>
        <FlatList
            data={Object.values(tableorders)}
            renderItem={renderitem}
            initialNumToRender={5}
        />
    </View>
}


const mapStateToProps = (state: any) => ({
    tableorders: state.tableOrdersData || {}
})

export default connect(mapStateToProps)(withTheme(Index));

