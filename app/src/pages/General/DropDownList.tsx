import React, {useState} from 'react';
import {FlatList, Keyboard, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {appLog, filterArray, getType} from "../../libs/function";
import {Divider, List, Paragraph, withTheme} from "react-native-paper";

import {styles as theme, styles} from "../../theme";


import Search from "../../components/SearchBox"
import {device, ItemDivider, urls} from "../../libs/static";
import Avatar from "../../components/Avatar";
import ProIcon from "../../components/ProIcon";
import Button from "../../components/Button";
import Container from "../../components/Container";
import KAccessoryView from '../../components/KAccessoryView';

const Index = (props: any) => {

    const {navigation, route}: any = props

    const {
        selected,
        list,
        multiselect,
        listtype,
        onSelect,
        gridview,
        gridviewicon,
        label,
        addItem,
        displaytype,
    }: any = route?.params || {};


    if (getType(selected) === 'array' && multiselect) {
        list.map((item: any) => {
            selected.some((value: any) => {
                if (item.value === value) {
                    item.selected = true;
                }
            })
        })
    }

    let [filterlist, setFilterList]: any = useState(list)
    let [grview, setGrView]: any = useState(gridview)

    const selectItem = (item: any) => {

        Keyboard.dismiss();

        if (!multiselect) {
            _select(item);
        } else {
            item.selected = !Boolean(item.selected);
        }
    }

    const _select = (item: any) => {
        onSelect(item);
        Keyboard.dismiss();
        setTimeout(() => {
            navigation.goBack()
        }, 100)
    }

    const confirm = () => {

        Keyboard.dismiss();

        let selected = filterlist?.filter((item: any) => {
            return item.selected
        }).map((item: any) => {
            return item.value
        })

        onSelect({value: selected})

        setTimeout(() => {
            navigation.goBack()
        }, 100)

    }


    const renderList = ({item}: any) => {


        return (
            <>
                <View>
                    {listtype === 'staff' && <TouchableOpacity onPress={() => {
                        selectItem(item);
                    }}>
                        <List.Item title={item.label}
                                   titleStyle={{textTransform: 'capitalize'}}
                                   left={() => <Avatar label={item.label}   value={item.value}/>}
                                   right={() => +item.value === +selected && <View style={[styles.mt_2]}><ProIcon name={'check'} /></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'task_status' && <TouchableOpacity onPress={() => {
                        selectItem(item);
                    }}>
                        <List.Item title={() => <View style={[styles.flexwidth]}><Paragraph style={[styles.paragraph]}>  {item.label}  </Paragraph></View>}
                                   titleStyle={{textTransform: 'capitalize'}}
                                   left={() => <Avatar label={item.label} backgroundColor={item?.color || 'black'}  value={item.value} size={40}/>}
                                   right={() => item.value === selected && <View style={[styles.mt_2]}><ProIcon name={'check'} /></View>}
                        />
                    </TouchableOpacity>}


                    {listtype === 'item_category' && <TouchableOpacity onPress={() => {
                        selectItem(item);
                    }}>
                        <>
                            {!Boolean(grview) ? <List.Item title={() => <View style={[styles.flexwidth]}><Paragraph style={[styles.paragraph]}>  {item.label}  </Paragraph></View>}
                                       titleStyle={{textTransform: 'capitalize'}}
                                       left={() => <Avatar label={item.label} backgroundColor={item?.color || 'black'}  value={item.value} size={40}/>}
                                       right={() => item.value === selected && <View style={[styles.mt_2]}><ProIcon name={'check'} /></View>}
                            /> :  <>
                                <View style={[styles.flexGrow,styles.center, styles.p_3, styles.middle, {
                                    width: 115,

                                    maxWidth:136,
                                    borderColor:'white',
                                    margin:2,
                                    marginBottom:2,
                                    minHeight:80,
                                    paddingBottom:3,
                                    borderRadius:5,
                                    backgroundColor:item?.color || 'black'
                                }]}>
                                    <View style={[styles.p_3]}>
                                        <Paragraph style={[styles.paragraph,{color:'white'}]}>{item.label}</Paragraph>
                                    </View>
                                </View>
                            </>
                            }
                        </>
                     </TouchableOpacity> }


                    {listtype === 'priority' && <TouchableOpacity onPress={() => {
                        selectItem(item);
                    }}>
                        <List.Item
                            title={item.label}
                            titleStyle={{textTransform: 'capitalize'}}
                            left={() => <View style={{marginTop: 3}}>
                                <ProIcon color={theme[item.value].color}
                                         name={`${item.value === 'highest' ? 'chevron-double-up' : item.value === 'high' ? 'chevron-up' : item.value === 'low' ? 'chevron-down' : item.value === 'lowest' ? 'chevron-double-down' : 'equals'}`}
                                         size={15}/>
                            </View>}
                            right={() => item.value === selected && <View style={[styles.mt_2]}><ProIcon name={'check'} /></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'other' && !multiselect && <TouchableOpacity onPress={() => {
                        !Boolean(item.disable) && selectItem(item);
                    }}>
                        <List.Item
                            title={item.label}
                            description={item.description}
                            titleStyle={{textTransform: 'capitalize',color:item.disable?'#ccc':'#222'}}
                            right={() => (item.value === selected) && <View style={[styles.mt_2]}><ProIcon name={'check'} /></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'other' && multiselect && <TouchableOpacity onPress={() => {
                        selectItem(item);
                    }}>
                        <List.Item
                            title={item.label}
                            titleStyle={{textTransform: 'capitalize'}}
                            right={() => item.selected && <View style={[styles.mt_2]}><ProIcon name={'check'} /></View>}
                        />
                    </TouchableOpacity>}
                </View>
            </>
        );
    };

    const handleSearch = (search: any) => {
        setFilterList(filterArray(list, ['label'], search))
        device.searchlist = search;
    }

    navigation.setOptions({
        headerTitle: label,
        /*headerLeft:()=> <View>
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }}>
                <ProIcon name={'xmark'}/>
            </TouchableOpacity>
        </View>,*/
    })

    if(Boolean(addItem)){
        navigation.setOptions({
            headerRight: () => addItem
        })
    }


    return (

        <Container   style={styles.bg_white}>

            <View>
                <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                    <View style={[styles.w_auto]}>
                        <Search autoFocus={false} label={label} onIconPress={() => navigation.goBack()}
                              icon={{ source: 'arrow-left', direction: 'auto' }} placeholder={`Search ${label}...`}
                              handleSearch={handleSearch}/>
                    </View>
                    {Boolean(gridviewicon) && <TouchableOpacity onPress={()=>{
                        setGrView(!grview)
                    }}>
                        <ProIcon name={grview?'list':'grid'}/>
                    </TouchableOpacity>}
                    {Boolean(addItem) && <View>
                        {!Boolean(urls.localserver) && addItem}
                    </View>}
                </View>
            </View>


                <View key={grview?'grid':'list'} style={[styles.mt_2]}>
                    <FlatList
                        scrollIndicatorInsets={{right: 1}}
                        data={filterlist}
                        accessible={true}
                        keyboardDismissMode={'on-drag'}
                        keyboardShouldPersistTaps={'always'}
                        renderItem={renderList}
                        numColumns={grview?3:1}
                        ListFooterComponent={() => {
                            return <View style={{height: 150}}>

                            </View>
                        }}
                        ItemSeparatorComponent={ItemDivider}
                        ListEmptyComponent={<View>
                            <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No
                                    result found</Text>
                            </View>
                        </View>}
                        initialNumToRender={20}
                    />
                </View>


                <KAccessoryView>
                    <View>
                        {multiselect && <View><Button onPress={() => {
                            confirm()
                        }}> Confirm </Button></View>}
                    </View>
                </KAccessoryView>


        </Container>
    );

}


export default (withTheme(Index));




