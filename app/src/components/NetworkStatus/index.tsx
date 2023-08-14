import {View} from "react-native";
import {Text} from "react-native-paper";
import {connect, useDispatch} from "react-redux";
import {styles} from "../../theme";
import {appLog} from "../../libs/function";

const Index = ({internet}: any) => {

    let connected = Boolean(internet);

    if (connected) {
        return <></>
    }

    return <View style={[styles.absolute,{bottom:0,left:0,right:0}]}>
        <Text
            style={[styles.textCenter, {
                color: "white",
                backgroundColor: connected ? styles.green.color : styles.red.color
            }]}>{connected ? "Online" : "Offline"}</Text>
    </View>
}

const mapStateToProps = (state: any) => ({
    internet: state.localSettings?.internet
})

export default connect(mapStateToProps)(Index);
