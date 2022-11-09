import React, {memo} from "react";
import {Caption, Divider, Paragraph, Text, Title} from "react-native-paper";

import {Container, ProIcon} from "../../components";
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";
import Avatar from "../../components/Avatar";
import {CommonActions} from "@react-navigation/native";
import DeleteButton from "../../components/Button/DeleteButton";
import {ACTIONS, grecaptcharesponse, localredux, loginUrl, METHOD, STATUS} from "../../libs/static";
import apiService from "../../libs/api-service";
import {appLog, chevronRight, isEmpty} from "../../libs/function";




const Index = (props: any) => {

    const {navigation,}: any = props;
    const {firstname, lastname,email : aemail } = localredux.authData;
    const {password,email} = localredux.licenseData

    const closeAccount = async () => {

        let access = {email:email,password:password}
        access = {
            ...access,
            "g-recaptcha-response": grecaptcharesponse
        }
        await apiService({
            method: METHOD.POST,
            action: ACTIONS.LOGIN,
            other: {url: loginUrl},
            body: access
        }).then((response: any) => {

            if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                apiService({
                    method: METHOD.DELETE,
                    action: ACTIONS.REGISTER,
                    other: {url: loginUrl},
                    token:response.token
                }).then((result) => {
                    if (result.status === STATUS.SUCCESS) {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {name: 'SetupStackNavigator'},
                                ],
                            })
                        );
                    }
                });
            }
            else{
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {name: 'SetupStackNavigator'},
                        ],
                    })
                );
            }
        })



    }


    return <Container>
        <View>
            <View style={[{justifyContent: 'center', alignItems: 'center',}, styles.pb_4]}>
                <Avatar label={firstname + ' ' + lastname} value={1} fontsize={20} lineheight={70} size={72}/>
                <View>
                    <Title style={[styles.text_md, styles.textCenter]}>{firstname + ' ' + lastname}</Title>
                    <Caption style={[styles.paragraph, styles.textCenter, styles.mb_10]}>{aemail}</Caption>
                </View>
            </View>
            <Divider style={[styles.divider]}/>

            <View style={[styles.w_100]}>
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {name: 'PinStackNavigator'},
                            ],
                        })
                    );
                } }>
                    <View style={[styles.grid, styles.middle, styles.p_5, styles.w_100]}>
                        <View style={[styles.grid, styles.middle, styles.noWrap, styles.w_auto]}>
                            <ProIcon name={'user'} type={'light'} size={18}/>
                            <Paragraph
                                style={[styles.paragraph, styles.ml_2]}>{'Reset Terminal'}</Paragraph>
                        </View>
                        {
                            <View style={[styles.ml_auto]}>
                                <View>
                                    <Text>
                                        {chevronRight}
                                    </Text>
                                </View>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <Divider style={[styles.divider]}/>
            </View>

            <View style={[{justifyContent: 'center', alignItems: 'center', marginTop: 20}]}>

                <DeleteButton
                    title={'Close & Delete Account'}
                    buttonTitle={'Close & Delete Account'}
                    message={`Are you sure want to delete "${email}" account?`}
                    onPress={(index: any) => {
                        if (index === 0) {
                            closeAccount()
                        }
                    }}
                />

            </View>
        </View>
    </Container>
}


export default memo(Index);

