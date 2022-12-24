import React from "react";

import {Platform, SafeAreaView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Card} from "react-native-paper";
import {
    ACTIONS,
    composeValidators,
    defaultInvoiceTemplate, defaultTestTemplate,
    METHOD,
    PRINTER,
    required,
    supportedPrinterList
} from "../../libs/static";
import Button from "../../components/Button";
import {connect} from "react-redux";
import {appLog, getTemplate, saveLocalSettings} from "../../libs/function";
import InputField from "../../components/InputField";
import {Container} from "../../components";
import KeyboardScroll from "../../components/KeyboardScroll";
import {useNavigation} from "@react-navigation/native";
import CheckBox from "../../components/CheckBox";
import BlueToothPrinter from "./BlueToothPrinter";
import BleManager from "react-native-ble-manager";
import {EscPos} from "escpos-xml";
import EscPosPrinter, {getPrinterSeriesByName} from "react-native-esc-pos-printer";
import apiService from "../../libs/api-service";
import {sendDataToPrinter} from "../../libs/Network";
import store from "../../redux-store/store";
import {setAlert} from "../../redux-store/reducer/component";
import Mustache from "mustache";


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


    let initialValues = {
        printertype: 'network',
        bluetoothdetail: {},
        macid: '',
        ip: '',
        host: '',
        broadcastip:'',
        printername: 'TM-T82',
        port: '9100',
        printsize: '48',
        noofprint: '1',
        printoncancel: true,
        ...printers[type.departmentid]
    }

    navigation.setOptions({
        headerTitle:`${type.departmentid === PRINTER.INVOICE ? 'Invoice' : 'KOT'} Printer`
    })

    //{value: 'shared', label: 'Shared Printer'},

    let printerTypes = [{
        value: 'network',
        label: 'Network Printer'
    },{
        value: 'broadcast',
        label: 'Broadcast Printer'
    }]

    if(Platform.OS !== 'ios'){
        printerTypes.push({
            value: 'bluetooth',
            label: 'Bluetooth Printer'
        })
    }

    return <Container>
        <SafeAreaView>
            <Form
                initialValues={initialValues}
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
                                                        }}>
                                                    </InputField>
                                                )}
                                            </Field>
                                        </View>




                                            </Card.Content>
                                        </Card>

                                        {values.printertype === 'broadcast' ? <>

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

                                        </> : <>

                                            <Card style={[styles.card]}>
                                                <Card.Content style={[styles.cardContent]}>

                                                    {values.printertype === 'bluetooth' ? <>
                                                        <Field name="macid">
                                                            {props => (
                                                                <><BlueToothPrinter values={values} fieldprops={props}/></>
                                                            )}
                                                        </Field>
                                                    </> : <>
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


                                                        {/*<View>
                                                            <View>
                                                                <Field name="printername">
                                                                    {props => (
                                                                        <InputField
                                                                            label={'Printer Name'}
                                                                            mode={'flat'}
                                                                            list={supportedPrinterList.map((item: any) => {
                                                                                return {label: item, value: item}
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

                                                        </View>*/}

                                                    </>}


                                                </Card.Content>
                                            </Card>


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


                                            {type.departmentid === PRINTER.INVOICE &&

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

                                        </>}


                                    </View>
                                </View>
                            </KeyboardScroll>
                            <View style={[styles.submitbutton]}>

                                {<View style={[styles.grid, styles.justifyContent]}>
                                    <View style={[styles.w_auto]}>
                                        <Button disable={more.invalid}
                                                more={{color: 'black',backgroundColor:styles.secondary.color}}
                                                secondbutton={true} onPress={() => {
                                            testPrint(values).then(r => {
                                                //handleSubmit(values)
                                            });
                                        }}>Test Print  </Button>
                                    </View>

                                    <View style={[styles.w_auto, styles.ml_2]}>
                                        <Button more={{color: 'white'}} disable={more.invalid} secondbutton={more.invalid}
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




    const {broadcastip, printertype, bluetoothdetail}: any = printer;

    let xmlData = Mustache.render(getTemplate(defaultTestTemplate), {message:'Test Print Success'});
    const buffer: any = EscPos.getBufferFromXML(xmlData);

    if (printertype === 'bluetooth') {
        const peripheral = bluetoothdetail.more;
        readyforPrint(peripheral).then((findSC: any) => {

            BleManager.write(peripheral.id, findSC?.service, findSC?.characteristic, [...buffer]).then(() => {
                BleManager.disconnect(peripheral.id).then(() => {
                        console.log("Disconnected");
                    })
                    .catch((error) => {
                        // Failure code
                        console.log(error);
                    });
            });
        })

    }
    else if(printertype === 'broadcast'){

        if(Boolean(broadcastip)) {
            apiService({
                method: METHOD.POST,
                action: ACTIONS.PRINT,
                body: {
                    buffer: [...buffer],
                },
                other: {url: `http://${broadcastip}:8081/`},
                queryString: {remoteprint: true}
            }).then((response: any) => {
                store.dispatch(setAlert({visible: true, message: response.message}))
                appLog('response', response)
            })
        }

    }
    else {

        sendDataToPrinter({message:'Test Print Success'}, defaultTestTemplate, printer).then((msg) => {
            store.dispatch(setAlert({visible: true, message: msg}))
        });


        /*await EscPosPrinter.init({
            target: `TCP:${host}`,
            seriesName: getPrinterSeriesByName(printername),
            language: 'EPOS2_LANG_EN',
        })

        const printing = new EscPosPrinter.printing();
        let status = printing
            .initialize()
            .align('center')
            .size(2, 2)
            .line('Test Print')
            .newline(1)
            .cut()
            .addPulse()
            .send()*/

    }
}




const connectToDevice = async (peripheral: any) => {
    return await new Promise(async (resolve) => {
        if (peripheral) {
            if (peripheral.connected) {
                resolve(true)
            } else {
                await BleManager.connect(peripheral.id).then(() => {
                    resolve(true)
                }).catch((error) => {
                    appLog('Connection error', error);
                    resolve(false)
                });
            }
        } else {
            resolve(false)
        }
    })
}

export const readyforPrint = async (peripheral: any) => {

    return await new Promise(async (resolve) => {

        connectToDevice(peripheral).then(async (connected) => {
            if (connected) {

                BleManager.retrieveServices(peripheral.id).then((peripheralInfo: any) => {

                    const findSC = peripheralInfo?.characteristics?.find((sc: any) => sc?.characteristic?.length === 36 && sc?.service?.length === 36)
                    if (findSC?.service && findSC?.characteristic) {
                        setTimeout(() => {
                            BleManager.startNotification(peripheral.id, findSC?.service, findSC?.characteristic).then(() => {
                                setTimeout(() => {
                                    resolve(findSC)
                                }, 200)
                            }).catch((error) => {
                                appLog('Notification error', error);
                                resolve(false)
                            });
                        }, 200);
                    }
                });
            }
        })

    })
}
