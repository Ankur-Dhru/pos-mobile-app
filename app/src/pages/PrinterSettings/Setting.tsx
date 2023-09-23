import React, {useRef, useState} from "react";

import {Platform, SafeAreaView, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {Card, Paragraph} from "react-native-paper";
import {
    composeValidators,
    defaultTestTemplate,
    defaultTestTemplateHTML,
    localredux,
    PRINTER,
    required, supportedPrinterList
} from "../../libs/static";
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

import QRCode from "react-native-qrcode-svg";
import {uuid} from "uuidv4";
import {v4 as uuidv4} from "uuid";
import {setSettings} from "../../redux-store/reducer/local-settings-data";



const Index = (props: any) => {


    let {printers}: any = props;
    const type = props?.route?.params?.type;
    const {printingtemplate} =  localredux.initData;

    //let qrsvg = useRef()

    const navigation = useNavigation()
    const dispatch = useDispatch()


    const templates =  Object.keys(printingtemplate).map((key:any)=>{
        return {label:printingtemplate[key].templatename,value:key}
    })

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
            webviewwidth:240,
            noofprint: '1',
            templatetype:'',
            printpreview:false,
            printoncancel: true,
            papercutmanual:false,
            ...printers[type.departmentid] || {...printers['0000'],template:''}
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

    /*const getDataURL = () => {
        qrsvg.toDataURL((dataURl:any)=>{
            appLog('dataURl',dataURl)
        });
    }*/

    const handleSubmit = async (values: any) => {

        if(values?.printertype === 'broadcast'){
            values.broadcastip = `http://${values.broadcastip}:8081`
        }

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
        headerTitle: `${type.departmentid === PRINTER.INVOICE ? 'Invoice' : type.departmentid === PRINTER.DAYENDREPORT ? 'Day end report' : type.departmentid === PRINTER.SALESRETURN ? 'Sales Return' : 'KOT'} Printer`
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
        }, {
            value: 'sunmi',
            label: 'Sunmi Built in printer'
        })
    }


    return <Container>
        <SafeAreaView>
            <Form
                initialValues={init}
                onSubmit={handleSubmit}
                render={({handleSubmit, submitting, values,form, ...more}: any) => (
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




                                        {values.printertype !== 'broadcast' &&    <Card style={[styles.card]}>
                                            <Card.Content style={[styles.cardContent]}>



                                                {values.printertype === 'network' &&  <View>
                                                    <Field name="printername"  validate={composeValidators(required)}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Printer Serial No.'}
                                                                mode={'flat'}
                                                                list={supportedPrinterList.map((item)=>{
                                                                    return {label:item,value:item}
                                                                })}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                    form.change('template','');
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>}



                                                <View>
                                                    <View>
                                                        <Field name="template"  validate={composeValidators(required)}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    key={values.printername}
                                                                    label={'Template'}
                                                                    mode={'flat'}
                                                                    list={templates.filter((template:any)=>{
                                                                        if(values.printertype === 'sunmi') {
                                                                            return printingtemplate[template.value].type === 'ThermalHtml'
                                                                        }
                                                                        else {
                                                                            return true
                                                                        }
                                                                    }).map((template:any)=>{

                                                                        const isGeneric = (values.printername === 'Other - Generic - ESC/POS' && printingtemplate[template.value].type === 'ThermalHtml');
                                                                        const disable = (isGeneric && Platform.OS === 'ios')
                                                                        return {...template,description:isGeneric?'Android Only':'Android, iOS',disable:disable}
                                                                    })}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        setInit({
                                                                            ...init,
                                                                            templatetype: printingtemplate[value].type,
                                                                            printpreview: Boolean(printingtemplate[value].type === 'ThermalHtml'),
                                                                            template: value
                                                                        })
                                                                    }}>
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>

                                                    <View>
                                                        <Field name="printsize">
                                                        {props => (
                                                            <InputField
                                                                label={'Printer Size'}
                                                                mode={'flat'}
                                                                list={[
                                                                    {label: '56mm - 1x', value: '32',webview:150},
                                                                    {label: '56mm - 2x', value: '32.1',webview:180},
                                                                    {label: '72mm - 1x', value: '42',webview:195},
                                                                    {label: '80mm - 1x', value: '48',webview:240},
                                                                    {label: '80mm - 2x', value: '48.1',webview:390},
                                                                ]}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any,more:any) => {
                                                                    appLog('more',more)
                                                                    values.webviewwidth = more.webview;
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                    </View>


                                                    <View>
                                                        <Field name="webviewwidth">
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Custom Size'}
                                                                    value={props.input.value+''}
                                                                    inputtype={'textbox'}

                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value)
                                                                    }}

                                                                />
                                                            )}
                                                        </Field>
                                                    </View>


                                                    {<Field name="papercutmanual">
                                                        {props => (
                                                            <><CheckBox
                                                                value={props.input.value}
                                                                label={'Paper Cut Manual'}
                                                                onChange={(value: any) => {
                                                                    values.papercutmanual = value;
                                                                }}
                                                            /></>
                                                        )}
                                                    </Field>}

                                                    {/*<>
                                                        {values.templatetype === 'ThermalHtml' ? <View>
                                                            <Field name="printpreview">
                                                                {props => (
                                                                    <><CheckBox
                                                                        value={props.input.value}
                                                                        label={'Show preview before print'}
                                                                        onChange={(value: any) => {
                                                                            values.printpreview = value;
                                                                        }}
                                                                    /></>
                                                                )}
                                                            </Field>
                                                        </View> : <View>
                                                            {values.template && <Paragraph style={[styles.paragraph,{color:styles.red.color}]}>Preview not available on this template</Paragraph>}
                                                        </View>}
                                                    </>*/}

                                                </View>
                                            </Card.Content>
                                        </Card> }


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

                                                    <View>

                                                        {/*<View>
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
                                                        </View>*/}

                                                    </View>

                                                    {(type.departmentid !== PRINTER.INVOICE && type.departmentid !== PRINTER.DAYENDREPORT) &&
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


                                        {/*{(type.departmentid === PRINTER.INVOICE && Boolean(values.printertype !== 'broadcast')) &&
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
                                        }*/}

                                        {/*<QRCode
                                            value="Just some string value"
                                            getRef={(c) => (qrsvg = c)}
                                        />*/}

                                    </View>
                                </View>




                            </KeyboardScroll>
                            <View style={[styles.submitbutton]}>


                                {<View style={[styles.grid, styles.justifyContent]}>



                                    {<View style={[styles.w_auto,styles.mr_2]}>
                                        <Button disable={more.invalid}
                                                more={{color: 'black', backgroundColor: styles.secondary.color}}
                                                secondbutton={true} onPress={() => {

                                            testPrint(values).then(r => {

                                            });
                                        }}>Test Print </Button>
                                    </View>}

                                    <View style={[styles.w_auto, ]}>
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

    sendDataToPrinter({message: 'Test Print Success', printinvoice: true},printer.templatetype === 'ThermalHtml'? defaultTestTemplateHTML : defaultTestTemplate, printer).then((msg) => {
        appLog('msg',msg)
        errorAlert(msg)
    });
}



