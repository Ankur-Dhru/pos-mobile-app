import React, {useEffect, useState} from "react";
import {FlatList, Text, View} from "react-native";
import {Caption, Card, Paragraph} from "react-native-paper"
import {appLog, dateFormat, groupBy, objToArray, printDayEndReport, toCurrency} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {ACTIONS, ItemDivider, localredux, METHOD, urls} from "../../libs/static";
import apiService from "../../libs/api-service";

import moment from "moment";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import KAccessoryView from "../../components/KAccessoryView";
import KeyboardScroll from "../../components/KeyboardScroll";
import PageLoader from "../../components/PageLoader";


const Index = ({navigation}: any) => {

    let {
        licenseData,
    }: any = localredux;

    const {workspace,voucher}: any = localredux.initData;
    const {token}: any = localredux.authData;
    const {terminal_id}: any = licenseData?.data;

    const currentdate = moment().format(dateFormat(false, true));

    const [data, setData] = useState<any>({});
    const [loader, setLoader] = useState(false);
    const [datetime, setDateTime]: any = useState({
        dateto: currentdate,
        datefrom: currentdate,
        starttime: `00:00`,
        endtime: `23:59`
    });


    useEffect(() => {
        apiService({
            method: METHOD.GET,
            action: ACTIONS.DAY_END_REPORT,
            workspace: workspace,
            token: token,
            queryString: {
                terminalid: terminal_id,
                dateto: datetime.dateto,
                starttime: datetime.starttime,
                datefrom: datetime.datefrom,
                endtime: datetime.endtime
            },
            hideLoader: true,
            hidealert: true,
            other: {url: urls.posUrl},
        }).then((response: any) => {

            const {info, data}: any = response;

            if (Boolean(info)) {

                setData({
                    order:Object.values(data),
                    groupbyorder: groupBy(Object.values(data),'vouchertypeid'),
                    info: Object.keys(info).map((key: any) => {
                        return {label: key, value: info[key]}
                    })
                })
            } else {
                setData({order: [],groupbyorder:[], info: []})
            }
            setLoader(true)
        })
    }, [datetime])


    if (!loader) {
        return <PageLoader/>
    }


    const renderItem = ({item, index}: any) => {

        return <View style={[styles.p_4]} key={index}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                <View style={[styles.w_auto]}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>
                        <View>
                            <Paragraph
                                style={[styles.paragraph, styles.bold]}>{`${item.voucherprefix} ${item.voucherdisplayid} - ${item?.client}`} </Paragraph>
                            <Paragraph
                                style={[styles.paragraph, styles.text_xs]}>{moment(item.date).format(dateFormat(true))}</Paragraph>
                        </View>
                    </View>
                </View>

                <View>
                    <Paragraph
                        style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}>{toCurrency(item?.vouchertotal)}</Paragraph>
                    <Paragraph style={[styles.paragraph, styles[item.voucherstatus], styles.text_xs, {
                        textAlign: 'center',
                        color: 'white',
                        borderRadius: 5
                    }]}>{item?.voucherstatus}</Paragraph>
                </View>
            </View>
        </View>
    }


    return <Container>
        <View style={[styles.marginOver, {marginBottom: 0}]}>
            <Card style={[styles.card]}>
                <Card.Content style={[styles.cardContent]}>
                    <View style={[styles.grid, styles.justifyContent, styles.middle]}>

                        <View style={[styles.w_auto, styles.grid, styles.p_3, styles.center, {
                            backgroundColor: '#eee',
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
                                            style={[styles.paragraph, styles.bold]}>{moment(datetime.dateto).format(dateFormat())}</Paragraph>
                                    }}
                                    selectedValue={datetime.dateto}
                                    onChange={(value: any) => {
                                        setDateTime({...datetime, dateto: value});
                                    }}
                                />
                            </View>


                            <View style={[styles.ml_1]}>
                                <InputField
                                    label={"Start Time"}
                                    displaytype={'bottomlist'}
                                    inputtype={'datepicker'}
                                    mode={'time'}
                                    removeSpace={true}
                                    render={() => {
                                        return <Paragraph
                                            style={[styles.paragraph, styles.bold]}>{moment(currentdate + ' ' + datetime.starttime).format('hh:mm A')}</Paragraph>
                                    }}
                                    selectedValue={currentdate + ' ' + datetime.starttime}
                                    onChange={(value: any) => {
                                        value = moment(value).format('HH:mm')
                                        setDateTime({...datetime, starttime: value});
                                    }}
                                />
                            </View>

                        </View>

                        <View style={[styles.px_3]}><Paragraph style={[styles.paragraph]}>To</Paragraph></View>

                        <View style={[styles.w_auto, styles.grid, styles.p_3, styles.center, {
                            backgroundColor: '#eee',
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
                                            style={[styles.paragraph, styles.bold]}>{moment(datetime.datefrom).format(dateFormat())}</Paragraph>
                                    }}
                                    selectedValue={datetime.datefrom}
                                    onChange={(value: any) => {
                                        setDateTime({...datetime, datefrom: value});
                                    }}
                                />
                            </View>

                            <View style={[styles.ml_1]}>
                                <InputField
                                    label={"End Time"}
                                    displaytype={'bottomlist'}
                                    inputtype={'datepicker'}
                                    mode={'time'}
                                    removeSpace={true}
                                    render={() => {
                                        return <Paragraph
                                            style={[styles.paragraph, styles.bold]}>{moment(currentdate + ' ' + datetime.endtime).format('hh:mm A')}</Paragraph>
                                    }}
                                    selectedValue={currentdate + ' ' + datetime.endtime}
                                    onChange={(value: any) => {
                                        value = moment(value).format('HH:mm')
                                        setDateTime({...datetime, endtime: value});
                                    }}
                                />
                            </View>
                        </View>

                    </View>


                </Card.Content>
            </Card>
        </View>

        <KeyboardScroll>

            {
                Boolean(data.groupbyorder) && Object.keys(data.groupbyorder).map((vouchertype:any)=>{
                    const orders = data.groupbyorder[vouchertype];
                    return (
                        <Card style={[styles.card]}>
                            <Card.Content style={[styles.cardContent]}>
                                <Caption style={[styles.caption]}>{voucher[vouchertype].vouchertypename}</Caption>
                                <FlatList
                                    style={[styles.listitem]}
                                    data={orders || []}
                                    keyboardDismissMode={'on-drag'}
                                    keyboardShouldPersistTaps={'always'}
                                    renderItem={renderItem}
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
                        </Card>
                    )
                })
            }
        </KeyboardScroll>


        {Boolean(data.order) && <><Card style={[styles.card, {marginTop: 10}]}>
            <Card.Content>
                {
                    data?.info?.map((item: any) => {
                        return (
                            <View
                                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                                <View style={[styles.w_auto]}>
                                    <View style={[styles.grid, styles.noWrap, styles.top]}>
                                        <View>
                                            <Paragraph style={[styles.paragraph, styles.bold]}>{item.label}</Paragraph>
                                        </View>
                                    </View>
                                </View>

                                {<View>
                                    <Paragraph
                                        style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}>{toCurrency(item.value)}</Paragraph>
                                </View>}
                            </View>
                        )
                    })
                }
            </Card.Content>
        </Card>

            <KAccessoryView>
                <View style={[styles.submitbutton]}>
                    <Button more={{color: 'white'}}
                            onPress={() => {
                                printDayEndReport({date: datetime, data: data})
                            }}> Print
                    </Button>
                </View>
            </KAccessoryView>

        </>}


    </Container>

}


export default Index;



