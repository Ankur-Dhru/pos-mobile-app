import {Alert, Text, View} from "react-native";

import EscPosPrinter, {getPrinterSeriesByName} from 'react-native-esc-pos-printer';
import {appLog} from "../../libs/function";
import {styles} from "../../theme";
import Button from "../../components/Button";
import store from "../../redux-store/store";
import {localredux} from "../../libs/static";


const NetPrinting = () => {
    let PAGE_WIDTH = 48;
    const getTrimChar = (count: number, char?: string, defaultLength: number = PAGE_WIDTH) => {
        let space = "";
        if (!Boolean(char)) {
            char = " ";
        }
        for (let i = 0; i < (defaultLength - count); i++) {
            space += char;
        }
        return space;
    }

    const getColString = (value: string, colLength: number) => {
        if (!Boolean(value)) {
            value = " ";
        }

        if (value.length > colLength) {
            value = value.slice(0, colLength)
        }
        return value.toString()
    }

    const getItem = (col1: string = "", col2: string = "", col3: string = "", col4: string = "") => {

        let fixCol1 = 20, fixCol2 = 7, fixCol3 = 9, fixCol4 = 9;

        if (PAGE_WIDTH === 42) {
            fixCol1 = 14;
        }

        col1 = getColString(col1, fixCol1);
        col2 = getColString(col2, fixCol2);
        col3 = getColString(col3, fixCol3);
        col4 = getColString(col4, fixCol4);

        let col1Length = fixCol1 - col1.length;
        let col2Length = fixCol2 - col2.length;
        let col3Length = fixCol3 - col3.length;
        let col4Length = fixCol4 - col4.length;

        let col1String = col1 + getTrimChar(PAGE_WIDTH - col1Length, " ");
        let col2String = getTrimChar(PAGE_WIDTH - col2Length, " ") + col2;
        let col3String = getTrimChar(PAGE_WIDTH - col3Length, " ") + col3;
        let col4String = getTrimChar(PAGE_WIDTH - col4Length, " ") + col4;
        return col1String + " " + col2String + " " + col3String + " " + col4String;
    }


    const getLeftRight = (left: string, right: string, large: boolean = false) => {

        left = getColString(left, PAGE_WIDTH / 2);
        right = getColString(right, PAGE_WIDTH / 2);

        let charLength = left.length + right.length;

        return left + getTrimChar(parseInt(charLength.toString()), " ", large ? PAGE_WIDTH / 2 : PAGE_WIDTH) + right
    }


    const testPrint = async () => {

        const {invoiceitems,vouchertotaldisplay,vouchertaxdisplay,clientname,voucherroundoffdisplay,vouchertotaldiscountamountdisplay,adjustmentamount,typeWiseTaxSummary,date} = store.getState().cartData

        const {currentLocation:{locationname,street1,street2,city}}:any = localredux.localSettingsData;
        const {general:{legalname}}:any = localredux.initData;

        appLog('general',legalname)


        try {
             //const printers = await EscPosPrinter.discover();

            // const printer = printers[0]

            await EscPosPrinter.init({
                target: "TCP:10.1.1.200",
                seriesName: getPrinterSeriesByName("TM-T82"),
                language: 'EPOS2_LANG_EN',
            })

            const printing = new EscPosPrinter.printing();
            // .barcode({
            //     value:'Test123',
            //     type:'EPOS2_BARCODE_CODE93',
            //     hri:'EPOS2_HRI_BELOW',
            //     width:2,
            //     height:50,
            // })
            // .qrcode({
            //     value: 'Test123',
            //     level: 'EPOS2_LEVEL_M',
            //     width: 5,
            // })



            let status = printing
                .initialize()
                .align('center')
                .size(2, 2)
                .line(legalname)
                .smooth()
                .size(2, 1)
                .line(locationname)
                .smooth()
                .size(1, 1)
                .line(street1+' '+street2+' '+city)
                .newline(2)
                .align('right')
                .line('Invoice')
                .size(2, 1)
                .line('Invoice NO : 1')
                .size(1, 1)
                .line(date)
                .align('left')

                .line(getTrimChar(0, '-'))
                .line(clientname)
                .line(getTrimChar(0, '-'))
                .line(getItem("DESCRIPTION", "QNT", "RATE", "AMOUNT") + "\n" + getItem("HSN Code", "GST %", "", ""))
                .line(getTrimChar(0, '-'))




            let totalqnt:any = 0;
            invoiceitems.map((item: any) => {
                totalqnt += item.productqnt
                status.line(getItem(item.productdisplayname, item.productqnt, item.productratedisplay, item.product_total_price_display) + "\n" +
                    getItem(item?.hsn, item?.totalTaxPercentageDisplay + "%", "", ""))
            })



            await status
                .line(getTrimChar(0, '-'))
                .line(getItem(`Total Items ${invoiceitems.length}`, totalqnt, "", vouchertotaldisplay))
                .line(getLeftRight("Total Tax", vouchertaxdisplay))
                .size(2, 2)
                .cut()
                .addPulse()
                .send()

        } catch (e) {
            appLog("Error", e);
        }
    }



    return <View>
        <Button  onPress={() => {
            testPrint().then();
        }}
                more={{backgroundColor: styles.yellow.color,  }}
        > Print </Button>
    </View>
}

export default NetPrinting;
