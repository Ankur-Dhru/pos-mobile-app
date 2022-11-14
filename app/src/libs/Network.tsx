
import { EscPos } from 'escpos-xml';
import Mustache from "mustache";
import {errorAlert, paperCut} from "./function";
import store from "../redux-store/store";
import {setAlert} from "../redux-store/reducer/component";

 const net = require('react-native-tcp-socket');

const connectToPrinter = (
    printer: any,
    buffer: Buffer,
): Promise<unknown> => {
    return new Promise(async (res: (value: unknown) => void, rej) => {

        let device = new net.Socket();

        device.on('close', () => {
           if (device) {
               device.destroy();
               device = null;
           }
           res(true);
           return;
       });

       device.on('error', rej);

       const {port,host}:any = printer;


       if(Boolean(printer)) {
           device.connect({port, host},async () => {
               device.write(buffer);
               device.emit('close');
               paperCut(printer).then()
           });
       }

    });

};

export const sendDataToPrinter = async (input: any, template: string,printer:any) => {

    let xmlData = Mustache.render(template, input);

    const buffer = EscPos.getBufferFromXML(xmlData);

    try {
        if(Boolean(printer)) {
            await connectToPrinter(printer, (buffer as unknown) as Buffer);
        }
        else{
            store.dispatch(setAlert({visible: true, message: 'No printer set'}))
        }
    } catch (err) {
        console.log('some error', err);
    }
};
