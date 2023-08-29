import React from 'react';
import {SafeAreaView, ScrollView, View,} from 'react-native';
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {Card} from "react-native-paper";

import {clone} from "../../libs/function";
import {setCartData} from "../../redux-store/reducer/cart-data";
import {Field, Form} from "react-final-form";
import InputField from "../../components/InputField";
import {localredux} from "../../libs/static";
import KAccessoryView from "../../components/KAccessoryView";
import {Button, Container} from "../../components";
import {getOriginalTablesData} from "../Tables/Tables";
import {useNavigation} from "@react-navigation/native";


const Index = ({cartData}: any) => {

    const dispatch = useDispatch();
    const navigation = useNavigation()

    const {tableid, ordertype, source,tablename} = cartData

    const initdata: any = {
        tableid: tableid,
        source: source,
        ordertype: ordertype
    }

    const handleSubmit = async (values: any) => {

        let tabletypename = tablename;
        if(values.ordertype !== 'tableorder'){
            tabletypename = values.source
        }

        cartData = {
            ...cartData,
            updatecart: true,
            ...values,
            tablename:tabletypename,
        }
        await dispatch(setCartData(clone(cartData)));
        navigation.goBack();
        setTimeout(()=>{
            navigation.goBack();
        },500)
    }


    return (
        <Container style={styles.bg_white}>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values, form, ...more}: any) => (
                        <View style={[styles.middle]}>
                            <View style={[styles.middleForm, {maxWidth: 400}]}>
                                <ScrollView>
                                    <>
                                        <Card style={[styles.card]}>
                                            <Card.Content style={[styles.cardContent]}>

                                                <Field name="ordertype">
                                                    {props => (
                                                        <InputField
                                                            label={'Order Type'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={[
                                                                {'label': 'Takeaway', value: 'takeaway'},
                                                                {'label': 'Home Delivery', value: 'homedelivery'},
                                                                {'label': 'Table Order', value: 'tableorder'}]}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>


                                                {values.ordertype === 'tableorder' && <Field name="tableid">
                                                    {props => (
                                                        <InputField
                                                            label={'Tables'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={getOriginalTablesData().map((table: any) => {
                                                                return {label: table.tablename, value: table.tableid}
                                                            })}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>}


                                                {(values.ordertype === 'takeaway' || values.ordertype === 'homedelivery') &&
                                                    <Field name="source">
                                                        {props => (
                                                            <InputField
                                                                label={'Sources'}
                                                                divider={true}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                list={Object.values(localredux?.initData?.sources).map((source: any, index: any) => {
                                                                    return {label: source, value: source}
                                                                })}
                                                                search={false}
                                                                listtype={'other'}
                                                                selectedValue={props.input.value}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>}


                                            </Card.Content>
                                        </Card>

                                    </>

                                </ScrollView>


                                <KAccessoryView>

                                    <View style={[styles.submitbutton]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid} onPress={() => {
                                            handleSubmit(values)
                                        }}> Update </Button>
                                    </View>

                                </KAccessoryView>

                            </View>
                        </View>
                    )}
                >

                </Form>
            </SafeAreaView>
        </Container>
    )

}


const mapStateToProps = (state: any) => ({
    cartData: state.cartData
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);


