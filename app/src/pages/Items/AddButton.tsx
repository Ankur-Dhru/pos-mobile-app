import React, {useEffect} from "react";
import {appLog, arraySome, isRestaurant, removeItem} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {ProIcon} from "../../components";
import {connect, useDispatch} from "react-redux";
import {changeCartItem,} from "../../redux-store/reducer/cart-data";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import AddonActions from "./AddonActions";
import store from "../../redux-store/store";
import KeyPad from "../../components/KeyPad";


const Index = (props: any) => {


    let {bottomsheet, theme: {colors}, item, defaultAmountOpen} = props;


    const dispatch = useDispatch();

    const directQnt = arraySome(defaultAmountOpen, item.productqntunitid)

    const updateItem = async (values: any, action: any) => {

        if (values.productqnt > 0 && action === 'add' && !bottomsheet.visible && values?.hasAddon) {
            await dispatch(setBottomSheet({
                visible: true,
                height: '20%',
                component: () => <AddonActions product={values}/>
            }))
        } else {
            await updateCartItem(values, action)
        }

    }

    if (!item.productqnt) {
        return (<View style={[styles.grid, styles.middle, {
            minWidth: 50,
            borderRadius: 5,
            padding: 5,
            backgroundColor: styles.secondary.color
        }]}>
            <Paragraph
                style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, styles.px_6, {color: styles.primary.color}]}> Add </Paragraph>
        </View>)
    }

    const onPressNumberIN = () => {


        onPressNumber(item, (productqnt: any) => {
            updateItem({...item, productqnt: +productqnt}, "update").then(() => {
                store.dispatch(setDialog({visible: false}))
            })
        })

    }

    return (
        <>
            <View style={[styles.grid, styles.middle, {
                width: '100%',
                minWidth: 100,
                borderRadius: 5,
                backgroundColor: styles.accent.color
            }]}>
                {<TouchableOpacity style={[styles.py_3]} onPress={() => {
                    updateItem(item, 'remove').then(r => {
                    })
                }}>
                    <ProIcon name={'minus'} color={colors.secondary} size={15}/>
                </TouchableOpacity>}
                <TouchableOpacity
                    style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter]}
                    onPress={onPressNumberIN}>
                    <Paragraph
                        style={[{color: colors.secondary}]}
                    >{parseFloat(item?.productqnt || 1)}</Paragraph>
                </TouchableOpacity>
                {<TouchableOpacity style={[styles.py_4]} onPress={() => {
                    updateItem(item, 'add').then(r => {
                    })
                }}>
                    <ProIcon name={'plus'} color={colors.secondary} size={15}/>
                </TouchableOpacity>}
            </View></>
    )
}


const mapStateToProps = (state: any) => ({
    bottomsheet: state.component.bottomsheet,
    defaultAmountOpen: state.localSettings?.defaultAmountOpen
})

export default connect(mapStateToProps)(withTheme(Index));


export const updateCartItem = async (values: any, action: any) => {

    let invoiceitems: any = store.getState().cartData?.invoiceitems || {}

    try {
        const index = invoiceitems.findIndex(function (item: any) {
            return item.key === values.key
        });

        let filtered = invoiceitems?.filter((item: any, key: any) => {
            return item.key === values.key
        })


        if (action === 'add') {
            values = {
                ...values,
                productqnt: values.productqnt + 1,
            }
        } else if (action === 'remove') {
            values = {
                ...values,
                productqnt: values.productqnt - 1
            }
        }


        let finditem = {
            ...filtered[0],
            ...values,
            change: true,
            product_qnt: values.productqnt,
        }

        if (values.productqnt === 0) {
            removeItem(values.key).then(() => {

            });
        } else {
            store.dispatch(changeCartItem({
                itemIndex: index, item: finditem
            }));

        }


    } catch (e) {
        appLog('e', e)
    }
}


export const onPressNumber = (item: any, onPressOK: any) => {
    let isRes  = isRestaurant(), directQnt = false;

    appLog("item", item);

    let rate =  item?.productratedisplay || item?.pricing?.price?.default[0][item?.pricing?.type].baseprice

    if (!isRes){
        directQnt = arraySome(store.getState()?.localSettings?.defaultAmountOpen, item?.salesunit || item?.productqntunitid)
    }

    store.dispatch(setDialog({
        visible: true,
        hidecancel: true,
        width: 380,
        component: () => <KeyPad
            defaultValue={item?.productqnt}
            customNumber={directQnt}
            rate={rate}
            onPressCancel={() => {
                store.dispatch(setDialog({visible: false}))
            }}
            onPressOK={onPressOK}
        />
    }))
}
