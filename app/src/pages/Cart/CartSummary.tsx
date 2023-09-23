import React, {memo, useEffect, useState} from "react";
import {chevronRight, dateFormat, isRestaurant, saveTempLocalOrder, toCurrency} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import {ProIcon} from "../../components";
import CartSummaryMore from "./CartSummaryMore";
import store from "../../redux-store/store";
import moment from "moment";
import ClientAndSource from "./ClientAndSource";
import {splitPaxwise} from "./Payment";


const Index = ({
                   advanceorder,
                   commonkotnote,
                   orderbypax,
                   currentpax,
                   vouchertotaldisplay,
                   clientid,
                   advance,
                   navigation
               }: any) => {

    const dispatch = useDispatch()
    const moreSummaryRef: any = React.useRef();
    let summary: any = false
    const [paxwise, setPaxwise]: any = useState({})
    const [moreSummary, setMoreSummary] = useState(false)

    const [vouchertotal, setVouchertotal] = useState(parseInt(vouchertotaldisplay))


    useEffect(() => {
        let total = parseInt(vouchertotaldisplay)
        if (currentpax !== 'all' && orderbypax) {
            total = parseInt(paxwise[+currentpax]?.vouchertotaldisplay)
            setMoreSummary(false)
            //updateComponent(moreSummaryRef, 'display', 'none');
        }
        setVouchertotal(total)
    }, [currentpax, paxwise, vouchertotaldisplay])


    useEffect(() => {
        if (orderbypax) {
            splitPaxwise().then((data: any) => {
                setPaxwise(data);
                setMoreSummary(false)
            })
        }
        //setMoreSummary(false)
        //updateComponent(moreSummaryRef, 'display', 'none');
    }, [vouchertotaldisplay])

    /*    const viewSummary = async () => {

        summary = !summary;

        setMoreSummary(true)

        updateComponent(moreSummaryRef, 'display', summary ? 'flex' : 'none');

        if (summary) {
            dispatch(contentLoader(true))
            setTimeout(async () => {
                const cartdata:any = clone(store.getState().cartData);
                const vouchertotaldisplay:any = clone(store.getState().cartData.vouchertotaldisplay);

                if(Boolean(vouchertotaldisplay)) {
                    if (cartdata.updatecart) {
                        let data = await itemTotalCalculation(cartdata, undefined, undefined, undefined, undefined, 2, 2, false, false);
                        await dispatch(setCartData(clone(data)));
                    } else {
                        await dispatch(setCartData(cartdata));
                    }
                    await dispatch(setUpdateCart());
                    dispatch(contentLoader(false))
                }

            })
        }
    }*/

    const receiptCreated = (response: any) => {


        let cartData = store.getState().cartData;

        cartData = {
            ...cartData,
            advance: {...cartData.advance, ...response}
        }

        saveTempLocalOrder(cartData).then((order: any) => {
            const paidamount = order?.advance?.vouchertotaldisplay || 0;
            dispatch(updateCartField({advance: order.advance, paidamount: paidamount, credits: [{'pay': paidamount}]}))
        })

    }

    const advancePayment = () => {
        navigation.navigate("AddEditPaymentReceived", {receiptCreated: receiptCreated, clientid: clientid});
    }

    return (<>

        {isRestaurant() && Boolean(commonkotnote) &&
            <Card style={[styles.card, styles.borderTop]}>
                <Card.Content style={[styles.cardContent]}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('KotNote', {commonkotnote: commonkotnote})
                    }}>
                        <View style={[styles.grid, styles.justifyContent, styles.middle, styles.noWrap]}>
                            <Paragraph
                                style={[styles.paragraph, styles.head]}>{commonkotnote}</Paragraph>
                            <View>
                                {chevronRight}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card.Content>
            </Card>}


        {Boolean(advanceorder?.date) &&
            <Card style={[styles.card, styles.border, styles.mb_3, styles.m_3]}>
                <Card.Content style={[styles.cardContent]}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ClientAndSource', {title: 'Advance Order', edit: true,});
                        }}>

                        <View style={[styles.grid, styles.justifyContent, styles.middle, styles.noWrap]}>
                            <View>
                                <Paragraph style={[{color: styles.red.color}]}>Delivery on
                                    : {moment(advanceorder.date).format(dateFormat())} {moment(advanceorder.time).format('HH:mm A')}</Paragraph>
                                {Boolean(advanceorder.notes) &&
                                    <Paragraph style={{fontStyle: 'italic'}}>{advanceorder.notes}</Paragraph>}
                            </View>
                            <View>
                                {chevronRight}
                            </View>
                        </View>
                    </TouchableOpacity>


                    <View style={[styles.mt_4]}>
                        {!Boolean(advance?.vouchertotaldisplay) ? <TouchableOpacity
                                onPress={() => {
                                    Boolean(vouchertotaldisplay) && advancePayment()
                                }}
                                style={[styles.p_5, {backgroundColor: styles.green.color, borderRadius: 5}]}>
                                <View>
                                    <Paragraph
                                        style={[styles.paragraph, styles.bold, {color: 'white', textAlign: 'center'}]}>Advance
                                        Payment</Paragraph>
                                </View>
                            </TouchableOpacity> :
                            <Paragraph>Advance Payment : {toCurrency(advance.vouchertotaldisplay)}</Paragraph>}
                    </View>

                </Card.Content>
            </Card>
        }


        <View>
            <TouchableOpacity style={[styles.radiusBottom, styles.radiusTop, {backgroundColor: styles.secondary.color,padding:10}]}
                              onPress={() => {
                                  if(currentpax === 'all' || !orderbypax) {
                                      setMoreSummary(!moreSummary)
                                      //viewSummary().then()
                                  }
                              }}>

                {moreSummary && <View><CartSummaryMore/></View>}

                <View style={[styles.grid, styles.justifyContent, styles.middle]}>
                    <View><Paragraph
                        style={[styles.paragraph, styles.bold]}>Total </Paragraph></View>
                    <View>
                        <ProIcon name={`chevron-${!moreSummary?'up':'down'}`} size={15}/>
                    </View>
                    <View><Paragraph
                        style={[styles.paragraph, styles.bold, styles.text_lg]}>{toCurrency(vouchertotal || '0')}
                    </Paragraph></View>
                </View>
            </TouchableOpacity>
        </View></>)
}

const mapStateToProps = (state: any) => ({
    advanceorder: state.cartData?.advanceorder,
    commonkotnote: state.cartData?.commonkotnote,
    orderbypax: state.cartData?.orderbypax,
    currentpax: state.cartData?.currentpax,
    clientid: state.cartData?.clientid,
    advance: state.cartData?.advance,
    vouchertotaldisplay: state.cartData?.vouchertotaldisplay,
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
