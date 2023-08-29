import React, {useEffect, useState} from 'react';
import {ScrollView, View,} from 'react-native';
import {styles} from "../../theme";
import {connect} from "react-redux";
import {Paragraph} from "react-native-paper";

import {
    clone,
    deleteTempLocalOrder,
    errorAlert,
    groupBy,
    saveTempLocalOrder,
    totalOrderQnt,
    voucherData
} from "../../libs/function";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {defaultclient, VOUCHER} from "../../libs/static";
import {Button, Container} from "../../components";
import {getOrderFromTable, getOriginalTablesData} from "../Tables/Tables";
import {useNavigation} from "@react-navigation/native";
import {getTempOrdersByWhere} from "../../libs/Sqlite/selectData";
import CheckBox from "../../components/CheckBox";


const Index = (props: any) => {

    const tableorderid = props.route?.params?.tableorderid;

    const [runningTable, setRunningTable]: any = useState()

    const [fromtable, setFromtable]: any = useState()
    const [totable, setTotable]: any = useState()

    const navigation = useNavigation()

    const initdata: any = {
        fromtableorderid: tableorderid
    }


    const getFromItems = (tableorderid: any) => {
        if (tableorderid) {
            getTempOrdersByWhere({tableorderid: tableorderid}).then((orders: any) => {
                setFromtable(orders[tableorderid])
            });
        }
    }

    const getToItems = (tableorderid: any, more: any) => {

        if (tableorderid) {
            getTempOrdersByWhere({tableorderid: tableorderid}).then((orders: any) => {
                setTotable(orders[tableorderid])
            });
        } else {
            const voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
            setTotable({
                ...more, ...voucherDataJson,
                clientid: defaultclient.clientid,
                clientname: defaultclient.clientname,
            })
        }

    }


    useEffect(() => {
        const tables = getOriginalTablesData().map((table: any) => {
            return {label: table.tablename, value: table.tableid}
        });

        getOrderFromTable(tables).then(async (newtables) => {
            const groupby = groupBy(newtables, 'tableid');
            let orders: any = []
            Object.values(groupby).forEach((item: any) => {
                orders.push({...item[0], ...item[1], ...item[2]})
            })
            await setRunningTable(orders)
            getFromItems(tableorderid)
        })

    }, [])


    const handleSubmit = async (values: any) => {
        await moveFromTo(values?.fromitem)
    }
    const moveFromTo = async (from: any) => {
        let keys: any = [];

        if (Boolean(totable)) {

            Object.keys(from).map((key: any) => {
                if (from[key]) {
                    keys.push(key)
                }
            });

            let toinvoiceitems: any = totable?.invoiceitems;
            const moveitems = fromtable?.invoiceitems?.filter((item: any) => {
                return keys.includes(item.key)
            })

            const mergeItems = Boolean(toinvoiceitems?.length) ? moveitems.concat(toinvoiceitems) : moveitems;

            if (Boolean(moveitems?.length)) {

                saveTempLocalOrder({
                    ...totable, invoiceitems: clone(mergeItems), totalqnt: totalOrderQnt(mergeItems)
                }, {print: false}).then(async (msg: any) => {

                    const remainingitems = fromtable?.invoiceitems?.filter((item: any) => {
                        return !keys.includes(item.key);
                    })


                    if (!Boolean(remainingitems?.length)) {
                        deleteTempLocalOrder(fromtable.tableorderid).then(() => {
                            navigation.goBack()
                        })
                    } else {
                        saveTempLocalOrder({
                            ...fromtable, invoiceitems: clone(remainingitems), totalqnt: totalOrderQnt(remainingitems)
                        }, {print: false}).then((msg: any) => {
                            navigation.goBack()
                        })
                    }

                })

            }
        } else {
            errorAlert('Please select switch to table')
        }

    }

    if (!Boolean(runningTable)) {
        return <></>
    }

    return (<Container>
        <>
            <Form
                onSubmit={handleSubmit}
                initialValues={{...initdata}}
                render={({handleSubmit, submitting, values, form, ...more}: any) => (
                    <View style={[styles.flex, styles.h_100]}>


                        <View style={[styles.flex, styles.grid, styles.h_100]}>


                            <View style={[styles.w_auto,]}>
                                <Field name="fromtableorderid">
                                    {props => (<InputField
                                        label={'From'}
                                        divider={true}
                                        displaytype={'pagelist'}
                                        inputtype={'dropdown'}
                                        list={runningTable?.filter((table: any) => {
                                            return table.ordertype === 'tableorder' && Boolean(table?.tableorderid)
                                        }).map((table: any) => {
                                            return {
                                                label: table.tablename, value: table.tableorderid, data: table
                                            }
                                        })}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={props.input.value}
                                        onChange={(value: any, more: any) => {
                                            getFromItems(value)
                                            props.input.onChange(value);
                                        }}
                                    />)}
                                </Field>

                                <View>
                                    <ScrollView>
                                        {fromtable?.invoiceitems?.map((item: any, index: any) => {
                                            return (<View key={item.key}>
                                                <Field name={`fromitem[${item.key}]`}>
                                                    {props => (<><CheckBox
                                                        value={props.input.value}
                                                        label={item.itemname}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                            form.change('totableorderid', '')
                                                        }}
                                                    /></>)}
                                                </Field>
                                            </View>)
                                        })}
                                        <View style={{height: 100}}></View>
                                    </ScrollView>
                                </View>
                            </View>

                            <View style={[{width: 10}]}>

                            </View>


                            {/*<View style={[styles.h_100, {width: 50}]}>
                                        <View style={[styles.middle, styles.h_100, styles.center]}>
                                            <TouchableOpacity onPress={() => {
                                                moveFromTo(values?.fromitem)
                                            }} style={[styles.bg_light, styles.mb_2, {borderRadius: 3}]}>
                                                <ProIcon name={'arrow-right'}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>*/}


                            <View style={[styles.w_auto]}>
                                <Field name="totableorderid">
                                    {props => (<InputField
                                        label={'To'}
                                        divider={true}
                                        displaytype={'pagelist'}
                                        inputtype={'dropdown'}
                                        list={runningTable?.filter((table: any) => {
                                            return table.ordertype === 'tableorder' && (fromtable?.tableid !== table?.tableid)
                                        }).map((table: any) => {
                                            return {
                                                label: table.tablename, value: table.tableorderid, data: table
                                            }
                                        })}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={props.input.value}
                                        onChange={(value: any, more: any) => {
                                            getToItems(value, more.data)
                                            props.input.onChange(value);
                                        }}
                                    />)}
                                </Field>

                                <View>
                                    <ScrollView>
                                        {totable?.invoiceitems?.map((item: any, index: any) => {
                                            return (<View key={item.key}>
                                                <Paragraph
                                                    style={[styles.paragraph, {fontSize: 12}]}>{index + 1}) {item.itemname}</Paragraph>
                                            </View>)
                                        })}
                                        <View style={{height: 100}}></View>
                                    </ScrollView>
                                </View>
                            </View>


                        </View>


                        {Boolean(totable?.tablename) && <View style={[styles.submitbutton]}>
                            <Button more={{color: 'white'}} disable={more.invalid}
                                    secondbutton={more.invalid} onPress={() => {
                                handleSubmit(values)
                            }}>Move to {totable.tablename}</Button>
                        </View>}

                    </View>)}
            >

            </Form>
        </>
    </Container>)

}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


