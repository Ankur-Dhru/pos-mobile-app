import * as React from 'react';

import {Container, ProIcon} from "../../components";
import {SafeAreaView, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {Form} from "react-final-form";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Caption, Card} from "react-native-paper";
import {localredux} from "../../libs/static";
import {saveServerSettings} from "../../libs/function";

const Index = (props: any) => {

    const {currentLocation} = localredux.localSettingsData;

    const colors = [
        '#EF6351', '#F38375', '#F7A399', '#FBC3BC', '#FFE3E0',
        '#0B6DA2', '#0E89CB', '#15A3EF', '#3EB3F2', '#66C3F4',
        '#625231', '#826D42', '#A38852', '#B79F6F', '#C7B590',
        '#87711B', '#CAA928', '#D9BB41', '#E0C762', '#E7D384',
        '#12C0CF', '#33DEED', '#50E3F0', '#6EE7F2', '#8BECF5',
        '#ff0a54', '#ff477e', '#ff5c8a', '#ff7096', '#ff85a1',
        '#00043a', '#002962', '#004e89', '#015ea4', '#407ba7',
        '#7c2e41', '#942b3b', '#ab2836', '#c32530', '#db222a',
        '#005c00', '#2d661b', '#2a850e', '#27a300', '#3ec300',
        '#ec3f13', '#fa5e1f', '#ff7e33', '#ff931f', '#ffb950',
    ]
    const initdata = currentLocation?.order || {}

    const handleSubmit = (values: any) => {
        currentLocation.order = values;
        saveServerSettings('location', [{"key": currentLocation.locationid, "value": currentLocation}]).then()
    }

    return (
        <Container style={styles.bg_white}>
            <SafeAreaView>
                <Form
                    onSubmit={handleSubmit}
                    initialValues={{...initdata}}
                    render={({handleSubmit, submitting, values, form, ...more}: any) => (
                        <>

                            <View style={[styles.middle,]}>
                                <View style={[styles.middleForm, {maxWidth: 400}]}>

                                    <KeyboardScroll>


                                        <View>
                                            <View>
                                                {<Card style={[styles.card]}>
                                                    <Card.Content style={[styles.cardContent]}>
                                                        <View>


                                                            <Caption style={[styles.caption, styles.mt_5]}>Website
                                                                Theme</Caption>
                                                            <View style={[styles.grid,]}>
                                                                {
                                                                    colors.map((color: any, index: any) => {
                                                                        return <View key={index}>
                                                                            <TouchableOpacity
                                                                                style={[styles.flexGrow, styles.center, styles.middle, {
                                                                                    minWidth: 60,
                                                                                    height: 60,
                                                                                    backgroundColor: color
                                                                                }]} onPress={() => {

                                                                                form.change('themecolor', color)
                                                                                handleSubmit(values)

                                                                            }}>
                                                                                {values.themecolor === color &&
                                                                                    <ProIcon name={'check'}
                                                                                             color={'white'}/>}
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    })
                                                                }
                                                            </View>


                                                        </View>
                                                    </Card.Content>
                                                </Card>}


                                            </View>
                                        </View>

                                    </KeyboardScroll>


                                </View>
                            </View>

                        </>
                    )}
                />
            </SafeAreaView>
        </Container>
    );
}

export default Index
