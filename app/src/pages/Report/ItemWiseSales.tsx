import React, {useEffect, useState} from "react";
import {FlatList, ScrollView, Text, View} from "react-native";
import {Caption, Card, Paragraph} from "react-native-paper"
import {appLog, dateFormat, objToArray, printDayEndReport, toCurrency} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {ACTIONS, ItemDivider, localredux, METHOD, urls} from "../../libs/static";
import apiService from "../../libs/api-service";

import moment from "moment";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";
import Button from "../../components/Button";


const Index = ({navigation}: any) => {

    let {
        licenseData,
    }: any = localredux;

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const currentdate = moment().format(dateFormat(false, true));

    const [data, setData] = useState<any>({});

    const [datetime, setDateTime]: any = useState({
        date: currentdate,
    });


    const getitemSales = (datetime: any) => {

        if (Boolean(datetime)) {
            apiService({
                method: METHOD.GET,
                action: ACTIONS.REPORTITEMWISE,
                workspace: workspace,
                token: token,
                queryString: {startdate: datetime.date,enddate: datetime.date,terminalid: licenseData?.data?.terminal_id},
                other: {url: urls.posUrl},
            }).then((response: any) => {
                setData({...response.data})
            }).catch((e) => {
                appLog('e', e)
            })
        }
    }

    useEffect(() => {
        getitemSales(datetime)
    }, [datetime])


    const renderItem = ({item:{data}, index}: any) => {

        return <View style={[styles.p_4]} key={index}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                <Paragraph
                    style={[styles.paragraph, styles.bold,{width:'50%'}]}>{`${data.item}`} </Paragraph>
                <Paragraph
                    style={[styles.paragraph, styles.text_xs,{width:'25%',textAlign:'center'}]}>{`${data.qnt}`}</Paragraph>
                <Paragraph
                    style={[styles.paragraph, styles.text_xs,{width:'25%',textAlign:'right'}]}>{toCurrency(+data.total)}</Paragraph>

            </View>
        </View>
    }

    const {info, summary}: any = data || {}


    return <Container style={styles.bg_white}>


            <Card style={[styles.card]}>
                <Card.Content style={[styles.cardContent]}>


                    <View style={[styles.grid, styles.justifyContent, styles.middle]}>

                        <View style={[styles.w_auto, styles.grid, styles.p_3, styles.center, styles.bg_light, {

                            borderRadius: 5
                        }]}>

                            <>
                                <InputField
                                    label={"Date"}
                                    displaytype={'bottomlist'}
                                    inputtype={'datepicker'}
                                    mode={'date'}
                                    removeSpace={true}
                                    render={() => {
                                        return <Paragraph
                                            style={[styles.paragraph, styles.bold]}>{moment(datetime.date).format(dateFormat())}</Paragraph>
                                    }}
                                    selectedValue={datetime?.date}
                                    onChange={(value: any) => {
                                        setDateTime({...datetime, date: value});
                                    }}
                                />

                            </>

                        </View>

                    </View>


                </Card.Content>
            </Card>



            <KeyboardScroll>

                {Boolean(objToArray(data?.data)?.length) &&   <Card style={[styles.card,styles.mt_2]}>
                    <Card.Content style={[styles.cardContent]}>
                        <FlatList
                            style={[styles.listitem]}
                            data={objToArray(data?.data) || []}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            ListHeaderComponent={<View
                                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween,styles.p_4]}>

                                <Paragraph
                                    style={[styles.paragraph, styles.bold,{width:'50%'}]}>  </Paragraph>
                                <Paragraph
                                    style={[styles.paragraph, styles.text_xs,{width:'25%',textAlign:'center'}]}>Qnt</Paragraph>
                                <Paragraph
                                    style={[styles.paragraph, styles.text_xs,{width:'25%',textAlign:'right'}]}>Total</Paragraph>

                            </View>}
                            ListEmptyComponent={<View>
                                <View style={[styles.p_6]}>
                                    <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}>No
                                        any
                                        items found</Text>
                                </View>
                            </View>}
                            ItemSeparatorComponent={ItemDivider}
                        />
                    </Card.Content>
                </Card> }

            </KeyboardScroll>


            {Boolean(data?.data) && <><Card style={[styles.card,styles.mb_3]}>
                <Card.Content>
                    <View
                        style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>


                        <View>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}> Total Qnt : {summary.qnt} </Paragraph>
                        </View>

                        <View>
                            <Paragraph
                                style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}> Total Amount : {toCurrency(summary.total)} </Paragraph>
                        </View>

                    </View>
                </Card.Content>
            </Card>



            </>}

    </Container>

}


const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(Index);



