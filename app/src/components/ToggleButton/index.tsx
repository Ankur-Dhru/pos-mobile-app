import * as React from 'react';
import {Paragraph, ToggleButton} from 'react-native-paper';
import {useEffect} from "react";
import {styles} from "../../theme";



const ToggleButtons = (props:any) => {
    const [selectedValue, setSelectedValue] = React.useState(props.default);

    useEffect(() => {
        Boolean(selectedValue) && props.onValueChange(selectedValue)
    }, [selectedValue]);

    return (
        <ToggleButton.Row  onValueChange={value => value && setSelectedValue(value)} value={selectedValue}>
            {
                props?.btns?.map(({label,value}:any)=>{
                    return <ToggleButton key={value}  style={{height:40,width:props.width,borderColor:'transparent',backgroundColor:selectedValue === value?styles.secondary.color:styles.secondary2.color}} disabled={props.disabled} icon={()=> <Paragraph style={{fontWeight:selectedValue === value?'bold':'normal',color:selectedValue === value?'black':'black'}}>{label}</Paragraph>} value={value} />
                })
            }
        </ToggleButton.Row>
    );
};

export default ToggleButtons;
