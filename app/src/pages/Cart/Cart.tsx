import React, {Suspense, useEffect, useRef, useState} from "react";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import DetailView from "./DetailView";
import GroupList from "../Items/GroupList";
import {useDispatch} from "react-redux";
import {Card, Paragraph, Text, Button as Btn, Title} from "react-native-paper";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import CartTotal from "./CartTotal";


import {device, localredux} from "../../libs/static";

import CartActions from "./CartActions";
import {Container, ProIcon} from "../../components";
import {setSelected} from "../../redux-store/reducer/selected-data";
import SearchItem from "../Items/SearchItem";
import GroupHeading from "../Items/GroupHeading";
import ClientDetail from "../Client/ClientDetail";
import {useNavigation} from "@react-navigation/native";
import {appLog, cancelOrder, isRestaurant, saveTempLocalOrder} from "../../libs/function";
import NumPad from "../Items/NumPad";
import {hideLoader, openPage, setModal, showLoader} from "../../redux-store/reducer/component";
import ItemListMobile from "../Items/ItemListMobile";
import ItemListTablet from "../Items/ItemListTablet";
import store from "../../redux-store/store";
import AddEditCategory from "../Items/AddEditCategory";
import GroupListMobile from "../Items/GroupListMobile";




const Index = (props: any) => {


    const {tabledetails} = props;
    const navigation = useNavigation()

    const [numpad,setNumpad] = useState(false)

    const hasrestaurant = isRestaurant();

    const dispatch = useDispatch()



    return <>

        <View style={[styles.h_100, styles.flex, device.tablet?styles.p_4:styles.bg_white]}>



        {
            device.tablet ? <>

                <View style={[styles.grid,styles.justifyContent,styles.w_100]}>
                    {Boolean(tabledetails?.tablename) ?  <View style={{marginRight:5}}><Card style={[styles.noshadow]} onPress={()=> {
                        dispatch(showLoader());  saveTempLocalOrder().then(() => { navigation.goBack(); dispatch(hideLoader()); })
                    }}>
                        <View  style={[styles.grid,styles.middle,styles.w_auto,{padding:11,marginRight:6,minWidth:120}]}>
                             <ProIcon name={'chevron-left'} action_type={'text'} />
                            <Paragraph style={[styles.paragraph,styles.bold]}> {tabledetails?.tablename} </Paragraph>
                        </View>
                    </Card></View> : <Card style={[styles.noshadow,{marginRight:5}]}>
                        <TouchableOpacity onPress={()=> navigation.openDrawer()} style={[styles.px_6,{padding:11}]}>
                            <ProIcon name={'bars'} action_type={'text'} />
                        </TouchableOpacity>
                    </Card> }
                    <Card style={[styles.noshadow,styles.flexGrow,styles.grid,styles.justifyContent,styles.px_4,styles.w_auto,{minWidth:'25%'}]}>
                        <TouchableOpacity  onPress={() => dispatch(openPage({title: 'Search Items',visible:true,component: (props:any)=><SearchItem {...props} navigation={navigation} />}))}>
                            <View style={[styles.grid,styles.middle,{padding:11}]}>
                                <Paragraph  style={[styles.paragraph]}> Search Item</Paragraph>
                            </View>
                        </TouchableOpacity>

                        {/*<TouchableOpacity style={[styles.px_6,{backgroundColor:'white',padding:11,borderRadius:5,marginLeft:5}]} onPress={()=>setNumpad(!numpad)}>
                            <Paragraph><ProIcon name={'keyboard'} color={!numpad?'#ccc':'#000'} action_type={'text'}/></Paragraph>
                        </TouchableOpacity>*/}
                    </Card>
                    {<View style={{marginLeft:5,marginRight:5,width:'auto',minWidth:'30%'}}>
                        <ClientDetail/>
                    </View>}
                    <View>
                        <Button
                            onPress={() => cancelOrder(navigation).then()}
                            more={{backgroundColor: styles.red.color, color: 'white'}}
                        > Cancel </Button>
                    </View>
                </View>

                <View  style={[styles.grid, styles.justifyContent, styles.noWrap, styles.h_100, styles.flex, styles.py_4]}>


                    <Card  style={[styles.h_100, styles.w_auto, {minWidth: 120}]} >
                        <GroupList navigation={navigation} />
                    </Card>

                    <Card style={[styles.flexGrow,styles.noshadow,styles.w_auto,{marginLeft: 5,marginRight:5,minWidth:'40%'}]}>

                        {!numpad ?
                            <ItemListTablet navigation={navigation}/>:
                            <NumPad/>
                        }
                    </Card>

                    <View style={[styles.w_auto, {minWidth: '40%'}]}>
                        <DetailView  style={{padding: 0}}/>
                    </View>

                </View>

                <CartActions/>


            </> : <Container
                config={{title:tabledetails?.tablename || 'Retail Order',hideback:!hasrestaurant,drawer:!hasrestaurant,
                    backAction:()=> {
                        dispatch(showLoader());  saveTempLocalOrder().then(() => { navigation.goBack(); dispatch(hideLoader()); })
                    },

                    actions:()=> <>
                        <TouchableOpacity style={[styles.p_5]} onPress={() => navigation.navigate('AddEditItemNavigator') }>
                            <ProIcon name={'magnifying-glass'} />
                        </TouchableOpacity>
                    </>

                    /*actions:()=>
                        <TouchableOpacity style={[styles.p_5]} onPress={() => dispatch(openPage({title: 'Search Items',visible:true,component: (props:any)=><SearchItem {...props} navigation={navigation} />}))}>
                            <ProIcon name={'magnifying-glass'} />
                        </TouchableOpacity>*/}}>

                <View style={[styles.h_100, styles.flex, {flexDirection: 'column',paddingTop:5}]}>

                    <GroupHeading />

                    <Card style={[styles.h_100, styles.flex]}>
                        <ItemListMobile navigation={navigation}/>

                        <View>
                             <GroupListMobile />
                        </View>

                        <CartTotal/>

                    </Card>
                </View>
            </Container>
        }

        </View>

    </>
}


export default Index;
