import apiService from "../../libs/api-service";
import {ACTIONS, localredux, METHOD, STATUS} from "../../libs/static";
import React, {useEffect, useState} from "react";
import {appLog, chevronRight, filterArray, isDebug, saveTempLocalOrder} from "../../libs/function";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Appbar, Button, Card, Divider, Paragraph, Text} from "react-native-paper";
import {styles} from "../../theme";
import {ProIcon, SearchBox} from "../../components";
import Item from "./Item";



const Index = (props:any) => {

    const {itemsData}:any = localredux
    const [items,setItems] = useState([]);
    const {handleSearch}:any = props



    /*const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index} search={true}  key={i.item.key || i.item.productid} />
        );
    };*/

    return (

        <View style={[styles.h_100, styles.flex,styles.w_100, {flexDirection: 'column'}]}>

            <View style={[styles.grid,styles.middle]}>

                <View style={[styles.flexGrow]}>
                    <SearchBox handleSearch={handleSearch} autoFocus={false} placeholder="Search Item" />
                </View>

            </View>

            {/*<Card style={[styles.h_100, styles.flex]}>
                <Card.Content style={[styles.cardContent]}>
                    <FlatList
                        data={items}
                        renderItem={renderitems}
                        keyExtractor={item => item.productid}
                    />
                </Card.Content>
            </Card>*/}
        </View>


    )

}

export default Index;
