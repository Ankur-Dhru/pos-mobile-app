import React from "react";

import {SafeAreaView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Title} from "react-native-paper";
import {composeValidators, PRINTER, required, supportedPrinterList} from "../../libs/static";
import Button from "../../components/Button";
import {connect} from "react-redux";
import {saveLocalSettings, testPrint} from "../../libs/function";
import InputField from "../../components/InputField";
import {Container} from "../../components";
import KeyboardScroll from "../../components/KeyboardScroll";
import {useNavigation} from "@react-navigation/native";
import CheckBox from "../../components/CheckBox";


const Index = (props: any) => {


    let {printers}: any = props;
    const type = props?.route?.params?.type

    const navigation = useNavigation()

    const handleSubmit = async (values: any) => {

        printers = {
            ...printers,
            [type.departmentid]: values
        }
        await saveLocalSettings('printers', printers).then(() => {
            navigation.goBack()
        })
    }


    const initialValues = {
        printertype: 'network',
        ip: '',
        host: '',
        printername: '',
        port: '9100',
        printsize: '72',
        noofprint: '1',
        printoncancel:true,
        ...printers[type.departmentid]
    }

    //{value: 'shared', label: 'Shared Printer'},

    return <Container>
            <SafeAreaView>
            <Form
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View style={[styles.middle]}>
                        <View style={[styles.middleForm]}>
                            <KeyboardScroll>
                                <View style={[styles.px_6]}>

                                    <Title
                                        style={[styles.mt_5]}>{type.departmentid === PRINTER.INVOICE ? 'Invoice' : 'KOT'} Printer </Title>

                                    <View>

                                        <View>
                                            <Field name="printertype">
                                                {props => (
                                                    <InputField
                                                        label={'Printer Type'}
                                                        mode={'flat'}
                                                        list={[{
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

                                                <Field name="host" validate={composeValidators(required)}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'IP'}
                                                            value={props.input.value}
                                                            inputtype={'textbox'}

                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                            </View>

                                            <View style={[styles.ml_2, {width: '50%'}]}>
                                                <Field name="port">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Port'}
                                                            inputtype={'textbox'}
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
                                                            list={supportedPrinterList.map((item:any)=>{
                                                                return {label:item,value:item}
                                                            })}
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

                                        {type.departmentid !== PRINTER.INVOICE &&
                                            <View style={[styles.mb_5]}>
                                                <View style={[]}>
                                                    <Field name="printoncancel">
                                                        {props => (
                                                            <><CheckBox
                                                                value={props.input.value}
                                                                label={'Print on cancel KOT or order'}
                                                                onChange={(value: any) => {
                                                                    values.printoncancel = value;
                                                                }}
                                                            /></>
                                                        )}
                                                    </Field>
                                                </View>
                                            </View>}


                                        {type.departmentid === PRINTER.INVOICE &&
                                            <View style={[styles.mb_5, styles.grid, styles.justifyContent]}>
                                                <View style={[styles.flexGrow]}>
                                                    <Field name="upiid">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'UPI ID'}
                                                                inputtype={'textbox'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View style={[styles.ml_2, {width: '50%'}]}>
                                                    <Field name="upiname">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'UPI Name'}
                                                                inputtype={'textbox'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>
                                            </View>}


                                        <Button disable={more.invalid}

                                                secondbutton={true} onPress={() => {
                                            testPrint(values)
                                        }}>Test Print</Button>

                                    </View>
                                </View>
                            </KeyboardScroll>
                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid}
                                        onPress={() => {
                                            handleSubmit(values)
                                        }}> Save
                                </Button>
                            </View>
                        </View>
                    </View>
                )}
            >

            </Form>

            </SafeAreaView>
    </Container>
}

const mapStateToProps = (state: any) => ({
    printers: state.localSettings?.printers || {}
})

export default connect(mapStateToProps)(Index);


