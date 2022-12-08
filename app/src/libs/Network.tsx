import {EscPos} from 'escpos-xml';
import Mustache from "mustache";
import store from "../redux-store/store";
import {setAlert} from "../redux-store/reducer/component";
import EscPosPrinter, {getPrinterSeriesByName} from "react-native-esc-pos-printer";
import BleManager from "react-native-ble-manager";
import {readyforPrint} from "../pages/PrinterSettings/Setting";
import apiService from "./api-service";
import {ACTIONS, METHOD} from "./static";

const net = require('react-native-tcp-socket');


export const sendDataToPrinter = async (input: any, template: string, printer: any) => {

    return await new Promise(async (resolve) => {
        try {

            let xmlData = Mustache.render(template, input);

            const buffer = EscPos.getBufferFromXML(xmlData);

            if (printer?.printertype === 'bluetooth') {
                const peripheral = printer?.bluetoothdetail.more;

                BleManager.start({showAlert: false}).then(()=> {
                    readyforPrint(peripheral).then((findSC: any) => {
                        BleManager.write(peripheral.id, findSC?.service, findSC?.characteristic, [...buffer]).then(() => {
                            /*BleManager.disconnect(peripheral.id).then(() => {console.log("Disconnected");})
                                .catch((error) => {// Failure code
                                    console.log(error);
                                });*/
                            resolve('Print Successful')
                        });

                    })
                })

            }
            else if(printer?.printertype === 'broadcast'){
                apiService({
                    method: METHOD.POST,
                    action: input.printinvoice ? ACTIONS.PRINT : ACTIONS.KOT_PRINT,
                    body:{
                        buffer: [...buffer],
                        kot:input,
                        debugPrint: true,
                        displayQR: true,
                        vouchertotaldisplay: input.vouchertotaldisplay,
                        invoice_display_number: input.invoice_display_number,
                        terminalname: input.terminalname,
                    },
                    other:{url:`http://${printer?.broadcastip}:8081/`},
                    queryString:{remoteprint:true}
                }).then((response: any) => {
                    resolve('Print Successful')
                })

            }
            else{
                if (Boolean(printer?.host)) {
                    return await connectToPrinter(printer, (buffer as unknown) as Buffer).then(async (msg:any) => {
                        if(Boolean(msg)) {
                            setTimeout(async ()=>{
                                await paperCut(printer).then((msg) => {
                                    resolve(msg)
                                })
                            },500)
                        }
                        else{
                            store.dispatch(setAlert({visible: true, message: msg}))
                        }
                    });
                } else {
                    resolve('printer not set')
                }
            }



        } catch (err) {
            resolve('Check Printer Connection')
        }

    })


};


const connectToPrinter = async (printer: any, buffer: Buffer,): Promise<unknown> => {

    return new Promise(async (res: (value: unknown) => void, rej) => {

        try {
            let device = new net.Socket();

            if(device) {

                device.on('close', async () => {
                    if (device) {
                        device.destroy();
                        device.end();
                        device = null;
                    }
                    res('Print Successful');
                });

                device.on('timeout', () => {
                    device.end();
                    res('Printer connection timeout');
                });

                device.on('error', () => res('Printer connection Error'));

                const {port, host}: any = printer;

                if (Boolean(printer?.host)) {
                    await device.connect({port, host}, async () => {
                        device.write(buffer);
                        setTimeout(()=>{
                            device.emit('close');
                        },500)
                    });
                    await device.setTimeout(5000)
                }
            }

        } catch (e) {
            res('Printer connection Error');
        }

    });

};

export const paperCut = async (printer: any) => {

    return await new Promise(async (resolve) => {

        try {

            const {host, printername, qrcode}: any = printer
            await EscPosPrinter.init({
                target: `TCP:${host}`,
                seriesName: getPrinterSeriesByName(printername),
                language: 'EPOS2_LANG_EN',
            })

            const printing = new EscPosPrinter.printing();

            let status = await printing.initialize().align('center');

            if (Boolean(qrcode)) {
                status.line(`Scan to Pay`).qrcode(qrcode)
            }
            await status.line("Powered By Dhru ERP").cut().addPulse().send()
            resolve('Print successful')
        } catch (e) {
            resolve('Printer connection Error')
        }


    });


}
