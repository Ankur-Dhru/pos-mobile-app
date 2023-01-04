import React, {useState} from "react";

import {Platform, SafeAreaView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Card, Paragraph} from "react-native-paper";
import {composeValidators, defaultTestTemplate, PRINTER, required} from "../../libs/static";
import Button from "../../components/Button";
import {connect, useDispatch} from "react-redux";
import {appLog, errorAlert, saveLocalSettings} from "../../libs/function";
import InputField from "../../components/InputField";
import {Container} from "../../components";
import KeyboardScroll from "../../components/KeyboardScroll";
import {useNavigation} from "@react-navigation/native";
import CheckBox from "../../components/CheckBox";
import BlueToothList from "./BlueToothList";
import {sendDataToPrinter} from "../../libs/Network";
import {setBottomSheet} from "../../redux-store/reducer/component";
import RNFS from "react-native-fs";
import SunmiPrinter from "@heasy/react-native-sunmi-printer";


const Index = (props: any) => {


    let {printers}: any = props;
    const type = props?.route?.params?.type

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const [init, setInit]: any = useState(
        {
            printertype: 'network',
            bluetoothdetail: {},
            macid: '',
            ip: '',
            host: '',
            broadcastip: '',
            printername: 'TM-T82',
            port: '9100',
            printsize: '48',
            noofprint: '1',
            printoncancel: true,
            ...printers[type.departmentid]
        }
    )

    const setMacId = (bt: any) => {
        setInit({
            ...init,
            printertype: 'bluetooth',
            bluetoothdetail: bt.bluetoothdevice,
            macid: bt.bluetoothdevice.value
        })
    }

    const handleSubmit = async (values: any) => {

        printers = {
            ...printers,
            [type.departmentid]: values
        }
        if (!values.test) {
            await saveLocalSettings('printers', printers).then(() => {
                navigation.goBack()
            })
        }
    }

    navigation.setOptions({
        headerTitle: `${type.departmentid === PRINTER.INVOICE ? 'Invoice' : 'KOT'} Printer`
    })


    //{value: 'shared', label: 'Shared Printer'},

    let printerTypes = [{
        value: 'network',
        label: 'Network Printer'
    }, {
        value: 'broadcast',
        label: 'Broadcast Printer'
    }]

    if (Platform.OS !== 'ios') {
        printerTypes.push({
            value: 'bluetooth',
            label: 'Bluetooth Printer'
        })
    }

    return <Container>
        <SafeAreaView>
            <Form
                initialValues={init}
                onSubmit={handleSubmit}
                render={({handleSubmit, submitting, values, ...more}: any) => (
                    <View style={[styles.middle]}>
                        <View style={[styles.middleForm]}>
                            <KeyboardScroll>
                                <View>

                                    <View>

                                        <Card style={[styles.card]}>
                                            <Card.Content style={[styles.cardContent]}>


                                                <View>
                                                    <Field name="printertype">
                                                        {props => (
                                                            <InputField
                                                                label={'Printer Type'}
                                                                mode={'flat'}
                                                                list={printerTypes}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);

                                                                    setInit({
                                                                        ...init,
                                                                        printertype: value
                                                                    })

                                                                    if (value === 'bluetooth') {
                                                                        dispatch(setBottomSheet({
                                                                            visible: true,
                                                                            height: '80%',
                                                                            component: () => <BlueToothList
                                                                                setMacId={setMacId}/>
                                                                        }))
                                                                    }

                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>


                                            </Card.Content>
                                        </Card>

                                        {Boolean(values.printertype === 'broadcast') && <>

                                            <Card style={[styles.card]}>
                                                <Card.Content style={[styles.cardContent]}>
                                                    <Field name="broadcastip" validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Broadcast IP'}
                                                                value={props.input.value}
                                                                inputtype={'textbox'}

                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>


                                                </Card.Content>
                                            </Card>

                                        </>}


                                        {Boolean(values.bluetoothdetail?.value) && Boolean(values.printertype === 'bluetooth') && <>
                                            <Card style={[styles.card]} onPress={() => {
                                                dispatch(setBottomSheet({
                                                    visible: true,
                                                    height: '80%',
                                                    component: () => <BlueToothList setMacId={setMacId}/>
                                                }))
                                            }}>
                                                <Card.Content style={[styles.cardContent]}>
                                                    <>
                                                        <View>
                                                            <Paragraph style={[styles.paragraph, styles.bold]}>
                                                                {values.bluetoothdetail?.label}
                                                            </Paragraph>
                                                        </View>
                                                    </>
                                                </Card.Content>
                                            </Card>
                                        </>}


                                        {Boolean(values.printertype === 'network') && <><Card style={[styles.card]}>
                                            <Card.Content style={[styles.cardContent]}>


                                                <View style={[styles.grid, styles.justifyContent]}>
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


                                            </Card.Content>
                                        </Card></>}


                                        {(Boolean(values.printertype === 'network') || Boolean(values.printertype === 'bluetooth')) && <>
                                            <Card style={[styles.card]}>
                                                <Card.Content style={[styles.cardContent]}>

                                                    <View style={[styles.grid, styles.justifyContent]}>
                                                        <View style={[styles.flexGrow]}>

                                                            <Field name="printsize">
                                                                {props => (
                                                                    <InputField
                                                                        label={'Printer Size'}
                                                                        mode={'flat'}
                                                                        list={[
                                                                            {label: '56 mm', value: '32'},
                                                                            {label: '72 mm', value: '42'},
                                                                            {label: '80 mm', value: '48'}
                                                                        ]}
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
                                                        <View>
                                                            <View style={[]}>
                                                                <Field name="printoncancel">
                                                                    {props => (
                                                                        <><CheckBox
                                                                            value={props.input.value}
                                                                            label={'Print on cancel KOT or cancel Order'}
                                                                            onChange={(value: any) => {
                                                                                values.printoncancel = value;
                                                                            }}
                                                                        /></>
                                                                    )}
                                                                </Field>
                                                            </View>
                                                        </View>}

                                                </Card.Content>
                                            </Card>
                                        </>}


                                        {(type.departmentid === PRINTER.INVOICE && Boolean(values.printertype !== 'broadcast')) &&
                                            <Card style={[styles.card]}>
                                                <Card.Content style={[styles.cardContent]}>
                                                    <View style={[styles.grid, styles.justifyContent]}>
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
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        }


                                    </View>
                                </View>
                            </KeyboardScroll>
                            <View style={[styles.submitbutton]}>

                                {<View style={[styles.grid, styles.justifyContent]}>
                                    <View style={[styles.w_auto]}>
                                        <Button disable={more.invalid}
                                                more={{color: 'black', backgroundColor: styles.secondary.color}}
                                                secondbutton={true} onPress={() => {

                                            testPrint(values).then(r => {

                                            });
                                        }}>Test Print </Button>
                                    </View>

                                    <View style={[styles.w_auto, styles.ml_2]}>
                                        <Button more={{color: 'white'}} disable={more.invalid}
                                                secondbutton={more.invalid}
                                                onPress={() => {
                                                    handleSubmit(values)
                                                }}> Save
                                        </Button>
                                    </View>

                                </View>}


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


export const testPrint = async (printer: any) => {

    /*const qrurl = `upi://pay?cu=INR&pa=8866522619@upi&pn=ankurpatel&am=100&tr=100`;

    await RNFS.readFile(qrurl)
        .then(async (base64result) =>{
             appLog('base64result',base64result)
        });*/

    sendDataToPrinter({message: 'Test Print Success', printinvoice: true}, defaultTestTemplate, printer).then((msg) => {
        errorAlert(msg)
    });
}



