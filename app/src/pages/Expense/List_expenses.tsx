import {ACTIONS, device, ItemDivider, localredux, METHOD, STATUS, urls} from "../../libs/static";
import React, {memo, useCallback, useEffect, useState} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {Appbar, Card, List, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {Container, ProIcon, SearchBox} from "../../components";

import {appLog, clone, dateFormat, filterArray, groupBy, startWith, toCurrency} from "../../libs/function";
import {connect} from "react-redux";

import {useNavigation} from "@react-navigation/native";

import PageLoader from "../../components/PageLoader";
import apiService from "../../libs/api-service";
import moment from "moment/moment";
import store from "../../redux-store/store";
import {hideLoader, setAlert} from "../../redux-store/reducer/component";


let expenselist:any = []
const Index = (props: any) => {


    let [loader, setLoader]: any = useState(true);
    let [search, setSearch]: any = useState('');
    let [filteExpenses, setFilteExpenses]: any = useState([]);

    const navigation = useNavigation()

    const handleSearch = async (search?: any) => {
        setSearch(search);
    }

    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;
    const {terminal_id}: any = localredux.licenseData?.data;


    const currentdate = moment().format(dateFormat(false, true));

    const [datetime, setDateTime]: any = useState({
        dateto: currentdate,
        datefrom: currentdate,
        starttime: `00:00`,
        endtime: `23:59`
    });


    const getList = () => {
        apiService({
            method: METHOD.GET,
            action: ACTIONS.EXPENSE,
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
        }).then((result: any) => {
            const {info, data}: any = result;
            if (result.status === STATUS.SUCCESS && Boolean(data)) {
                expenselist = clone(Object.values(data))
                setFilteExpenses(expenselist);
            }
            setLoader(false);
        })
    }

    useEffect(() => {
        getList()
    }, [])




    useEffect(()=>{
        setFilteExpenses(clone(filterArray(expenselist, ['client','voucherdisplayid'], search)))
    },[search])


    const renderItem = useCallback(({item, index}: any) => {

        return <TouchableOpacity onPress={()=>{
            navigation.navigate('AddEditExpense',{data: {...item,edit:true},getList:getList})
        }}><View style={[styles.p_4]} key={index}>
            <View
                style={[styles.grid, styles.noWrap, styles.middle, styles.justifyContentSpaceBetween]}>

                <View style={[styles.w_auto]}>
                    <View style={[styles.grid, styles.noWrap, styles.top]}>
                        <View>
                            <Paragraph
                                style={[styles.paragraph, styles.bold]}>{`${item.voucherprefix} ${item.voucherdisplayid} - ${item?.client?item?.client:''}`} </Paragraph>
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
        </View></TouchableOpacity>
    }, [filteExpenses]);


    if(loader){
        return <PageLoader/>
    }

    navigation.setOptions({
        headerRight: () =>  <Appbar.Action icon="plus" onPress={() => navigation.navigate('AddEditExpense',{getList:getList})}/>
    })


    return (
        <Container style={{backgroundColor: 'white', padding: 0}}>
            <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

                <View style={[styles.grid, styles.middle, styles.justifyContent, {padding: 10}]}>
                    <View style={[styles.w_auto]}>
                        <SearchBox handleSearch={handleSearch}  autoFocus={false}    placeholder="Search Expense..."/>
                    </View>
                </View>

                <Card style={[styles.card, styles.h_100, styles.flex]}>
                    <Card.Content style={[styles.cardContent, {paddingVertical: 0}]}>
                        {<FlatList
                            data={filteExpenses}
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'always'}
                            renderItem={renderItem}
                            ItemSeparatorComponent={ItemDivider}
                            ListEmptyComponent={<View style={[styles.p_6]}>
                                <Text
                                    style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No result found</Text>
                            </View>}
                            keyExtractor={expense => expense.expenseid}
                        />}
                    </Card.Content>
                </Card>


            </View>
        </Container>

    )

}

const mapStateToProps = (state: any) => ({

})

export default connect(mapStateToProps)(memo(Index));
