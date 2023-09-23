import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Platform, TouchableOpacity, View} from "react-native";
import {appLog, clone, log} from "../../libs/function";
import {connect} from "react-redux";
import {Paragraph, withTheme} from "react-native-paper";
import moment from "moment";
import {defalut_payment_term, localredux} from "../../libs/static";
import {styles} from "../../theme";
import {ScrollView} from "react-native-gesture-handler";
import {setBottomSheet} from "../../redux-store/reducer/component";


class Index extends React.Component<any> {

    paymentterms: any;
    tempdate: any;

    constructor(props: any) {
        super(props);


        const {paymentterms}: any = localredux.initData;



        this.paymentterms = Object.keys(paymentterms).map((key: any) => {
            if (Boolean(paymentterms[key])) {
                return {label: paymentterms[key].termname, value: paymentterms[key].termdays}
            }
        }).filter((item: any) => {
            return Boolean(item)
        })
        this.paymentterms = [
            ...this.paymentterms,
            ...defalut_payment_term
        ]
    }

    setDatebyTerms = (days: any) => {
        const {setBottomSheet, onSelect}: any = this.props;

        onSelect({value: moment().add(days, 'days').format("YYYY-MM-DD")})
        setBottomSheet({
            visible: false, component: () => {
                return <></>
            }
        })
    };

    setDate = (event: any, date: any) => {

        const {setBottomSheet, onSelect, mode}: any = this.props;

        let format = "YYYY-MM-DD";

        if (mode === "time") {
            format += " HH:mm:ss"
        }

        Boolean(date) && onSelect({value: moment(date).format(format)});

        setBottomSheet({
            visible: false, component: () => {
                return <></>
            }
        })
    };

    render() {
        let {
            defaultValue = moment().format('YYYY-MM-DD'),
            mode = 'date',
            label,
            dueterm,
            minimumDate,

        }: any = this.props;


        const d = new Date(defaultValue);
        let year = d.getFullYear();
        let month = d.getMonth();
        let date = d.getDate();

        if (minimumDate){
            minimumDate = new Date(moment(minimumDate).format('YYYY-MM-DD'));
        }

        // @ts-ignore
        return (
            <View style={{width: '100%'}}>

                {Platform.OS === "ios" && mode==='date' && <View>
                    {/*{dueterm && <ScrollView horizontal={true}>
                        <View style={[styles.row, styles.px_5]}>
                            {
                                this.paymentterms.map((paymentterm: any) => {
                                    return (
                                        <View style={[styles.bg_global, styles.p_4, {
                                            marginHorizontal: 5,
                                            borderRadius: 3
                                        }]}>
                                            <TouchableOpacity onPress={() => this.setDatebyTerms(paymentterm.value)}>
                                                <Paragraph> {paymentterm.label} </Paragraph>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>}*/}
                </View>}

                <View>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(year, month, date)}
                        mode={mode}
                        is24Hour={true}
                        minimumDate={minimumDate}
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={this.setDate}/>
                </View>

            </View>
        );
    }
}


const mapStateToProps = (state:any) => {
    return {bottomsheet: state.component.bottomsheet}
};
const mapDispatchToProps = (dispatch:any) => ({
    setBottomSheet: (bottomsheet:any) => dispatch(setBottomSheet(bottomsheet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));
