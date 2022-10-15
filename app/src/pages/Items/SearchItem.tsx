import {localredux} from "../../libs/static";
import React, {memo, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {SearchBox} from "../../components";

import {appLog, filterArray, selectItem} from "../../libs/function";

import AddButton from "./AddButton";
import {connect} from "react-redux";

const Item = memo(({item}:any) => {


    return (<TouchableOpacity onPress={() => {!Boolean(item?.productqnt) && selectItem(item)}}
                              style={[styles.noshadow]}>

        <View>
            <View>
                <View style={[styles.autoGrid, styles.noWrap, styles.top,styles.p_4]}>
                    <View style={[{width:'62%'}]}>
                        <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>
                    </View>
                    {<View  style={[styles.ml_auto]}>
                        <AddButton item={item}  />
                    </View>}
                </View>
            </View>

        </View>

        <Divider/>

    </TouchableOpacity>)
},(r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})

const Index = ({invoiceitems}: any) => {

    const {itemsData}: any = localredux
    const [items, setItems] = useState([]);

    const handleSearch = (search:any) => {
        let finditems;
        if (Boolean(search) && search.length>3) {
            appLog('search',search)
            finditems = filterArray(Object.values(itemsData), ['itemname', 'uniqueproductcode'], search,false)
        }

        finditems = finditems?.map((i: any) => {
            const find = invoiceitems?.filter((ii: any) => {
                return i.itemid === ii.itemid;
            })
            if(Boolean(find) && Boolean(find[0])) {
                return  find[0]
            }
            return i;
        })

        setItems(finditems);
    }

    const renderitems = (i: any) => {
        return (
            <Item item={i.item} index={i.index} search={true} key={i.item.key || i.item.productid}/>
        );
    };

    return (

        <View style={[styles.h_100, styles.flex, styles.w_100, {flexDirection: 'column'}]}>

            <View style={[styles.grid, styles.middle]}>

                <View style={[styles.flexGrow]}>
                    <SearchBox handleSearch={handleSearch} autoFocus={true} placeholder="Search Item"/>
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

const mapStateToProps = (state: any) => ({
    invoiceitems: state.cartData.invoiceitems,
})

export default connect(mapStateToProps)(Index);
