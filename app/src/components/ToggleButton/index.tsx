import * as React from 'react';
import {Paragraph, ToggleButton} from 'react-native-paper';
import {useEffect} from "react";
import {styles} from "../../theme";


const ToggleButtons = (props:any) => {
    const [value, setValue] = React.useState(props.default);

    useEffect(() => {
        Boolean(value) && props.onValueChange(value)
    }, [value]);


    return (
        <ToggleButton.Row  onValueChange={value => setValue(value)} value={value}>
            {
                props?.btns?.map(({label,value}:any)=>{
                    return <ToggleButton   style={{height:40,width:props.width,borderColor:'#ddd'}}  icon={()=> <Paragraph>{label}</Paragraph>} value={value} />
                })
            }
        </ToggleButton.Row>
    );
};

export default ToggleButtons;
