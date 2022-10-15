import {localredux} from "../../libs/static";
import React, {memo, useEffect, useState} from "react";
import {FlatList, TouchableOpacity, View} from "react-native";
import {Card, Divider, Paragraph} from "react-native-paper";
import {styles} from "../../theme";
import {SearchBox} from "../../components";

import {appLog, filterArray, selectItem} from "../../libs/function";

import AddButton from "./AddButton";
import {connect, useDispatch} from "react-redux";
import {setModal} from "../../redux-store/reducer/component";

const Item = memo(({item}:any) => {

    const dispatch = useDispatch()

    return (<TouchableOpacity onPress={() => {
        selectItem(item);
        dispatch(setModal({visible:false}))
    }} style={[styles.noshadow]}>
        <View style={[styles.grid, styles.noWrap, styles.top,styles.p_4]}>
            <View style={[{width:'62%'}]}>
                <Paragraph style={[styles.paragraph,styles.bold, styles.text_xs]}>{item.itemname}</Paragraph>
            </View>
            {<View  style={[styles.ml_auto]}>
                <AddButton item={item}  />
            </View>}
        </View>

        <Divider/>

    </TouchableOpacity>)
},(r1, r2) => {
    return ((r1.item.productqnt === r2.item.productqnt) && (r1.item.itemid === r2.item.itemid));
})

const Index = ({invoiceitems}: any) => {

    const {itemsData}: any = localredux
    let [items, setItems] = useState([]);
    const [search, setSearch] = useState('');

    const handleSearch = (search:any) => {
        if (Boolean(search) && search.length>3) {
            let finditems = filterArray(Object.values(itemsData), ['itemname', 'uniqueproductcode'], search,false);
            setItems(finditems);
           // setSearch(search)
        }
    }

/*    useEffect(()=>{
        let uitems:any = items?.map((i: any) => {

            const find = invoiceitems?.filter((ii: any) => {
                return i.itemid === ii.itemid;
            })
            if(Boolean(find) && Boolean(find[0])) {
                return  find[0]
            }
            return i;
        })
        setItems(uitems);
    },[invoiceitems,search])*/

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
