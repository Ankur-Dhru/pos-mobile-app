import {EscPos} from 'escpos-xml';
import Mustache from "mustache";
import {appLog} from "./function";
import store from "../redux-store/store";
import {setAlert} from "../redux-store/reducer/component";
import EscPosPrinter, {getPrinterSeriesByName} from "react-native-esc-pos-printer";

const net = require('react-native-tcp-socket');

const connectToPrinter = async (printer: any, buffer: Buffer,): Promise<unknown> => {
    return new Promise(async (res: (value: unknown) => void, rej) => {

        try {
            let device = new net.Socket();

            device.on('close', async () => {
                if (device) {
                    device.destroy();
                    device = null;
                }

                res(true);
                return;
            });

            device.on('error', () => rej('error'));

            const {port, host}: any = printer;

            if (Boolean(printer?.host)) {

                await device.connect({port, host}, async () => {

                    device.write(buffer);
                    device.emit('close');

                });
            }
        } catch (e) {
            appLog('e print', e)
        }

    });

};

export const sendDataToPrinter = async (input: any, template: string, printer: any) => {

    return await new Promise(async (resolve) => {
        try {
            let xmlData = Mustache.render(template, input);

            const buffer = EscPos.getBufferFromXML(xmlData);

            appLog('printer',printer)

            if (Boolean(printer?.host)) {
                return await connectToPrinter(printer, (buffer as unknown) as Buffer).then(async () => {
                    await paperCut(printer).then(() => {
                        resolve({})
                    })
                });
            } else {
                store.dispatch(setAlert({visible: true, message: 'printer not set'}))
                resolve({})
            }
        } catch (err) {
            console.log('some error', err);
            resolve({})
        }

    })


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
                await status.line(`Scan to Pay`).qrcode(qrcode)
            }

            await status.line("Powered By Dhru ERP").cut().addPulse().send()
            resolve({})
        } catch (e) {
            appLog('e', e)
        }


    });


}
