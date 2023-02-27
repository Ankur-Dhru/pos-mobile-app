import React, {memo, useEffect, useState} from "react";

import {View} from "react-native";
import Container from "../../components/Container";
import {connect} from "react-redux";
import {Caption, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {
    CodeField,
    Cursor,
    isLastFilledCell,
    MaskSymbol,
    useBlurOnFulfill,
    useClearByFocusCell
} from "react-native-confirmation-code-field";


const md5 = require('md5');


const Index = (props: any) => {

    let {route: {params}, navigation, syncDetail}: any = props;

    return <></>

   /* const [value1, setValue1]: any = useState("")
    const [value2, setValue2]: any = useState("")
    const ref1 = useBlurOnFulfill({value1, cellCount: 5});
    const ref2 = useBlurOnFulfill({value2, cellCount: 5});
    const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
        value1,
        setValue1,
    });

    const [props2, getCellOnLayoutHandler2] = useClearByFocusCell({
        value2,
        setValue2,
    });

    useEffect(() => {
        setTimeout(async () => {
            if (value1.length === 5) {

            }
        }, 200)
    }, [value1]);


    const renderCell = ({index, symbol, isFocused}: any) => {
        let textChild = null;

        if (symbol) {
            textChild = (
                <MaskSymbol
                    maskSymbol="*️"
                    isLastFilledCell={isLastFilledCell({index, value1})}>
                    {symbol}
                </MaskSymbol>
            );
        } else if (isFocused) {
            textChild = <Cursor/>;
        }

        return (
            <Text
                key={index}
                style={[styles.cellBox, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        );
    };*/

    return <Container style={styles.bg_white}>


        {/*<View style={[styles.h_100, styles.middle]}>

            <View style={{width: 300}}>

                <Caption>Old PIN</Caption>

                <View style={[styles.mb_5]}>
                    <CodeField
                        ref={ref1}
                        {...props1}
                        value={value1}
                        onChangeText={setValue1}
                        cellCount={5}
                        autoFocus={!Boolean(syncDetail?.type)}

                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={renderCell}
                    />
                </View>


                <Caption style={[styles.mt_5]}>New PIN</Caption>

                <View>
                    <CodeField
                        ref={ref2}
                        {...props2}
                        value={value2}
                        onChangeText={setValue2}
                        cellCount={5}
                        autoFocus={!Boolean(syncDetail?.type)}

                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={renderCell}
                    />
                </View>


            </View>


        </View>*/}

    </Container>
}


const mapStateToProps = (state: any) => ({})

export default connect(mapStateToProps)(withTheme(memo(Index)));

