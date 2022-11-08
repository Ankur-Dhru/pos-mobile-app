import React, {Component} from 'react';
import {FlatList, Keyboard, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import {filterArray, assignOption, getType, log, appLog} from "../../libs/function";
import {Appbar, Divider, List, Paragraph, withTheme} from "react-native-paper";

import {Button, ProIcon} from "../index";
import {closePage, openPage, setBottomSheet, setModal} from "../../redux-store/reducer/component";
import {styles as theme, styles} from "../../theme";

import Avatar from "../Avatar";

import Search from "../SearchBox";

import {device} from "../../libs/static";

class ListView extends Component<any> {


    filterlist: any = [];
    originalList: any = [];
    searchText: any;

    constructor(props: any) {
        super(props);
        const {selected, list, multiselect,listtype}: any = this.props;
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
        const {onSelect, setBottomSheet,  closePage,pageKey, multiselect, disabledCloseModal,modal,setModal}: any = this.props;
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

        const {onSelect, closePage,pageKey,setModal}: any = this.props;

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
            onSelect,
            setBottomSheet,
            selected,
            displaytype,
            multiselect,
            listtype,
            closePage
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
        // let {list}: any = this.props;
        this.filterlist = filterArray(this.originalList, ['label'], search);
        this.searchText = search;
        device.searchlist = search;
        this.forceUpdate();
    }

    _onAdd = () => {
        let {onAdd}: any = this.props;

        if (Boolean(this.searchText?.trim())) {
            this.originalList = [...this.originalList, assignOption(this.searchText, this.searchText,'','','','',true)];
            this.handleSearch(this.searchText);
            onAdd(this.searchText, (value: any) => {
                this._select(value);
            });
            //this.confirm()
        } else {
            onAdd(this.props)
        }
    }

    render() {

        const {
            theme: {colors},
            label,
            showlabel,
            search,
            appbar,
            navigation,
            addItem,
            multiselect,
            displaytype,
            onAdd,
            setModal,
            pageKey,
            closePage
        }: any = this.props;

        return (

            <View style={[styles.w_100, styles.h_100,  {backgroundColor: colors.surface}]}>

                <View>


                    {!Boolean(displaytype === 'bottomlist') ?
                        <View style={[styles.borderBottom]}>
                            <Appbar.Header style={[styles.bg_white,styles.noshadow,styles.borderBottom,styles.justifyContent,]}>

                                 <View><TouchableOpacity onPress={()=>{closePage(pageKey)}} style={[styles.p_5]}><Paragraph><ProIcon name={'xmark'}/></Paragraph></TouchableOpacity></View>

                                <View style={[styles.w_auto]}>
                                     <Paragraph style={[styles.paragraph,styles.bold,{textAlign:'center'}]}>{label}</Paragraph>
                                </View>
                                <View  style={{width:60}}>{Boolean(addItem) &&  <View>{addItem}</View>}</View>

                                {/* {Boolean(onAdd) && <View style={[{paddingRight: 5}]}>
                                    <Button compact={true} secondbutton={!Boolean(this.searchText)} disabled={!Boolean(this.searchText)} onPress={() => {
                                        this._onAdd()
                                    }}> {'Add'}  </Button>
                                </View>}*/}

                            </Appbar.Header>

                        <View>
                            <View>
                                <Search autoFocus={false} label={label} placeholder={`Search...`}  handleSearch={this.handleSearch}/>
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
                            return  <View style={{height:150}}>

                            </View>
                        }}
                        ListEmptyComponent={<View>
                            <View  style={[styles.p_6]}>
                                <Text style={[styles.paragraph,styles.mb_2, styles.muted, {textAlign: 'center'}]}> No result found</Text>
                            </View>
                        </View>}
                        initialNumToRender={20}
                    />
                </View>


                <View style={[{marginTop: 'auto',backgroundColor:'white'},styles.p_6]}>
                    <View>

                        {/*<View>
                            <Button more={{backgroundColor: styles.light.color, color: 'black'}}
                                    onPress={() => {
                                         closePage(pageKey)
                                    }}> Cancel
                            </Button>
                        </View>*/}

                        {multiselect && <View><Button onPress={() => {
                            this.confirm()
                        }}> Confirm </Button></View>}
                    </View>
                </View>


            </View>
        );
    }
}


const mapStateToProps = (state: any) => ({
    modal: state.component.modal
})
const mapDispatchToProps = (dispatch: any) => ({
    setBottomSheet: (dialog: any) => dispatch(setBottomSheet(dialog)),
    setModal: (dialog: any) => dispatch(setModal(dialog)),
    openPage: (dialog: any) => dispatch(openPage(dialog)),
    closePage: (dialog: any) => dispatch(closePage(dialog)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ListView));




