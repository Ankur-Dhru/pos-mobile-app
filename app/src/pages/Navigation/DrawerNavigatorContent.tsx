import React from "react";
import {syncData} from "../../libs/function";
import {Dimensions, ScrollView, View} from "react-native";
import {Card, List, Text} from "react-native-paper";
import {styles} from "../../theme";
import Avatar from "../../components/Avatar";
import {useNavigation} from "@react-navigation/native";
import {localredux} from "../../libs/static";


const Index = () => {

    const {avatar_url, companyname, email, firstname, lastname} = localredux.authData;

    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation()

    const logoutUser = () => {
        navigation.navigate("PinStackNavigator");
    }

    return <View style={[styles.h_100, styles.px_5]}>


        <Card style={[styles.card]}>
            <Card.Content>
                <View style={[styles.grid, styles.middle, styles.noWrap]}>
                    <Avatar label={firstname + ' ' + lastname} value={1} fontsize={20} lineheight={50}
                            size={50}/>
                    <View style={[styles.ml_2]}>
                        <Text style={[styles.paragraph, styles.text_md, {
                            lineHeight: 20,
                            fontSize: 16
                        }]}>{firstname + ' ' + lastname}</Text>
                        {Boolean(email) &&
                            <Text style={[styles.paragraph, styles.muted, styles.text_xs]}>{email}</Text>}
                    </View>
                </View>
            </Card.Content>
        </Card>


        <Card style={[styles.card, {height: windowHeight - 300}]}>
            <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                <ScrollView keyboardShouldPersistTaps='handled'>

                </ScrollView>
            </Card.Content>
        </Card>

        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                <View>
                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Sync'}
                        /*left={props => <List.Icon    {...props} icon={() => <ProIcon name={'plus'} action_type={'text'}/>}/>}*/
                        onPress={() => {
                            syncData().then()
                        }}
                    />

                </View>
            </Card.Content>
        </Card>

        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                <View>

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={[styles.red]}
                        title={'Logout'}
                        /*left={props => <List.Icon {...props} icon={() => <ProIcon name={'sign-out'} color={styles.red.color} action_type={'text'}/>}/>}*/
                        onPress={() => {
                            logoutUser();
                        }}
                    />
                </View>
            </Card.Content>
        </Card>

    </View>
}


export default Index;


