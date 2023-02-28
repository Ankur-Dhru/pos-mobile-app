import * as React from 'react';
import {Paragraph, ToggleButton} from 'react-native-paper';
import {useEffect} from "react";
import {styles} from "../../theme";
import {appLog} from "../../libs/function";


const ToggleButtons = (props:any) => {
    const [selectedValue, setSelectedValue] = React.useState(props.default);

    useEffect(() => {
        Boolean(selectedValue) && props.onValueChange(selectedValue)
    }, [selectedValue]);

    return (
        <ToggleButton.Row  onValueChange={value => value && setSelectedValue(value)} value={selectedValue}>
            {
                props?.btns?.map(({label,value}:any)=>{
                    return <ToggleButton   style={{height:40,width:props.width,borderColor:'#ddd',backgroundColor:selectedValue === value?'#eee':'transparent'}}  icon={()=> <Paragraph style={{fontWeight:selectedValue === value?'bold':'normal'}}>{label}</Paragraph>} value={value} />
                })
            }
        </ToggleButton.Row>
    );
};

export default ToggleButtons;
