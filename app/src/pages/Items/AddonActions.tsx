import React from "react";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {View} from "react-native";
import Button from "../../components/Button";
import {Text} from "react-native-paper";
import {addItem} from "../../libs/item-calculation";
import {setBottomSheet} from "../../redux-store/reducer/component";
import {setItemDetail} from "../../redux-store/reducer/item-detail";
import ItemDetail from "./ItemDetail";

const {v4: uuid} = require('uuid')

const Index = ({product,selectItem,fromcart }: any) => {

    const dispatch = useDispatch()

    return (

        <View style={[styles.p_5]}>

            <View style={[styles.mb_5]}>
                <Text>{product?.productdisplayname || product?.itemname}</Text>
            </View>

            <View style={{marginBottom: 15}}>

                <View style={[styles.grid, styles.middle, styles.justifyContent]}>

                    <View style={{width:'50%'}}>
                        <View>
                            <Button
                                onPress={async () => {
                                    let itemdetail = fromcart ? product.itemdetail : product;
                                    itemdetail = {
                                        ...itemdetail,
                                        key: uuid(),
                                    }
                                    addItem(itemdetail)
                                    await dispatch(setBottomSheet({visible: false}))
                                }}> Repeat Last
                            </Button>
                        </View>
                    </View>

                    <View style={{width:'45%'}}>
                        <View>
                            <Button
                                secondbutton={true}
                                onPress={async () => {
                                    let itemdetail = product.itemdetail;
                                    itemdetail={
                                        ...itemdetail,
                                        productqnt:0
                                    }
                                    await dispatch(setItemDetail(itemdetail));
                                    await dispatch(setBottomSheet({
                                        visible: true,
                                        height: '80%',
                                        component: () => <ItemDetail  />
                                    }))

                                }}> + Add New
                            </Button>
                        </View>
                    </View>

                </View>

            </View>

        </View>

    )
}



export default Index;
