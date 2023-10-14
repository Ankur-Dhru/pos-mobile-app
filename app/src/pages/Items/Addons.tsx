import React, {memo, useEffect, useState} from "react";
import {Caption, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {appLog, clone, findObject, isEmpty, prelog, setItemRowData, toCurrency} from "../../libs/function";
import {ProIcon} from "../../components";
import {localredux} from "../../libs/static";
import {v4 as uuid} from "uuid";


let validate = true;

const Index = ({addtags, itemaddon,updateProduct,setValidate}: any) => {


    const {addonsData,initData:{addongroups}} = localredux;


    let {addongroupid, addonid,autoaddon} = addtags || {addongroupid: [], addonid: [],autoaddon:[]}


    const [moreaddon, setMoreAddon]: any = useState(clone(addonsData));
    const [addons,setAddons] = useState(addtags);


    useEffect(() => {

        if(isEmpty(addtags.addongroupiddata)){
            addtags = {
                ...addtags,
                addongroupiddata:{
                    '0000':{
                        ...addtags.addoniddata,
                        selecteditems:addtags.addonid.map((item:any)=>{
                            return {"itemid": item}
                        }),
                    }
                }
            }
            setAddons(addtags)
        }

        addongroupid?.map((ag: any) => {
            const findaddons = Object.values(moreaddon)?.filter((addon: any) => {
                return ag === addon.itemgroupid
            }).map((item: any) => {
                return item.itemid
            })

            if (Boolean(findaddons.length)) {
                addonid = addonid.concat(findaddons)
            }
        })

        addonid.map((addon: any, key: any) => {
            const find = findObject(itemaddon, 'itemid', addon, true);
            if (Boolean(find)) {
                moreaddon[addon] = {
                    ...moreaddon[addon],
                    ...find,
                }
            }
        })

        setMoreAddon(clone(moreaddon));

        setTimeout(()=>{

            if(!isEmpty(autoaddon)) {
                autoaddon?.map((addon: any) => {
                    if (!Boolean(moreaddon[addon].productqnt)) {
                        updateQnt(addon, 'autoadd')
                    }
                })
            }
            else {
                Object.keys(addtags?.addongroupiddata).map((key: any) => {
                    const adddongroup = addtags?.addongroupiddata[key];
                    adddongroup?.autoadditems?.map((addon: any) => {
                        if (!Boolean(moreaddon[addon].productqnt)) {
                            updateQnt(addon, 'autoadd',key)
                        }
                    })
                })
            }

        })

        let totalmin = addtags?.addoniddata?.minrequired || 0;
        Object.values(addtags?.addongroupiddata).map((addon:any)=>{
            totalmin += addon?.minrequired;
        });
        setValidate(!Boolean(totalmin))

    }, [])


    const updateQnt = (key: any, action: any,addonid?:any) => {

        let productqnt = moreaddon[key].productqnt || 0;

        const {unit}: any = localredux.initData;


        if (action === 'autoadd') {
            productqnt =   1
        }else if (action === 'add') {
            productqnt = productqnt + 1
        } else if (action === 'remove') {
            productqnt = productqnt - 1
        }

        let unittype = unit[moreaddon[key]?.itemunit]
        let uuidn = uuid();

        moreaddon[key] = {
            ...moreaddon[key],
            displayunitcode:unittype?.unitcode || '',
            productqnt: productqnt,
            key: uuidn,
            ref_id:uuidn,
        }


        //////// CHANGE ADDON PRICE IF CHANGED //////////
        if(Boolean(addonid)) {
            const find = addons?.addongroupiddata[addonid]?.selecteditems?.filter((item: any) => {
                return item.itemid === key
            })
            if (Boolean(find[0]?.productrate)) {
                moreaddon[key].pricing.price.default[0]['onetime'].baseprice = find[0]?.productrate;
            }
        }
        //////// CHANGE ADDON PRICE IF CHANGED //////////



        const selectedAddons = Object.values(moreaddon).filter((addon: any) => {
            return addon.productqnt > 0
        })

        itemaddon = selectedAddons;
        setMoreAddon(clone(moreaddon));
        updateProduct({itemaddon:selectedAddons});


        //////// VALIDATE ADD BUTTON //////////
            let totalmin = addtags?.addoniddata?.minrequired || 0;

            let allval = 0
            Object.keys(addtags?.addongroupiddata).map((key:any)=>{

                let addon = addtags?.addongroupiddata[key]
                let totalgroupselected = selectedAddons?.filter((s:any)=>{
                    return s.itemgroupid == key && Boolean(addon.minrequired)
                })

                if(totalgroupselected.length >= addon.minrequired){
                    allval += totalgroupselected.length
                }

                totalmin += addon.minrequired;
           });


           if(allval >= totalmin){
               setValidate(true)
           }
           else{
               setValidate(false)
           }
       //////// VALIDATE ADD BUTTON //////////

    }


    return (<View style={[styles.p_5]}>

            {
               Boolean(addons) && Boolean(addons?.addongroupiddata) &&  Object.keys(addons?.addongroupiddata).map((addonid:any)=>{


                    const {addonselectiontype,anynumber,minrequired,selecteditems} = addons.addongroupiddata[addonid];

                    if(isEmpty(selecteditems)){
                        return <></>
                    }


                    return <View key={addonid}>

                        <Caption style={[styles.caption,styles.mt_5]}>Addon {addongroups[addonid]?.addongroupname} (Any{addonselectiontype === 'selectanyone' && ` ${anynumber}`}{Boolean(minrequired) && `, Required ${minrequired}`})  </Caption>

                        {

                            selecteditems?.map((item: any, key: any) => {

                                let {itemname, pricing, productqnt} = moreaddon[item.itemid];

                                const pricingtype = pricing?.type;

                                const baseprice = item.productrate || pricing?.price?.default[0][pricingtype]?.baseprice || 0;

                                return (
                                    <TouchableOpacity
                                        style={[styles.grid, styles.justifyContent, styles.w_100, styles.mb_3, styles.p_3,  productqnt > 0 && styles.bg_light_blue, {borderRadius: 5,paddingLeft:5}]}
                                        key={key} onPress={()=>{

                                        const addeditems = moreaddon && Object.values(moreaddon).filter((addon:any)=>{

                                             const find = Object.values(selecteditems).filter((item:any)=>{
                                                return item.itemid === addon.itemid && Boolean(addon?.productqnt)
                                            })
                                            return Boolean(find?.length);
                                        }).length + 1;


                                        if((anynumber >= addeditems && addonselectiontype === 'selectanyone') || addonselectiontype === 'selectany') {
                                            item.selected = Boolean(productqnt)
                                            updateQnt(item.itemid, 'add',addonid)
                                        }
                                    }}>

                                        <View style={[styles.grid, styles.justifyContent]}>
                                            <View style={[styles.w_auto]}>
                                                <View><Text>{`${itemname}`}</Text></View>
                                                <View>
                                                    <Text>{toCurrency(baseprice * (productqnt || 1))}</Text>
                                                </View>
                                            </View>
                                            {productqnt > 0 &&  <View>
                                                <View style={[styles.grid, styles.middle, {
                                                    borderRadius: 5,
                                                    backgroundColor: styles.white.color,
                                                    width: 130
                                                }]}>
                                                    {<TouchableOpacity style={[styles.p_2]} onPress={() => {
                                                        productqnt > 0 && updateQnt(item.itemid, 'remove',addonid)
                                                    }}>
                                                        <ProIcon name={'minus'} size={20}/>
                                                    </TouchableOpacity>}
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter]}>{
                                                        parseInt(productqnt || 0)
                                                    }</Paragraph>
                                                    {<TouchableOpacity style={[styles.p_2]} onPress={() => {
                                                        updateQnt(item.itemid, 'add',addonid)
                                                    }}>
                                                        <ProIcon name={'plus'} size={20}/>
                                                    </TouchableOpacity>}
                                                </View>
                                            </View>}
                                        </View>



                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>

                })
            }

        </View>
    )
}



const mapStateToProps = (state: any) => ({
    addtags: state.itemDetail.addtags,
    itemaddon: state.itemDetail.itemaddon,
})

export default connect(mapStateToProps)(withTheme(Index));

//({toCurrency(baseprice * productQnt)})
