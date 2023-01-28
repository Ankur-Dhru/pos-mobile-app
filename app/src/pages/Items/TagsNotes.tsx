import React, {useEffect, useState} from "react";
import {Caption, Chip, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect, useDispatch} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import InputBox from "../../components/InputBox";
import {appLog, clone, findObject} from "../../libs/function";
import {localredux} from "../../libs/static";




const Index = ({tags,notes,itemtags,updateProduct}: any) => {

    const {tags:inittags}:any = localredux.initData

    const [selectedTag,setSelectedTag] = useState(0);
    let [temptags,setTempTags]:any = useState(clone(itemtags));


    useEffect(()=>{

        if(Boolean(inittags) && !Boolean(itemtags)) {
            const filtertags: any = Object.values(inittags).filter((inittag: any) => {
                return tags?.includes(inittag.taggroupid)
            })
            setTempTags(clone(filtertags));
        }
    },[])


    useEffect(()=>{
        updateProduct({itemtags:temptags})
    },[temptags])



    return (

        <>
            {Boolean(temptags?.length) && <View style={[styles.mt_5]}>
                <Caption  style={[styles.ml_2]}>Tags</Caption>

                <View style={[styles.grid,styles.borderBottom]}>
                {
                    temptags.map((tag: any, key: any) => {
                        const {taggroupname} = tag;
                        const selected = (selectedTag === key);
                        {
                            return (
                                <TouchableOpacity  key={key} style={[styles.p_5]}  onPress={() =>  setSelectedTag(key) }><Text style={[!selected?styles.muted:styles.primary,styles.bold]}>{taggroupname}</Text></TouchableOpacity>
                            )
                        }
                    })
                }
                </View>

                {
                    temptags?.map((tags: any, tagid: any) => {
                        {
                            return (
                                <View key={tagid} style={[styles.ml_1]}>
                                    {<View style={[styles.grid,{display:(selectedTag === tagid)?'flex':'none'}]}>
                                        {
                                           tags?.taglist.map((tag: any, key: any) => {
                                                return (<Chip key={key} style={[tag.selected?styles.bg_light_blue:styles.light.color,styles.m_2,styles.p_3]}     icon={tag.selected?'check':'stop'} onPress={() => {
                                                    tag.selected = !Boolean(tag?.selected)
                                                    setTempTags(clone(temptags))
                                                }}><Paragraph style={[styles.p_5]}>{tag.name+''}</Paragraph></Chip>)
                                            })
                                        }
                                    </View>}
                                </View>
                            )
                        }
                    })
                }

            </View>}


            <View style={[styles.mt_5,styles.px_5]}>
                <InputBox
                    value={notes}
                    label={'Notes'}
                    autoFocus={false}
                    onChange={(value:any) => {
                        updateProduct({notes:value})
                    }}
                />
            </View>


        </>

    )
}




const mapStateToProps = (state: any) => ({
    tags : state.itemDetail.tags,
    notes: state.itemDetail.notes,
    itemtags: state.itemDetail.itemtags,
})

export default connect(mapStateToProps)(withTheme(Index));
