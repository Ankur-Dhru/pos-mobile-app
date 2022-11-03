import React from "react";

import {ScrollView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Title} from "react-native-paper";
import {PRINTER} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import {connect, useDispatch} from "react-redux";
import {saveLocalSettings, testPrint} from "../../libs/function";
import InputField from "../../components/InputField";
import {setModal} from "../../redux-store/reducer/component";


const Index = ({type, printers}: any) => {

    const dispatch = useDispatch()

    const handleSubmit = async (values: any) => {
        printers = {
            ...printers,
            [type.departmentid]: values
        }
        await saveLocalSettings('printers', printers).then(() => {
            dispatch(setModal({visible: false}))
        })
    }

    const onValidate = (values: any) => {
        let error: any = {};
        if (!Boolean(values?.printertype)) {
            error.printertype = "Please Printer Type!";
        }
        if (!Boolean(values?.ip)) {
            error.ip = "Please Select IP!";
        }
        if (!Boolean(values?.printername)) {
            error.ip = "Please Select Printer Name!";
        }
        if (!Boolean(values?.port)) {
            error.port = "Please Select Port!";
        }

        return error;
    }


    const initialValues = {
        printertype: 'network',
        ip: '',
        printername: '',
        port: '9100',
        printsize: '72',
        noofprint: '1',
        ...printers[type.departmentid]
    }


    return <View style={[styles.middle, styles.h_100]}>

        <Form
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={onValidate}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.middleForm, styles.h_100]}>
                    <ScrollView>
                        <View style={[styles.p_6]}>

                            <Title style={[styles.mt_5]}>{type.departmentid === PRINTER.INVOICE?'Invoice':'KOT'} Printer </Title>

                            <View>

                                <View>
                                    <Field name="printertype">
                                        {props => (
                                            <InputField
                                                label={'Printer Type'}
                                                mode={'flat'}
                                                list={[{value: 'shared', label: 'Shared Printer'}, {
                                                    value: 'network',
                                                    label: 'Network Printer'
                                                }]}
                                                value={props.input.value}
                                                selectedValue={props.input.value}
                                                displaytype={'pagelist'}
                                                inputtype={'dropdown'}
                                                listtype={'other'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                }}>
                                            </InputField>
                                        )}
                                    </Field>
                                </View>

                                <View style={[styles.mb_5, styles.grid, styles.justifyContent]}>
                                    <View style={[styles.flexGrow]}>
                                        <Field name="ip">
                                            {props => (
                                                <InputBox
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'IP'}

                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View style={[styles.ml_2, {width: '50%'}]}>
                                        <Field name="port">
                                            {props => (
                                                <InputBox
                                                    {...props}
                                                    value={props.input.value}
                                                    label={'Port'}

                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                </View>


                                <View style={[styles.mb_5]}>
                                    <View>
                                        <Field name="printername">
                                            {props => (
                                                <InputField
                                                    label={'Printer Name'}
                                                    mode={'flat'}
                                                    list={[{label: 'TM-T82', value: 'TM-T82'}]}
                                                    value={props.input.value}
                                                    selectedValue={props.input.value}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    listtype={'other'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}>
                                                </InputField>
                                            )}
                                        </Field>
                                    </View>

                                </View>


                                <View style={[styles.mb_5, styles.grid, styles.justifyContent]}>
                                    <View style={[styles.flexGrow]}>

                                        <Field name="printsize">
                                            {props => (
                                                <InputField
                                                    label={'Printer Size'}
                                                    mode={'flat'}
                                                    list={[{label: '56 mm', value: '56'}, {
                                                        label: '72 mm',
                                                        value: '72'
                                                    }, {label: '80 mm', value: '80'}]}
                                                    value={props.input.value}
                                                    selectedValue={props.input.value}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    listtype={'other'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}>
                                                </InputField>
                                            )}
                                        </Field>
                                    </View>

                                    <View style={[styles.ml_2, {width: '50%'}]}>
                                        <Field name="noofprint">
                                            {props => (
                                                <InputField
                                                    label={'No. of print repeat'}
                                                    mode={'flat'}
                                                    list={[{label: '1', value: '1'}, {
                                                        label: '2',
                                                        value: '2'
                                                    }, {label: '3', value: '3'}]}
                                                    value={props.input.value}
                                                    selectedValue={props.input.value}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    listtype={'other'}
                                                    onChange={(value: any) => {
                                                        console.log('value', value)
                                                        props.input.onChange(value);
                                                    }}>
                                                </InputField>
                                            )}
                                        </Field>
                                    </View>

                                </View>


                                {type.departmentid === PRINTER.INVOICE &&
                                    <View style={[styles.mb_5, styles.grid, styles.justifyContent]}>
                                        <View style={[styles.flexGrow]}>
                                            <Field name="upiid">
                                                {props => (
                                                    <InputBox
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'UPI ID'}

                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[styles.ml_2, {width: '50%'}]}>
                                            <Field name="upiname">
                                                {props => (
                                                    <InputBox
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'UPI Name'}

                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </View>
                                    </View>}


                            </View>
                        </View>
                    </ScrollView>
                    <View style={[styles.grid, styles.justifyContent, styles.p_6]}>
                        <View style={[styles.w_auto]}><Button secondbutton={true}
                                                              onPress={() => dispatch(setModal({visible: false}))}>Cancel</Button></View>
                        <View style={[styles.w_auto, styles.px_4]}><Button disable={more.invalid}
                                                                           secondbutton={more.invalid}
                                                                           secondbutton={true} onPress={() => {
                            testPrint(values)
                        }}>Test Print</Button></View>
                        <View style={[styles.w_auto]}><Button disable={more.invalid} onPress={() => {
                            handleSubmit(values)
                        }}>Save</Button></View>
                    </View>
                </View>
            )}
        >

        </Form>


    </View>
}

const mapStateToProps = (state: any) => ({
    printers: state.localSettings?.printers || {}
})

export default connect(mapStateToProps)(Index);


