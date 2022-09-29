import React from "react";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import Items from "../Items/ItemList";
import {useDispatch} from "react-redux";
import {Card, Paragraph} from "react-native-paper";
import InputField from "../../components/InputField";
import CartTotal from "./CartTotal";


import {device, localredux} from "../../libs/static";
import DetailView from "./DetailView";
import GroupList from "../Items/GroupList";
import CartActions from "./CartActions";
import {ProIcon} from "../../components";
import {setSelectedData} from "../../redux-store/reducer/selected-data";
import SearchItem from "../Items/SearchItem";
import GroupHeading from "../Items/GroupHeading";
import ClientDetail from "../Client/ClientDetail";
import {useNavigation} from "@react-navigation/native";
import {saveTempLocalOrder} from "../../libs/function";


const Index = (props: any) => {


    const {itemgroup} = localredux.initData
    const {tabledetails} = props;
    const navigation = useNavigation()

    const dispatch = useDispatch()


    let groups: any = Object.values(itemgroup).map((group: any) => {
        return {label: group.itemgroupname, value: group.itemgroupid}
    })


    return <>

        <View style={[styles.h_100, styles.flex, styles.p_4]}>
        <View style={[styles.grid,styles.justifyContent]}>
            <TouchableOpacity onPress={()=> {
                saveTempLocalOrder().then(() => {})
                navigation.goBack()
            }}>
                <View  style={[styles.grid,styles.middle,styles.bg_white,{width:145,padding:12,borderRadius:5}]}>
                    <Paragraph><ProIcon name={'chevron-left'} action_type={'text'} /></Paragraph>
                    <Paragraph style={[styles.paragraph,styles.bold]}>  {tabledetails?.tablename || 'Retail'}</Paragraph>
                </View>
            </TouchableOpacity>
            <View style={[styles.flexGrow,{paddingLeft:5,paddingRight:5}]}>
                <SearchItem/>
            </View>
            <View style={{width:385}}>
                <ClientDetail/>
            </View>
        </View>

        {
            device.tablet ? <>
                <View
                    style={[styles.grid, styles.justifyContent, styles.noWrap, styles.h_100, styles.flex, styles.py_4]}>


                    <View style={[styles.flex, styles.column, styles.h_100, {minWidth: '40%'}]}>



                        <View style={[styles.grid, styles.flex, styles.h_100, styles.noWrap]}>
                            <View style={[styles.grid, styles.flexGrow, styles.h_100, styles.w_auto, {
                                minWidth: 150,
                                maxWidth: 150
                            }]}>
                                <Card style={[styles.w_100]}>
                                    <GroupList groups={groups}/>
                                </Card>
                            </View>
                            <Card style={[styles.flexGrow, {marginLeft: 5,marginRight:5}]}>
                                <Items/>
                            </Card>

                        </View>

                    </View>

                    <View style={[styles.flexGrow, {width: 200}]}>
                        <DetailView style={{padding: 0}}/>
                    </View>

                </View>

                <CartActions/>

                <View style={{display: 'none'}}>
                    <CartTotal/>
                </View>

            </> : <>

                <View style={[styles.h_100, styles.flex, {flexDirection: 'column'}]}>

                    <GroupHeading />

                    <Card style={[styles.h_100, styles.flex]}>
                        <Items/>

                        <View>

                            <View style={[{marginTop: -55}]}>
                                <InputField
                                    removeSpace={true}
                                    label={'Category'}
                                    divider={true}
                                    displaytype={'pagelist'}
                                    inputtype={'dropdown'}
                                    render={() => <View style={[styles.grid, styles.center, styles.mb_5]}>
                                        <View
                                            style={[styles.badge, styles.px_5,styles.py_5, styles.grid, styles.noWrap, styles.middle, {
                                                backgroundColor: '#000',
                                                borderRadius: 30,
                                                paddingLeft: 20,
                                                paddingRight: 20
                                            }]}>
                                            <Paragraph><ProIcon name={'bars-staggered'} type={"solid"} color={'white'}
                                                                size={'18'} action_type={'text'}/> </Paragraph>
                                            <Paragraph
                                                style={[styles.paragraph, styles.bold, {color: 'white'}]}> Categories</Paragraph>
                                        </View>
                                    </View>}
                                    list={groups}
                                    search={false}
                                    listtype={'staff'}
                                    selectedValue={''}
                                    onChange={(value: any) => {
                                        dispatch(setSelectedData({group: value}))
                                    }}
                                />
                            </View>


                        </View>

                        <CartTotal/>

                    </Card>
                </View>
            </>
        }

        </View>

    </>
}


export default Index;
