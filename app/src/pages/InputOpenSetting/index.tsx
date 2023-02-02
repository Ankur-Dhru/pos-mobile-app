import React, {useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper"
import {appLog, arraySome, clone, isEmpty, objToArray, retrieveData, saveLocalSettings} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {localredux} from "../../libs/static";

import {ProIcon} from "../../components";
import {setSettings} from "../../redux-store/reducer/local-settings-data";
import CheckBox from "../../components/CheckBox";

const Index = ({defaultAmountOpen}: any) => {

    const dispatch = useDispatch()
    const {unit: units}: any = localredux.initData
    const {currentLocation: {departments}} = localredux.localSettingsData;
    const [loading, setLoading]: any = useState(false)

    let [initdata, setInitdata]: any = useState({canchangeamount: false, defaultOpenUnitType: false, defaultAmountOpen: []})



    useEffect(() => {
        retrieveData(`fusion-dhru-pos-settings`).then(async (data: any) => {
            setInitdata(data);
            setLoading(true);
        })
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

        initdata = {
            ...initdata,
            defaultAmountOpen: newData
        }
        dispatch(setSettings(initdata));

        await saveLocalSettings('defaultAmountOpen', newData).then(() => {
            // dispatch(setDialog({visible: false}))
        })
    }

    const renderitem = ({item}: any) => {

        let text = item?.data?.unitname;
        if (item?.data?.unitcode) {
            text = text + " (" + item?.data?.unitcode + ")";
        }

        return <>
            <TouchableOpacity onPress={() => onPressSetDefault(item?.key)}>
                <View style={[styles.grid, styles.middle, styles.bg_white, {
                    width: 'auto',
                    padding: 16,
                }]}>
                    <Paragraph style={[styles.grid, styles.middle, styles.bg_white, {
                        marginRight: 6
                    }]}><ProIcon name={arraySome(defaultAmountOpen, item?.key) ? "square-check" : "square"}
                                 action_type={'text'}/></Paragraph>
                    <Paragraph style={[styles.paragraph, styles.bold]}>  {text}</Paragraph>
                </View>
            </TouchableOpacity>

        </>
    }

    if (!loading) {
        return <></>
    }

    return <Container>




        <Card style={[styles.card]}>
            <Card.Content  style={[styles.cardContent]}>

                <View>
                    <CheckBox
                        value={initdata.canchangeamount}
                        label={'Can change amount'}
                        onChange={(value: any) => {
                            initdata = {
                                ...initdata,
                                canchangeamount: value
                            }
                            setInitdata(initdata)
                            dispatch(setSettings(initdata));
                            saveLocalSettings("canchangeamount", value).then();
                        }}
                    />
                </View>


                {initdata.canchangeamount && <><View>
                    <CheckBox
                        value={initdata.defaultOpenUnitType}
                        label={'quantity or amount on add to cart by unit type'}
                        onChange={(value: any) => {
                            initdata = {
                                ...initdata,
                                defaultOpenUnitType: value
                            }
                            setInitdata(initdata)
                            dispatch(setSettings(initdata));
                            saveLocalSettings("defaultOpenUnitType", value).then();
                        }}
                    />
                </View>


                {initdata.defaultOpenUnitType &&  <FlatList
                    data={objToArray(units)?.filter((u: any) => Boolean(u?.data?.isdecimal))}
                    renderItem={renderitem}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'always'}
                    initialNumToRender={5}
                />}

                </>}


                    </Card.Content>
        </Card>
    </Container>

}


const mapStateToProps = (state: any) => ({
    defaultAmountOpen: state.localSettings?.defaultAmountOpen || {}
})

export default connect(mapStateToProps)(Index);

