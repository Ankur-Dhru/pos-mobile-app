import * as React from 'react';

import { StyleSheet, View, Button, SafeAreaView } from 'react-native';
import EscPosPrinter, {
    getPrinterSeriesByName,
    IPrinter,
} from 'react-native-esc-pos-printer';
import { Modal } from 'react-native';

export const base64Image =
    'data:image/png;base64,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';

export default function App() {
    const [init, setInit] = React.useState(false);
    const [printer, setPrinter] = React.useState<IPrinter | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        EscPosPrinter.addPrinterStatusListener((status) => {
            console.log('current printer status:', status);
        });
    }, []);
    React.useEffect(() => {
        console.log(printer);
    }, [printer]);

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={isModalOpen}>

            </Modal>
            <View>
                <Button
                    title="Discover"
                    onPress={() => {
                        console.log('discovering');
                        EscPosPrinter.discover()
                            .then((printers) => {
                                console.log('done!', printers);
                                if (printers[0]) {
                                    setPrinter(printers[0]);
                                }
                            })
                            .catch(console.log);
                    }}
                />

                <Button
                    title="Get lines per row"
                    disabled={!printer}
                    color={!printer ? 'gray' : 'blue'}
                    onPress={async () => {
                        if (printer) {
                            if (!init) {
                                await EscPosPrinter.init({
                                    target: printer.target,
                                    seriesName: getPrinterSeriesByName(printer.name),
                                    language: 'EPOS2_LANG_EN',
                                });
                                setInit(true);
                            }

                            const status = await EscPosPrinter.getPrinterCharsPerLine(
                                getPrinterSeriesByName(printer.name)
                            );

                            console.log('print', status);
                        }
                    }}
                />

                <Button
                    title="Start monitor printer status"
                    disabled={!printer}
                    color={!printer ? 'gray' : 'blue'}
                    onPress={async () => {
                        if (printer) {
                            if (!init) {
                                await EscPosPrinter.init({
                                    target: printer.target,
                                    seriesName: getPrinterSeriesByName(printer.name),
                                    language: 'EPOS2_LANG_EN',
                                });
                                setInit(true);
                            }

                            const status = await EscPosPrinter.startMonitorPrinter();

                            console.log('Printer status:', status);
                        }
                    }}
                />

                <Button
                    title="Stop monitor printer status"
                    disabled={!printer}
                    color={!printer ? 'gray' : 'blue'}
                    onPress={async () => {
                        if (printer) {
                            if (!init) {
                                await EscPosPrinter.init({
                                    target: printer.target,
                                    seriesName: getPrinterSeriesByName(printer.name),
                                    language: 'EPOS2_LANG_EN',
                                });
                                setInit(true);
                            }

                            const status = await EscPosPrinter.stopMonitorPrinter();

                            console.log('Printer status:', status);
                        }
                    }}
                />

                <Button
                    title="Test print chaining"
                    disabled={!printer}
                    color={!printer ? 'gray' : 'blue'}
                    onPress={async () => {
                        try {
                            if (printer) {
                                if (!init) {
                                    await EscPosPrinter.init({
                                        target: printer.target,
                                        seriesName: getPrinterSeriesByName(printer.name),
                                        language: 'EPOS2_LANG_EN',
                                    });
                                    setInit(true);
                                }

                                const printing = new EscPosPrinter.printing();

                                const status = await printing
                                    .initialize()
                                    .align('center')
                                    .size(3, 3)
                                    .line('DUDE!')
                                    .smooth(true)
                                    .line('DUDE!')
                                    .smooth(false)
                                    .size(1, 1)
                                    .text('is that a ')
                                    .bold()
                                    .underline()
                                    .text('printer?')
                                    .newline()
                                    .bold()
                                    .underline()
                                    .align('left')
                                    .text('Left')
                                    .newline()
                                    .align('right')
                                    .text('Right')
                                    .newline()
                                    .size(1, 1)
                                    .textLine(48, {
                                        left: 'Cheesburger',
                                        right: '3 EUR',
                                        gapSymbol: '_',
                                    })
                                    .newline()
                                    .textLine(48, {
                                        left: 'Chickenburger',
                                        right: '1.5 EUR',
                                        gapSymbol: '.',
                                    })
                                    .newline()
                                    .size(2, 2)
                                    .textLine(48, { left: 'Happy Meal', right: '7 EUR' })
                                    .newline()
                                    .align('left')
                                    .text('Left')
                                    .newline()

                                    .align('right')
                                    .text('Right')
                                    .newline()

                                    .align('center')
                                    .image(require('./store.png'), {
                                        width: 75,
                                        halftone: 'EPOS2_HALFTONE_THRESHOLD',
                                    })

                                    .image({ uri: base64Image }, { width: 75 })
                                    .image(
                                        {
                                            uri:
                                                'https://raw.githubusercontent.com/tr3v3r/react-native-esc-pos-printer/main/ios/store.png',
                                        },
                                        { width: 75 }
                                    )
                                    .barcode({
                                        value: 'Test123',
                                        type: 'EPOS2_BARCODE_CODE93',
                                        width: 2,
                                        height: 50,
                                        hri: 'EPOS2_HRI_BELOW',
                                    })
                                    .qrcode({
                                        value: 'Test123',
                                        level: 'EPOS2_LEVEL_M',
                                        width: 5,
                                    })
                                    .cut()
                                    .send();

                                console.log('printing', status);
                            }
                        } catch (error) {
                            console.log('error', error);
                        }
                    }}
                />
            </View>
            <Button
                title="Test multi-print"
                onPress={() => {
                    setIsModalOpen(true);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
