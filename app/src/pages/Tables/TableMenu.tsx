import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';
import {styles} from "../../theme";
import ProIcon from "../../components/ProIcon";
import {useNavigation} from "@react-navigation/native";

const Index = ({data,setTableOrderDetail,shiftFrom}:any) => {
    const [visible, setVisible] = React.useState(false);
    const navigation = useNavigation()


    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const splitTable = () => {
        setTableOrderDetail({...data,tablename : data.tablename + ' - ' + ((+data.splitnumber || 0) + 1)})
        closeMenu()
    }



    return (
        <View style={[styles.absolute,styles.p_3,{right:0}]}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<TouchableOpacity style={[styles.p_3]} onPress={openMenu}><ProIcon name={'ellipsis-vertical'} type={"solid"}  size={18}  action_type={'text'}/></TouchableOpacity>}>
                <Menu.Item onPress={() => splitTable()} title="Split Table" />
                <Menu.Item onPress={() => shiftFrom(data.tableoderidforswitch,data.tableid)} title="Shift Table" />
                <Menu.Item onPress={() => navigation?.navigate('SwitchItems',{tableorderid:data.tableoderidforswitch})} title="Move Items" />
            </Menu>
        </View>
    );
};

export default Index;
