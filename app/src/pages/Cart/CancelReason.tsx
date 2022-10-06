import React, {useState} from "react";
import {FlatList, Text, View} from "react-native";
import {Divider, List, withTheme} from "react-native-paper";
import {connect, useDispatch} from "react-redux";

import InputBox from "../../components/InputBox";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import Button from "../../components/Button";
import {setDialog} from "../../redux-store/reducer/component";
import {objToArray} from "../../libs/function";
import {localredux} from "../../libs/static";



const Index = (props: any) => {

    const {type,cancelKOT,confirmCancelOrder} = props;
    const {reason}:any = localredux.initData

    const reasonlist = reason[type];

    const [cancelreason,setCancelReason]:any = useState('')

    const dispatch = useDispatch()

    const renderitem = ({item}: any) => {
        return <><List.Item
            title={item.data}
            style={{padding:0}}
            onPress={async () => {
                setCancelReason(item)
            }}
        />
            <Divider/>
        </>
    }

    const handleSubmit = (values:any) => {

        Boolean(cancelKOT) && cancelKOT(values);
        Boolean(confirmCancelOrder) && confirmCancelOrder(values);
        dispatch(setDialog({visible:false}))
    }

    return <View>
        <Form
            initialValues={{cancelreason:cancelreason.data,cancelreasonid:cancelreason.key}}
            onSubmit={handleSubmit}

            render={({handleSubmit, submitting, values, ...more}: any) => (
                <>

                    <View style={[styles.mb_5]}>
                        <Field name="cancelreason">
                            {props => (
                                <InputBox
                                    {...props}
                                    value={props.input.value}
                                    label={'Cancel Reason'}
                                    autoFocus={true}
                                    onChange={props.input.onChange}
                                />
                            )}
                        </Field>
                    </View>


                    <FlatList
                        data={objToArray(reasonlist)}
                        renderItem={renderitem}
                        initialNumToRender={5}
                    />


                    <View style={[styles.grid,styles.right,styles.mt_5]}>
                        <Button style={[styles.mr_2]} onPress={() => {handleSubmit(values)} }>OK</Button>
                        <Button   secondbutton={true} onPress={() => dispatch(setDialog({visible: false}))}>Cancel</Button>
                    </View>

                </>
            )}
        >
        </Form>
    </View>



}


const mapStateToProps = (state: any) => {
    return {
        cartData: state.cartData || {},
    }
}

export default connect(mapStateToProps)(withTheme(Index));

