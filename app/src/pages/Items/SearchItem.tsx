import {localredux} from "../../libs/static";
import React, {useState} from "react";
import {FlatList, View} from "react-native";
import {Card} from "react-native-paper";
import {styles} from "../../theme";
import {SearchBox} from "../../components";
import Item from "./Item";


const Index = (props: any) => {

    const {itemsData}: any = localredux
    const [items, setItems] = useState([]);
    const {handleSearch}: any = props


    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index} search={true} key={i.item.key || i.item.productid}/>
        );
    };

    return (

        <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

            <View style={[styles.grid, styles.middle]}>

                <View style={[styles.flexGrow]}>
                    <SearchBox handleSearch={handleSearch} autoFocus={false} placeholder="Search Item"/>
                </View>

            </View>

            <Card style={[styles.h_100, styles.flex]}>
                <Card.Content style={[styles.cardContent]}>
                    <FlatList
                        data={items}
                        renderItem={renderitems}
                        keyExtractor={item => item.itemid}
                    />
                </Card.Content>
            </Card>
        </View>


    )

}

export default Index;
