
import { EscPos } from 'escpos-xml';
import Mustache from "mustache";

 const net = require('react-native-tcp-socket');

//const net = require("net")


const PRINTERS = [{ device_name: 'TM-82', host: '10.1.1.200', port: 9100 }];

const connectToPrinter = (
    host: string,
    port: number,
    buffer: Buffer,
): Promise<unknown> => {
    return new Promise((res: (value: unknown) => void, rej) => {

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

       device.connect({port, host}, () => {
           device.write(buffer);
           device.emit('close');
       });


    });
};

export const sendDataToPrinter = async (input: any, template: string) => {
    const { host, port } = PRINTERS[0];

    let xmlData = Mustache.render(template, input);

    const buffer = EscPos.getBufferFromXML(xmlData);
    try {
        await connectToPrinter(host, port, (buffer as unknown) as Buffer);
    } catch (err) {
        console.log('some error', err);
    }
};
