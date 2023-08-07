import React, {useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import {Caption, Card, Paragraph} from "react-native-paper"
import {appLog, toCurrency} from "../../libs/function";
import Container from "../../components/Container";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {ACTIONS, localredux, METHOD, urls} from "../../libs/static";
import apiService from "../../libs/api-service";
import InputField from "../../components/InputField";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";


const CurrentStock = ({navigation}: any) => {


    const {workspace}: any = localredux.initData;
    const {token}: any = localredux.authData;
    const dispatch = useDispatch()

    const [items, setItems] = useState<any>([]);

    let [itemid, setItemid]: any = useState('');

    const [data, setData]: any = useState({column: {}, data: [], summary: {}})


    const getStock = (itemid: any) => {
        if (Boolean(itemid)) {
            apiService({
                method: METHOD.GET,
                action: ACTIONS.SEARCH,
                workspace: workspace,
                token: token,
                queryString: {productid: itemid},
                other: {url: urls.posUrl},
            }).then((response: any) => {
                setData({...response.data})
            }).catch((e) => {
                appLog('e', e)
            })
        }
    }

    useEffect(() => {
        getStock(itemid)
    }, [itemid])

    useEffect(() => {
        getItemsByWhere({}).then((items: any) => {
            let item_options = items.map((item: any) => {
                return {label:`${item.itemname} ${item.uniqueproductcode?`(${item.uniqueproductcode})`:''}`  , value: item.itemid}
            })
            setItems(item_options)
        });
    }, [])


    if (!Boolean(items.length)) {
        return <></>
    }


    const {info, title, tabledata}: any = data?.reportheader || {}
    const stocks = tabledata?.data;
    const columns = tabledata?.columns;
    const summary = tabledata?.summary;

    return <Container style={styles.bg_white}>

        <ScrollView>

            <Card style={[styles.card]}>
                <Card.Content style={[styles.cardContent]}>


                    <>
                        <InputField
                            label={'Select Item'}
                            mode={'flat'}
                            list={items}
                            value={''}
                            selectedValue={''}
                            displaytype={'pagelist'}
                            inputtype={'dropdown'}
                            listtype={'other'}
                            onChange={(value: any) => {
                                setItemid(value)
                            }}>
                        </InputField>

                    </>

                    {Boolean(info) && <>
                        <View>
                            {/*<Paragraph style={[styles.paragraph,styles.bold]}>{title}</Paragraph>*/}
                            <Paragraph style={[styles.paragraph, styles.mb_3, styles.muted]}>{info}</Paragraph>
                        </View>
                        {
                            stocks.map((stock: any) => {
                                return (
                                    <View style={[styles.mb_5, styles.border, styles.p_5, {borderRadius: 5}]}>
                                        <Caption style={[styles.caption]}>Location : {stock.location}</Caption>
                                        <View style={[styles.grid, styles.justifyContent]}>
                                            <Paragraph>{columns['availableqty'].title}</Paragraph>
                                            <Paragraph> {stock.availableqty} </Paragraph>
                                        </View>

                                        <View style={[styles.grid, styles.justifyContent]}>
                                            <Paragraph>{columns['committedqty'].title}</Paragraph>
                                            <Paragraph> {stock.committedqty} </Paragraph>
                                        </View>

                                        <View style={[styles.grid, styles.justifyContent]}>
                                            <Paragraph>{columns['avgvalue'].title}</Paragraph>
                                            <Paragraph> {toCurrency(stock.avgvalue || '0')} </Paragraph>
                                        </View>

                                        <View style={[styles.grid, styles.justifyContent]}>
                                            <Paragraph>{columns['stockvalue'].title}</Paragraph>
                                            <Paragraph> {toCurrency(stock.stockvalue || '0')} </Paragraph>
                                        </View>

                                    </View>
                                )
                            })
                        }


                        <View style={[styles.mb_5, styles.border, styles.p_5, {borderRadius: 5}]}>
                            <Caption style={[styles.caption]}>{summary.location}</Caption>
                            <View style={[styles.grid, styles.justifyContent]}>
                                <Paragraph>{columns['availableqty'].title}</Paragraph>
                                <Paragraph style={[styles.bold]}> {summary.availableqty} </Paragraph>
                            </View>

                            <View style={[styles.grid, styles.justifyContent]}>
                                <Paragraph>{columns['committedqty'].title}</Paragraph>
                                <Paragraph style={[styles.bold]}> {summary.committedqty} </Paragraph>
                            </View>

                            <View style={[styles.grid, styles.justifyContent]}>
                                <Paragraph>{columns['avgvalue'].title}</Paragraph>
                                <Paragraph style={[styles.bold]}> {toCurrency(summary.avgvalue || '0')} </Paragraph>
                            </View>

                            <View style={[styles.grid, styles.justifyContent]}>
                                <Paragraph>{columns['stockvalue'].title}</Paragraph>
                                <Paragraph style={[styles.bold]}> {toCurrency(summary.stockvalue || '0')} </Paragraph>
                            </View>

                        </View>


                    </>}


                </Card.Content>
            </Card>

        </ScrollView>

    </Container>

}


const mapStateToProps = (state: any) => ({
    ordersData: Object.values(state?.ordersData).reverse() || [],
})

export default connect(mapStateToProps)(CurrentStock);



