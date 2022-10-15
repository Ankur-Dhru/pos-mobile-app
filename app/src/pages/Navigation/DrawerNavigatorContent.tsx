import React from "react";
import {appLog, isEmpty, isRestaurant, retrieveData, storeData, syncData} from "../../libs/function";
import {Dimensions, Image, ScrollView, View} from "react-native";
import {Card, List, Text,Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import Avatar from "../../components/Avatar";
import {useNavigation} from "@react-navigation/native";
import {ACTIONS, APP_NAME, localredux, METHOD, posUrl, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";


const Index = () => {

    const {avatar_url, companyname, email, firstname, lastname} = localredux.authData;

    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation()

    const isRes = isRestaurant();

    const logoutUser = () => {
        navigation.navigate("PinStackNavigator");
    }


    return <View style={[styles.h_100]}>
        {/*<Card style={[styles.card]}>*/}
        {/*    <Card.Content>*/}
        {/*        <View style={[styles.grid, styles.middle, styles.noWrap]}>*/}
        {/*            <Avatar label={APP_NAME} value={1} fontsize={15} lineheight={18}*/}
        {/*                    size={40}/>*/}
        {/*            <View style={[styles.ml_2]}>*/}
        {/*                <Text style={[styles.paragraph, styles.text_md, {*/}
        {/*                    lineHeight: 20,*/}
        {/*                    fontSize: 18,*/}
        {/*                    fontWeight:"bold"*/}
        {/*                }]}>{APP_NAME}</Text>*/}
        {/*            </View>*/}
        {/*        </View>*/}
        {/*    </Card.Content>*/}
        {/*</Card>*/}

        <Card style={[styles.card]}>
            <Card.Content>

                <View style={[styles.grid, styles.middle, styles.noWrap]}>

                    <Image
                        style={[{width: 50, height: 50}]}
                        source={require('../../assets/dhru-logo-22.png')}
                    />

                    <View style={[styles.ml_2]}>
                        <View>
                            <Paragraph style={[styles.paragraph,styles.bold,styles.text_lg]}>Dhru POS</Paragraph>
                        </View>
                        <Text style={[styles.paragraph, styles.text_md, {
                            lineHeight: 20,
                            fontSize: 16
                        }]}>{firstname + ' ' + lastname}</Text>
                        {/*{Boolean(email) &&
                            <Text style={[styles.paragraph, styles.muted, styles.text_xs]}>{email}</Text>}*/}
                    </View>
                </View>
            </Card.Content>
        </Card>


        <Card style={[styles.card,styles.flex,styles.h_100,]}>
            <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                <ScrollView keyboardShouldPersistTaps='handled' style={[styles.h_100]}>
                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Sales Report'}
                        onPress={() => {
                            navigation.navigate("SalesReportNavigator");
                        }}
                    />
                </ScrollView>

                <View style={{marginTop:'auto'}}>
                    {
                        isRes && <>
                            <List.Item
                                style={[styles.listitem]}
                                titleStyle={{marginLeft: 0, paddingLeft: 0}}
                                title={'Default Amount Input Open'}
                                onPress={() => {
                                    navigation.navigate("InputOpenNavigator");
                                }}
                            />
                            <List.Item
                                style={[styles.listitem]}
                                titleStyle={{marginLeft: 0, paddingLeft: 0}}
                                title={'Quick Amount'}
                                onPress={() => {
                                    navigation.navigate("InputValueNavigator");
                                }}
                            />
                        </>
                    }

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Printer Settings'}
                        onPress={() => {
                            navigation.navigate("PrinterNavigator");
                        }}
                    />

                    <List.Item
                        style={[styles.listitem]}
                        titleStyle={{marginLeft: 0, paddingLeft: 0}}
                        title={'Sync'}
                        /*left={props => <List.Icon    {...props} icon={() => <ProIcon name={'plus'} action_type={'text'}/>}/>}*/
                        onPress={() => {
                            syncData().then()
                        }}
                    />

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


