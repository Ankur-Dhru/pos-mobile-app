import React, {useEffect, useState} from "react";
import {ScrollView, TouchableOpacity, View,} from "react-native";
import {Caption, Paragraph} from "react-native-paper";
import {styles} from "../../theme";

import {connect, useDispatch} from "react-redux";
import {localredux} from "../../libs/static";
import {ProIcon} from "../../components";
import {appLog, clone, saveLocalSettings} from "../../libs/function";
import {setSelected} from "../../redux-store/reducer/selected-data";
import {getItemsByWhere} from "../../libs/Sqlite/selectData";

const Index = (props: any) => {

    const {itemgroup} = localredux.initData
    const {selectedgroup,grouplist,gridView,setGridView} = props;
    const [subgroup, setSubGroup]: any = useState([]);
    const dispatch = useDispatch()


    useEffect(() => {
        const lastgroup = selectedgroup[selectedgroup.length - 1];
        let groups: any = Object.values(grouplist).filter((group:any)=>{
            return group.itemgroupmid === lastgroup
        })
        setSubGroup(groups)
    }, [selectedgroup])


    const  setCurrentGroup = (groupid:any) => {
        const index = selectedgroup.findIndex(function(key:any) {
            return key == groupid
        });
        dispatch(setSelected({value: selectedgroup.slice(0, index + 1), field: 'group'}))
    }

    if(!Boolean(selectedgroup)){
        return <></>
    }


    return <View><View style={[styles.bg_light,styles.p_4,styles.mb_2,{borderRadius:5}]}>
        <ScrollView>
            <View style={[styles.grid,styles.middle]}>
                {
                   selectedgroup?.map((gid:any)=>{
                        return <>
                            <TouchableOpacity onPress={()=>{
                                setCurrentGroup(gid)
                            }} style={[styles.caption]}><Paragraph>{itemgroup[gid]?.itemgroupname}</Paragraph></TouchableOpacity>
                            <View><ProIcon name={'chevron-right'} size={10}/></View>
                        </>
                    })
                }
            </View>
        </ScrollView>
    </View>
    <View style={[styles.grid,styles.mb_2]}>
            {
                subgroup?.map((group:any)=>{
                    return (
                        <>
                            <TouchableOpacity onPress={()=>{

                                let groups = clone(selectedgroup)

                                const find = groups.filter((key:any)=>{
                                    return key === group.itemgroupid
                                });

                                if(!Boolean(find.length)){
                                    groups.push(group.itemgroupid)
                                }

                                dispatch(setSelected({value: groups, field: 'group'}))

                            }} style={[styles.flexGrow,styles.center,  styles.middle, {
                                width: 80,
                                maxWidth:'100%',
                                borderColor:'white',
                                margin:2,
                                marginBottom:2,
                                minHeight:50,
                                paddingBottom:3,
                                borderRadius:5,
                                backgroundColor:group?.itemgroupcolor || 'black'
                            }]}>
                                <View>
                                    <Paragraph style={[styles.paragraph,{color:'white'}]}>{group.itemgroupname}</Paragraph>
                                </View>
                            </TouchableOpacity>
                        </>
                    )
                })
            }
        </View>
    </View>
}

const mapStateToProps = (state: any) => ({
    selectedgroup: state.selectedData.group?.value,
    grouplist: state.groupList
})

export default connect(mapStateToProps)(Index);
