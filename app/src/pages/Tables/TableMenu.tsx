import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';
import {styles} from "../../theme";
import ProIcon from "../../components/ProIcon";

const Index = ({data,setTableOrderDetail}:any) => {
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const splitTable = () => {
        setTableOrderDetail({invoiceitems: [], kots: [], ...data})
        closeMenu()
    }

    return (
        <View
            style={[styles.absolute,styles.p_3,{right:0}]}
            >
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<TouchableOpacity style={[styles.p_3]} onPress={openMenu}><ProIcon name={'ellipsis-vertical'} type={"solid"}  size={'18'}  action_type={'text'}/></TouchableOpacity>}>
                <Menu.Item onPress={() => splitTable()} title="Split" />

            </Menu>
        </View>
    );
};

export default Index;
