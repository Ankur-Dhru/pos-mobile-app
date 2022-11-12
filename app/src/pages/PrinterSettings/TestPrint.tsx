import { sendDataToPrinter } from './Network';
import { TEMPLATES } from './Templates';

export const printBasic = async () => {
    const input = {
        title: 'Sample 123',
        thankyouNote: 'Welcome...!'
    };

    const data = {
        title: 'Tile',
        subtitle: 'Subtitle',
        description: 'This is a description',
        date: new Date(),
        price: 1.99,
        paddedString: '&nbsp;&nbsp;&nbsp;&nbsp;Line padded with 4 spaces',
        condictionA: false,
        condictionB: true,
        barcode: '12345678',
        qrcode: 'hello qrcode',
        underline: 'underline'
    }

    await sendDataToPrinter(data, TEMPLATES.BASIC);
};


