import React, {useEffect, useRef, useState} from "react";

import {View} from "react-native";
import Container from "../../components/Container";
import ReactNativePinView from "react-native-pin-view"
import {useDispatch} from "react-redux";

import {setAlert} from "../../redux-store/reducer/component";
import {Caption, Card, List, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import {localredux} from "../../libs/static";
import {
    CodeField, Cursor,
    isLastFilledCell,
    MaskSymbol,
    useBlurOnFulfill,
    useClearByFocusCell
} from "react-native-confirmation-code-field";
import Avatar from "../../components/Avatar";
import {appLog} from "../../libs/function";


const md5 = require('md5');


const Index = (props: any) => {

    const {navigation, route} = props;

    const kot = route?.params?.kot;
    const cancelKOTDialog = route?.params?.cancelKOTDialog;
    const cancelOrder = route?.params?.cancelOrder;
    const reprintKOT = route?.params?.reprintKOT;


    const action = route?.params?.action;


    let stafflist = localredux?.initData?.staff;

    stafflist = Object.values(stafflist)?.filter((staff: any) => {
        if (Boolean(kot)) {
            return staff.settings.cancelkot
        } else {
            return staff.settings.cancelorder
        }
    }).filter((staff:any)=>{
        return !staff.support
    }).map((staff: any) => {
        return {label: staff.username, value: staff.adminid, more: staff}
    })

    const dispatch = useDispatch()
    let staffRef = useRef();

    const pinView: any = useRef(null)
    const [enteredPin, setEnteredPin] = useState("")
    const [selectedstaff, setSelectedStaff]: any = useState();

    useEffect(() => {
        staffRef.current?.props?.onPress()
    }, [])

    const [value, setValue]:any = useState("")
    const ref = useBlurOnFulfill({value, cellCount: 5});
    const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {

        setTimeout(async () => {
            if (value.length === 5) {
                if (md5(value) === selectedstaff?.loginpin) {
                    navigation.goBack()
                    action === 'cancelkot' && Boolean(cancelKOTDialog) && cancelKOTDialog(kot, true).then();
                    action === 'cancelorder' && Boolean(cancelOrder) && cancelOrder(navigation).then();
                    action === 'reprintkot' && Boolean(reprintKOT) && reprintKOT(kot).then();

                } else {
                    dispatch(setAlert({visible: true, message: 'Wrong Pin'}));
                }
                pinView.current.clearAll()
            }
        }, 200)
    }, [value])


    const renderCell = ({index, symbol, isFocused}:any) => {
        let textChild = null;

        if (symbol) {
            textChild = (
                <MaskSymbol
                    maskSymbol="*️"
                    isLastFilledCell={isLastFilledCell({index, value})}>
                    {symbol}
                </MaskSymbol>
            );
        } else if (isFocused) {
            textChild = <Cursor />;
        }

        return (
            <Text
                key={index}
                style={[styles.cellBox, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        );
    };





    return <Container style={{padding: 0}}>

        <Card style={[styles.card]}>



            <View style={{display:'none'}}>
                <InputField
                    label={'Staff'}
                    customRef={staffRef}
                    divider={true}
                    displaytype={'bottomlist'}
                    inputtype={'dropdown'}
                    list={stafflist}
                    render={() => {
                        return <View>
                            <List.Item
                                style={[styles.listitem]}
                                title={`${selectedstaff?.username || 'Select Staff'}`}
                                left={() => <List.Icon icon="account-outline"/>}
                                right={() => <List.Icon icon="chevron-right"/>}
                            />
                        </View>
                    }}
                    search={false}
                    listtype={'other'}
                    selectedValue={''}
                    onChange={(value: any, more: any) => {
                        setSelectedStaff(more.more)
                    }}
                />
            </View>

            <View style={[styles.h_100, styles.middle,{marginTop:50}]}>

                <View style={{width: 300}}>


                    {Boolean(selectedstaff) && <>

                        <View style={[styles.middle]}>

                            {<View  style={[styles.middle]}>
                                <Avatar label={selectedstaff.firstname+' '+selectedstaff.lastname} value={1}  fontsize={30} size={60}/>
                                <Paragraph style={[styles.paragraph,styles.bold,{textTransform:'capitalize'}]}>{selectedstaff.firstname} {selectedstaff.lastname}</Paragraph>
                            </View>}

                        </View>

                        <View>
                            <CodeField
                                ref={ref}
                                {...props1}
                                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                value={value}
                                onChangeText={setValue}
                                cellCount={5}
                                autoFocus={true}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={renderCell}
                            />
                        </View>

                         </>}
                </View>

            </View>


        </Card>
    </Container>
}


export default Index;

//
