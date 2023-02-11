import * as React from 'react';
import {Divider, Paragraph, Text, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {Platform, TextInput as TextInputReact, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";


import List from "./List";
import {setBottomSheet, setDialog} from "../../redux-store/reducer/component";
import {connect} from "react-redux";
import {InputBox, ProIcon} from "../index";
import DateTimePicker from './DateTimePicker';
import moment from "moment";
import {chevronRight, findObject, getType, isEmpty} from "../../libs/function";

//import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import ToggleSwitch from "./Switch";
import {device, ItemDivider, localredux} from "../../libs/static";
import {format} from "util";


class Index extends React.Component<any, any> {


    constructor(props: any) {

        super(props);

        let findSelected;
        if (props.selectedValue) {
            const list = props.list;
            let find = findObject(list, 'value', props.selectedValue, true);
            findSelected = Boolean(find) && find && find?.label
        }

        this.state = {
            selectedValue: props.selectedValue,
            selectedLabel: findSelected ? findSelected : props.selectedLabel,
            showDatePicker: false
        }

    }

    _getDays = () => {

        const {
            showDays,
            showTodayTomorrow,
            message,
            fromJob
        }: any = this.props;
        let {selectedValue}: any = this.state
        let display: any = ""
        let days = moment(selectedValue)
            .startOf("days")
            .diff(moment(fromJob).startOf("days"), 'days');
        if (Boolean(showDays) && ((showTodayTomorrow && days > -1) || (!showTodayTomorrow && days > 0))) {
            display = `(${days} ${days > 1 ? "Days" : "Day"})`;
            if (showTodayTomorrow && !fromJob) {
                if (days === 0) {
                    display = `( Today )`;
                } else if (days === 1) {
                    display = `( Tomorrow )`;
                }
            }
        }
        if (message) {
            display += ` ${message}`
        }
        return display
    }

    onSelect = (value: any) => {

        if (Boolean(value)) {
            this.props.onChange(value?.value, value);
            this.setState({selectedLabel: value.label, selectedValue: value.value, showDatePicker: false})
        }
    }

    _onRead = (data: any) => {
        const {navigation, onChange} = this.props;
        onChange(data);
        navigation.goBack();
    }


    render() {
        let {
            label,
            list,
            listtype,
            showlabel = true,
            search = false,
            appbar = true,
            dueterm = true,
            divider = true,
            inputtype,
            hideLabel,
            preview = true,
            icon = false,
            fullView = false,
            displaytype,
            editmode = true,
            setBottomSheet,

            render,
            onChange,
            singleImage,
            value,
            multiselect,
            meta,
            input,
            addItem,
            gridview,
            gridviewicon,
            lines,
            defaultValue,
            settings,
            multiline,
            mode = 'date',
            minimumDate,
            description,
            placeholder,
            disabledCloseModal,
            showDays,
            moreStyle,
            doNotReplaceProtocol,
            removeSpace,
            message,
            validateWithError,
            descriptionStyle,
            customRef,
            modal,

        }: any = this.props;

        if (isEmpty(descriptionStyle)) {
            descriptionStyle = []
        }


        const dateformat: any = localredux?.initData?.general?.date_format.toUpperCase();


        const {colors} = this.props.theme;
        let {selectedValue, selectedLabel, showDatePicker}: any = this.state

        let Render: any = render;

        const isRequired = Boolean(meta?.error);
        const labelstyle = [styles.inputLabel, {
            color: isRequired ? colors.inputLabel : colors.inputLabel,
            fontSize: (inputtype === 'dropdown' || inputtype === 'datepicker') ? 12 : 16
        }]


        let listComponent = (props: any) => {

            return <List
                label={label}
                list={list}
                appbar={appbar}
                search={search}
                listtype={listtype}
                selected={selectedValue}
                displaytype={displaytype}
                multiselect={multiselect}
                gridview={gridview}
                gridviewicon={gridviewicon}
                addItem={addItem}
                disabledCloseModal={disabledCloseModal}
                {...input}
                {...props}
                {...this.props}
                onSelect={this.onSelect}
            >
            </List>
        }


        let style: any = [];
        if (inputtype !== 'daterange' && !Boolean(removeSpace)) {
            style = [...style, styles.fieldspace]
        }
        if (!isEmpty(moreStyle)) {
            style = [...style, ...moreStyle]
        }

        const {navigation} = device;


        return (
            <View style={style}>

                {
                    inputtype === "bottommenu" && <View>

                        <><TouchableOpacity
                            onPress={() => {
                                setBottomSheet({
                                    visible: true,
                                    fullView: fullView,
                                    component: listComponent
                                })
                            }}>
                            {Boolean(render) ?
                                <Render/> :
                                <View style={[styles.filterBox, {backgroundColor: colors.filterbox}]}>
                                    <Text style={[styles.text_xxs, {color: colors.secondary}]}>{label}</Text>
                                    <View style={[styles.grid, styles.middle, styles.noWrap, styles.justifyContent]}>
                                        <Text
                                            style={[colors.inputLabel, {color: colors.secondary}]}>{selectedLabel || 'Any'} </Text>
                                        {editmode &&
                                            <ProIcon name={'chevron-down'} color={colors.secondary} action_type={'text'}
                                                     size={10}/>}
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                        </>
                    </View>
                }

                {inputtype === 'dropdown' &&
                    <View>
                        <><TouchableWithoutFeedback
                            ref={customRef}
                            onPress={() => {

                                let config = {
                                    selected: selectedValue,
                                    list,
                                    multiselect,
                                    listtype,
                                    onSelect: this.onSelect,
                                    label,
                                    addItem,
                                    gridview,
                                    gridviewicon,
                                    displaytype,
                                }
                                if(Boolean(modal)){
                                    config = {
                                        ...config,
                                        presentation:'modal'
                                    }
                                }
                                navigation.push('DropDownList', config)

                            }}><View>
                            {Boolean(render) ?
                                <Render/> : <View style={[styles.border,styles.px_5,styles.py_4,styles.grid,styles.justifyContent,{borderRadius:5,paddingBottom: 10}]}>
                                    <View>
                                        <Paragraph style={[styles.paragraph,labelstyle,!Boolean(selectedLabel) && {fontSize:15,paddingVertical:7}]}>{label}</Paragraph>
                                        {selectedLabel && <View style={[styles.grid,styles.middle, styles.justifyContent, styles.noWrap,]}>
                                            {!multiselect && <Text>{selectedLabel}</Text>}
                                            {(multiselect && getType(selectedValue) === 'array') &&
                                                <Text>{selectedValue?.join(", ")}</Text>}
                                        </View>}
                                    </View>
                                    <View>
                                        {editmode ? <ProIcon name={'chevron-right'} align={'right'}  size={15}/> : <Paragraph style={[{height: 26}]}>{}</Paragraph>}
                                    </View>
                                    {/*{divider &&
                                        <ItemDivider/>}*/}
                                </View>
                            }</View>
                        </TouchableWithoutFeedback>
                        </>
                    </View>
                }

                {inputtype === 'textbox' &&
                    <View>
                        <InputBox
                            defaultValue={defaultValue}
                            label={label}
                            customRef={customRef}
                            labelstyle={labelstyle}
                            editmode={editmode}
                            onChange={(value: any) => {
                                onChange(value)
                            }}
                            {...input}
                            {...this.props}
                        />
                    </View>
                }

                {inputtype === 'scan' &&
                    <View style={[styles.tagContainer]}>
                        <View style={[styles.tagInputContainer]}>
                            {multiline ? <View>
                                    <Text style={labelstyle}>{label}</Text>
                                    <TextInputReact
                                        onChangeText={(value: any) => {
                                            onChange(value)
                                        }}
                                        defaultValue={defaultValue}
                                        placeholder={label}
                                        style={[styles.input, styles.mb_5, {
                                            backgroundColor: colors.backgroundColor,
                                            fontSize: 16,
                                            color: colors.inputbox
                                        }]}
                                        {...this.props}
                                    />
                                    <ItemDivider/>
                                </View> :

                                <InputBox
                                    defaultValue={defaultValue}
                                    label={label}
                                    labelstyle={labelstyle}
                                    editmode={editmode}
                                    onChange={(value: any) => {
                                        onChange(value)
                                    }}
                                    {...input}
                                    {...this.props}
                                />}
                        </View>

                        {/*<View style={[styles.tagButton]}>
                            <Title onPress={() => {
                                if (navigation) {
                                    if (Platform.OS === "ios") {
                                        requestMultiple([
                                            PERMISSIONS.IOS.CAMERA,
                                        ]).then(statuses => {
                                            if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted') {
                                                navigation.navigate('Scanner', {
                                                    onRead: this._onRead,
                                                    multiline: multiline
                                                });
                                            }
                                        });
                                    } else {
                                        navigation.navigate('Scanner', {onRead: this._onRead, multiline: multiline});
                                    }
                                }
                            }}>
                                <Paragraph><ProIcon name={'barcode-read'} size={22}/></Paragraph>
                            </Title>
                        </View>*/}

                    </View>
                }


                {inputtype === 'textarea' &&
                    <View>
                        <Text style={labelstyle}>{label}</Text>
                        <TextInputReact
                            onChangeText={(value: any) => {
                                onChange(value)
                            }}
                            editable={editmode}
                            defaultValue={defaultValue}
                            placeholder={label}
                            multiline={true}
                            placeholderTextColor={colors.inputLabel}
                            style={[styles.input, styles.mb_5, {
                                backgroundColor: colors.backgroundColor,
                                fontSize: 16,
                                color: colors.inputbox
                            }]}
                            {...this.props}
                        />
                        {/*<ItemDivider/>*/}
                    </View>
                }


                {inputtype === 'switch' && <>
                    <Text style={labelstyle}>{label}</Text>
                    <ToggleSwitch value={value} onChange={onChange}/>
                </>
                }


                {inputtype === 'datepicker' &&
                    <View>
                        <TouchableOpacity
                            onPress={() => editmode && (Platform.OS === "ios" ?

                                navigation.navigate('DateTimePicker', {
                                    defaultValue:moment(selectedValue).format('YYYY-MM-DD'),
                                    label:label,
                                    dueterm:dueterm,
                                    mode:mode,
                                    onSelect: this.onSelect,
                                })
                                  : this.setState({showDatePicker: true}))}>
                            {Boolean(render) ?
                                <Render/> : <View style={[styles.border,styles.px_5,styles.py_4,styles.grid,styles.justifyContent,{borderRadius:5,}]}>

                                    <View>
                                        <Paragraph style={[styles.paragraph,labelstyle]}>{label}</Paragraph>
                                        <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                            <Text>{moment(selectedValue).format(mode === "time" ? "HH:mm:ss" : dateformat)} {this._getDays()} </Text>
                                        </View>
                                    </View>
                                    <View>
                                        {editmode ? <ProIcon name={'chevron-down'} align={'right'}  size={15}/> : <Paragraph style={[{height: 26}]}>{}</Paragraph>}
                                    </View>

                                    {/*{divider && <ItemDivider/>}*/}

                                </View>
                            }
                        </TouchableOpacity>


                        {showDatePicker && <DateTimePicker
                            label={label}
                            dueterm={dueterm}
                            defaultValue={moment(selectedValue).format('YYYY-MM-DD')}
                            mode={mode}
                            minimumDate={minimumDate}
                            onSelect={this.onSelect}
                        />}


                    </View>
                }


                {Boolean(description) &&
                    <Text style={[styles.paragraph, styles.mt_1, styles.text_xs]}><Text
                        style={[...descriptionStyle]}>{description} </Text></Text>}
                {meta?.error && meta?.touched &&
                    <Text style={[styles.paragraph, {position: 'absolute', bottom: -5}]}><Text
                        style={[styles.errorText]}>{!Boolean(validateWithError) ? `${label} ` : ""}{meta?.error} </Text></Text>}


            </View>
        );
    }
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setBottomSheet: (dialog: any) => dispatch(setBottomSheet(dialog)),

});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));
