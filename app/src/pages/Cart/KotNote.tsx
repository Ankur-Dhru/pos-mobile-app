import React, {memo, useState} from "react";
import {ScrollView, View} from "react-native";
import {Card, Divider, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {updateCartField} from "../../redux-store/reducer/cart-data";
import { TextInput as TextInputReact } from 'react-native';
import Button from "../../components/Button";
import {useNavigation} from "@react-navigation/native";
import {Container} from "../../components";
import {useDispatch} from "react-redux";


const Index = (props: any) => {

    const commonkotnote = props.route?.params?.commonkotnote;

    const dispatch:any = useDispatch();
    const navigation:any = useNavigation()
    const [note,setNote]:any = useState(commonkotnote)

    return (
        <Container>
            <Card style={[styles.card,styles.flex,styles.h_100]}>

                <Card.Content  style={[styles.cardContent,styles.h_100]}>

                        <TextInputReact
                            onChangeText={(e:any) => { setNote(e) }}
                            defaultValue={note}
                            placeholder={'KOT Note'}
                            multiline={true}
                            autoFocus={true}
                            autoCapitalize='words'
                            style={{color:'black'}}
                        />

                </Card.Content>

            </Card>

            {<View   style={[styles.submitbutton]}>
                <Button       onPress={()=>{
                    dispatch(updateCartField({commonkotnote:note}))
                    navigation.goBack()
                }}> Save  </Button>
            </View>}
        </Container>
    );
}

export default withTheme(Index);
