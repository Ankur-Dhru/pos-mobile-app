import * as React from 'react';
import {Switch} from 'react-native-paper';


const SwitchC = (props:any) => {

    const [isSwitchOn, setIsSwitchOn] = React.useState(props.value);
    const onToggleSwitch = () => {
        props.toggleSwitch(!isSwitchOn);
        setIsSwitchOn(!isSwitchOn)
    };

    return <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />;
};

export default SwitchC;
