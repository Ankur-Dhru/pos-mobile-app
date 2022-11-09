import React, {Component} from 'react';
import {FlatList, Keyboard, Text, TouchableOpacity, View} from 'react-native';
import {assignOption, filterArray, getType} from "../../libs/function";
import {Appbar, Divider, List, Paragraph, withTheme} from "react-native-paper";

import {styles as theme, styles} from "../../theme";


import Search from "../../components/SearchBox"
import {device} from "../../libs/static";
import Avatar from "../../components/Avatar/PhoneAvatar";
import ProIcon from "../../components/ProIcon";
import Button from "../../components/Button";

class Index extends Component<any> {


    filterlist: any = [];
    originalList: any = [];
    searchText: any;

    constructor(props: any) {
        super(props);
        const {selected, list, multiselect, listtype}: any = this.props;
        this.originalList = list;
        this.filterlist = list;


        if (getType(selected) === 'array' && multiselect) {
            this.filterlist.map((item: any) => {
                selected.some((value: any) => {
                    if (item.value === value) {
                        item.selected = true;
                    }
                })
            })
        }
    }

    selectItem = (item: any) => {

        Keyboard.dismiss();
        const {multiselect}: any = this.props;

        if (!multiselect) {
            this._select(item);
        } else {
            item.selected = !Boolean(item.selected);
            this.forceUpdate()
        }
    }

    _select = (item: any) => {
        const {
            onSelect,
            setBottomSheet,
            closePage,
            pageKey,
            multiselect,
            disabledCloseModal,
            modal,
            setModal
        }: any = this.props;
        onSelect(item);
        setBottomSheet({visible: false});
        if (!Boolean(disabledCloseModal)) {
            Keyboard.dismiss();
            setTimeout(() => {
                //setModal({visible:false})
                closePage(pageKey)
            }, 100)
        }
    }

    confirm = () => {

        Keyboard.dismiss();

        const {onSelect, closePage, pageKey, setModal}: any = this.props;

        let selected = this.filterlist?.filter((item: any) => {
            return item.selected
        }).map((item: any) => {
            return item.value
        })

        onSelect({value: selected})

        setTimeout(() => {
            //setModal({visible:false})
            closePage(pageKey)
        }, 100)

    }

    renderList = ({item}: any) => {
        const {

            selected,

            multiselect,
            listtype,

        }: any = this.props;


        const {colors}: any = this.props.theme;

        return (
            <>
                <View style={[styles.px_5, {paddingLeft: 5}]}>
                    {listtype === 'staff' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item title={item.label}
                                   titleStyle={{textTransform: 'capitalize'}}
                                   left={() => <Avatar label={item.label} size={30} value={item.value}/>}
                                   right={() => +item.value === +selected &&
                                       <View style={{marginTop: 10}}><ProIcon action_type={'text'}
                                                                              color={colors.secondary}
                                                                              name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'task_status' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item title={() => <View
                            style={[styles.flexwidth, {backgroundColor: item.color, borderRadius: 3}]}><Paragraph
                            style={[styles.paragraph, {color: 'white'}]}>  {item.label}  </Paragraph></View>}
                                   titleStyle={{textTransform: 'capitalize'}}
                                   right={() => item.value === selected &&
                                       <View style={{marginTop: 10}}><ProIcon action_type={'text'}
                                                                              color={colors.secondary}
                                                                              name={'check'}/></View>}
                        />
                    </TouchableOpacity>}


                    {listtype === 'priority' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            left={() => <View style={{marginTop: 3}}>
                                <ProIcon color={theme[item.value].color}
                                         name={`${item.value === 'highest' ? 'chevron-double-up' : item.value === 'high' ? 'chevron-up' : item.value === 'low' ? 'chevron-down' : item.value === 'lowest' ? 'chevron-double-down' : 'equals'}`}
                                         size={15}/>
                            </View>}
                            right={() => item.value === selected &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'other' && !multiselect && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            right={() => (item.value === selected) &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'other' && multiselect && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph
                                style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            right={() => item.selected &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}
                </View>
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </>
        );
    };

    handleSearch = (search: any) => {

        this.filterlist = filterArray(this.originalList, ['label'], search);
        this.searchText = search;
        device.searchlist = search;
        this.forceUpdate();
    }



    render() {

        const {
            theme: {colors},
            label,
            addItem,
            multiselect,
            displaytype,
            pageKey,
            closePage
        }: any = this.props;

        return <></>

        return (

            <View style={[styles.w_100, styles.h_100, {backgroundColor: colors.surface}]}>

                <View>


                    {!Boolean(displaytype === 'bottomlist') ?
                        <View style={[styles.borderBottom]}>
                            <Appbar.Header
                                style={[styles.bg_white, styles.noshadow, styles.borderBottom, styles.justifyContent,]}>

                                <View><TouchableOpacity onPress={() => {
                                    closePage(pageKey)
                                }} style={[styles.p_5]}><Paragraph><ProIcon
                                    name={'xmark'}/></Paragraph></TouchableOpacity></View>

                                <View style={[styles.w_auto]}>
                                    <Paragraph
                                        style={[styles.paragraph, styles.bold, {textAlign: 'center'}]}>{label}</Paragraph>
                                </View>
                                <View style={{width: 60}}>{Boolean(addItem) && <View>{addItem}</View>}</View>

                                {/* {Boolean(onAdd) && <View style={[{paddingRight: 5}]}>
                                    <Button compact={true} secondbutton={!Boolean(this.searchText)} disabled={!Boolean(this.searchText)} onPress={() => {
                                        this._onAdd()
                                    }}> {'Add'}  </Button>
                                </View>}*/}

                            </Appbar.Header>

                            <View>
                                <View>
                                    <Search autoFocus={false} label={label} placeholder={`Search...`}
                                            handleSearch={this.handleSearch}/>
                                </View>
                            </View>
                        </View> : <View></View>}
                </View>

                <View style={[styles.w_100, styles.h_100]}>
                    <FlatList
                        scrollIndicatorInsets={{right: 1}}
                        data={this.filterlist}
                        accessible={true}
                        keyboardDismissMode={'none'}
                        keyboardShouldPersistTaps={'always'}
                        renderItem={this.renderList}
                        ListFooterComponent={() => {
                            return <View style={{height: 150}}>

                            </View>
                        }}
                        ListEmptyComponent={<View>
                            <View style={[styles.p_6]}>
                                <Text style={[styles.paragraph, styles.mb_2, styles.muted, {textAlign: 'center'}]}> No
                                    result found</Text>
                            </View>
                        </View>}
                        initialNumToRender={20}
                    />
                </View>


                <View style={[{marginTop: 'auto', backgroundColor: 'white'}, styles.p_6]}>
                    <View>

                        {multiselect && <View><Button onPress={() => {
                            this.confirm()
                        }}> Confirm </Button></View>}
                    </View>
                </View>


            </View>
        );
    }
}


export default (withTheme(Index));




