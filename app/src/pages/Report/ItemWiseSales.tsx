import React, {useEffect, useState} from "react";
import {FlatList, SectionList, Text, View} from "react-native";
import {Card, List, Paragraph} from "react-native-paper"
import {appLog, dateFormat, groupBy, objToArray, prelog, toCurrency} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {ACTIONS, ItemDivider, localredux, METHOD, urls} from "../../libs/static";
import apiService from "../../libs/api-service";

import moment from "moment";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";


const Index = ({navigation}: any) => {

    let {
        licenseData,
    }: any = localredux;

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;

    const currentdate = moment().format(dateFormat(false, true));

    const [data, setData] = useState<any>({});
    const [summary, setSummary] = useState<any>();
    const [datetime, setDateTime]: any = useState({
        dateto: currentdate,
        datefrom: currentdate
    });

    prelog('data',data)

    const [expanded, setExpanded] = React.useState(true);
    const handlePress = () => setExpanded(!expanded);


    const getitemSales = (datetime: any) => {

        if (Boolean(datetime)) {
            apiService({
                method: METHOD.GET,
                action: ACTIONS.REPORTITEMWISE,
                workspace: workspace,
                token: token,
                queryString: {
                    startdate: datetime.datefrom,
                    enddate: datetime.dateto,
                    terminalid: licenseData?.data?.terminal_id
                },
                other: {url: urls.posUrl},
            }).then((response: any) => {

                console.log('response.data.data',response.data.data)

                let bygroup = groupBy(Object.values(response.data.data),'groupname');
                setData(bygroup)
                setSummary(response.data.summary)

            }).catch((e) => {
                appLog('e', e)
            })
        }
    }

    useEffect(() => {
        getitemSales(datetime)
    }, [datetime])


/*    const renderItem = ({item: {data}, index}: any) => {

        return <View style={[styles.p_4]} key={index}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                <Paragraph
                    style={[styles.paragraph, styles.bold, {width: '50%'}]}>{`${data.item}`} </Paragraph>
                <Paragraph
                    style={[styles.paragraph, styles.text_xs, {
                        width: '25%',
                        textAlign: 'center'
                    }]}>{`${data.qnt}`}</Paragraph>
                <Paragraph
                    style={[styles.paragraph, styles.text_xs, {
                        width: '25%',
                        textAlign: 'right'
                    }]}>{toCurrency(+data.total)}</Paragraph>

            </View>
        </View>
    }*/



    return <Container style={styles.bg_white}>


        <View style={[styles.marginOver, {marginBottom: 0}]}>
            <Card style={[styles.card]}>
                <Card.Content style={[styles.cardContent]}>
                    <View style={[styles.grid, styles.justifyContent, styles.middle]}>

                        <View style={[styles.w_auto, styles.grid, styles.p_3, styles.center,styles.bg_light, {
                            borderRadius: 5
                        }]}>
                            <View>
                                <InputField
                                    label={"Start Date"}
                                    displaytype={'bottomlist'}
                                    inputtype={'datepicker'}
                                    mode={'date'}
                                    removeSpace={true}
                                    render={() => {
                                        return <Paragraph
                                            style={[styles.paragraph, styles.bold]}>{moment(datetime.datefrom).format(dateFormat())}</Paragraph>
                                    }}
                                    selectedValue={datetime.datefrom}
                                    onChange={(value: any) => {
                                        setDateTime({...datetime, datefrom: value});
                                    }}
                                />

                            </View>

                        </View>

                        <View style={[styles.px_3]}><Paragraph style={[styles.paragraph]}>To</Paragraph></View>

                        <View style={[styles.w_auto, styles.grid, styles.p_3, styles.center, {
                            backgroundColor: styles.light.color,
                            borderRadius: 5
                        }]}>
                            <View>
                                <InputField
                                    label={"End Date"}
                                    displaytype={'bottomlist'}
                                    inputtype={'datepicker'}
                                    mode={'date'}
                                    removeSpace={true}
                                    render={() => {
                                        return <Paragraph
                                            style={[styles.paragraph, styles.bold]}>{moment(datetime.dateto).format(dateFormat())}</Paragraph>
                                    }}
                                    selectedValue={datetime.dateto}
                                    onChange={(value: any) => {
                                        setDateTime({...datetime, dateto: value});
                                    }}
                                />
                            </View>

                        </View>

                    </View>


                </Card.Content>
            </Card>
        </View>

        <KeyboardScroll>

            <List.Section>

                {
                    Object.keys(data).map((key:any)=>{

                        return (
                            <List.Accordion title={key === 'null'?'Other':key} style={{padding:0,backgroundColor:styles.secondary.color,borderRadius:5}} titleStyle={{color:'black'}}>
                                <View key={key}>
                                    {
                                        data[key].map((item:any,index:any)=>{
                                            return (
                                                <View style={[styles.p_4]} key={index}>
                                                    <View
                                                        style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                                                        <Paragraph
                                                            style={[styles.paragraph, styles.bold, {width: '50%'}]}>{`${item.item}`} </Paragraph>
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.text_xs, {
                                                                width: '25%',
                                                                textAlign: 'center'
                                                            }]}>{`${item.qnt}`}</Paragraph>
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.text_xs, {
                                                                width: '25%',
                                                                textAlign: 'right'
                                                            }]}>{toCurrency(+item.total)}</Paragraph>

                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </List.Accordion>
                        )
                    })
                }

            </List.Section>


        </KeyboardScroll>


        {Boolean(summary) && <><Card style={[styles.card, styles.mb_3]}>
            <Card.Content>
                <View
                    style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>


                    <View>
                        <Paragraph
                            style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}> Total Qnt
                            : {summary.qnt} </Paragraph>
                    </View>

                    <View>
                        <Paragraph
                            style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}> Total Amount
                            : {toCurrency(summary.total)} </Paragraph>
                    </View>

                </View>
            </Card.Content>
        </Card>


        </>}

    </Container>

}


const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(Index);



