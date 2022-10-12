import React, {useEffect, useState} from "react"
import {Dialog, Portal} from "react-native-paper";
import Button from "../Button";
import {connect, useDispatch} from "react-redux";
import {setDialog} from "../../redux-store/reducer/component";
import {View} from "react-native";
import {styles} from "../../theme";

const Index = ({dialog, setDialog}: any) => {

    const [dialo, setDialo] = useState(dialog);
    const dispatch = useDispatch()

    useEffect(() => {
        setDialo(dialog)
    }, [dialog])

    const {visible, title, component,hidecancel,width} = dialo;
    const Component = component;


    if (!visible) {
        return (<></>)
    }

    return (
        <Dialog visible={visible}
                style={{ width: width?width:'90%', alignSelf: "center" }}
                theme={{
                colors: {
                    backdrop: '#00000050'
                }
            }}>
            {Boolean(title) &&  <Dialog.Title>{title}</Dialog.Title>}
            <Dialog.Content>
                <Component/>
            </Dialog.Content>
            {!hidecancel && <Dialog.Actions>
                <View style={[styles.ml_1]}><Button   secondbutton={true} onPress={() => dispatch(setDialog({visible: false}))}>Cancel</Button></View>
            </Dialog.Actions>}
        </Dialog>
    );
};

const mapStateToProps = (state: any) => ({
    dialog: state.component.dialog
});
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
