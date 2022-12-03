import React, {memo, useEffect} from "react";
import {appLog, chevronRight, clone, dateFormat, isRestaurant, toCurrency, updateComponent} from "../../libs/function";
import {TouchableOpacity, View} from "react-native";
import {Caption, Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {itemTotalCalculation} from "../../libs/item-calculation";
import {setCartData, setUpdateCart, updateCartField} from "../../redux-store/reducer/cart-data";
import {ProIcon} from "../../components";
import CartSummaryMore from "./CartSummaryMore";
import {contentLoader} from "../../redux-store/reducer/component";
import store from "../../redux-store/store";
import moment from "moment";
import ClientAndSource from "./ClientAndSource";
import InputBox from "../../components/InputBox";


const Index = ({vouchertotaldisplay, advanceorder,commonkotnote, navigation}: any) => {

    const dispatch = useDispatch()
    const moreSummaryRef: any = React.useRef();
    let summary: any = false


    useEffect(() => {
        updateComponent(moreSummaryRef, 'display', 'none');
    }, [vouchertotaldisplay])


    const viewSummary = async () => {

        summary = !summary;
        updateComponent(moreSummaryRef, 'display', summary ? 'flex' : 'none');

        if (summary) {
            dispatch(contentLoader(true))
            setTimeout(async () => {
                let data = await itemTotalCalculation(clone(store.getState().cartData), undefined, undefined, undefined, undefined, 2, 2, false, false);
                await dispatch(setCartData(clone(data)));
                await dispatch(setUpdateCart());
                dispatch(contentLoader(false))
            })
        }
    }


    return (<>

        {isRestaurant() &&
            <Card  style={[styles.card]}>
                <Card.Content style={[styles.cardContent]}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('KotNote',{commonkotnote:commonkotnote})
                    }}>
                        {Boolean(commonkotnote) && <Caption>Common KOT Note</Caption>}
                        <View style={[styles.grid, styles.justifyContent, styles.middle,styles.noWrap]}>
                            <Paragraph
                                style={[styles.paragraph, styles.head]}>{commonkotnote? commonkotnote:'Common KOT Note'}</Paragraph>
                            <View>
                                {chevronRight}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card.Content>
            </Card>}



        {Boolean(advanceorder?.date) &&
            <Card style={[styles.card]}>
                <Card.Content style={[styles.cardContent]}>
                    <TouchableOpacity
                          onPress={() => {
                              navigation.navigate('ClientAndSource', {title: 'Advance Order', edit: true,});
                          }}>

                        <View style={[styles.grid, styles.justifyContent, styles.middle,styles.noWrap]}>
                            <View>
                                <Paragraph style={[{color:styles.red.color}]}>Delivery on : {moment(advanceorder.date).format(dateFormat())} {moment(advanceorder.time).format('HH:mm A')}</Paragraph>
                                {Boolean(advanceorder.notes) && <Paragraph style={{fontStyle:'italic'}}>{advanceorder.notes}</Paragraph>}
                            </View>
                            <View>
                                {chevronRight}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        }



        <View style={[styles.marginOver,styles.bg_white,styles.p_6,{marginTop:0}]}>
            <TouchableOpacity  onPress={() => {
                viewSummary()
            }}>
                <View><Paragraph style={[styles.absolute, {top: 0, left: '50%', marginLeft: -10}]}><ProIcon
                    name={'chevron-up'} action_type={'text'} size={15}/></Paragraph></View>

                <View ref={moreSummaryRef}><CartSummaryMore/></View>

                <View style={[styles.grid, styles.justifyContent,styles.middle]}>
                    <View style={{width: '40%'}}><Paragraph
                        style={[styles.paragraph, styles.bold]}>Total </Paragraph></View>
                    <View style={{width: '40%'}}><Paragraph
                        style={[styles.paragraph, styles.bold, styles.text_lg, styles.green, {textAlign: 'right'}]}>{toCurrency(vouchertotaldisplay || '0')}</Paragraph></View>
                </View>
            </TouchableOpacity>
        </View></>)
}

const mapStateToProps = (state: any) => ({
    advanceorder: state.cartData?.advanceorder,
    commonkotnote:state.cartData?.commonkotnote,
    vouchertotaldisplay: parseInt(state.cartData.vouchertotaldisplay),
})

export default connect(mapStateToProps)(withTheme(memo(Index)));
