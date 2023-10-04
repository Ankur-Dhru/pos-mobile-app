import React, {memo, useEffect, useState} from "react";
import {Caption, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {appLog, clone, findObject, setItemRowData, toCurrency} from "../../libs/function";
import {ProIcon} from "../../components";
import {localredux} from "../../libs/static";
import {v4 as uuid} from "uuid";


const Index = ({addtags, itemaddon,updateProduct}: any) => {


    const {addonsData} = localredux;

    let {addongroupid, addonid,autoaddon} = addtags || {addongroupid: [], addonid: [],autoaddon:[]}

    const [moreaddon, setMoreAddon]: any = useState(clone(addonsData))

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

    useEffect(() => {

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
            autoaddon?.map((addon:any)=>{
                if(!Boolean(moreaddon[addon].productqnt)){
                    updateQnt(addon, 'autoadd')
                }
            })
        })

    }, [])


    const updateQnt = (key: any, action: any) => {

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
            ref_id:uuidn
        }

        const selectedAddons = Object.values(moreaddon).filter((addon: any) => {
            return addon.productqnt > 0
        })

        itemaddon = selectedAddons;

        setMoreAddon(clone(moreaddon));
        updateProduct({itemaddon:selectedAddons})
    }

    return (<View>

            {Boolean(addonid?.length) && <View>

                <Caption style={[styles.caption,styles.mt_5]}>Addons</Caption>

                {
                    addonid.map((addon: any, key: any) => {

                        let {itemname, pricing, productqnt} = moreaddon[addon];

                        console.log('productqnt',productqnt)


                        const pricingtype = pricing?.type;

                        const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;

                        return (
                            <TouchableOpacity
                                style={[styles.grid, styles.justifyContent, styles.w_100, styles.mb_3, styles.p_3,  productqnt > 0 && styles.bg_light_blue, {borderRadius: 5,paddingLeft:10}]}
                                key={key} onPress={()=>{
                                updateQnt(addon, 'add')
                            }}>

                                <View style={[styles.grid, styles.justifyContent]}>
                                    <View style={[styles.w_auto]}>
                                        <View><Text>{`${itemname}`}</Text></View>
                                        <View>
                                            <Text>{toCurrency(baseprice * (productqnt || 1))}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={[styles.grid, styles.middle, {
                                            borderRadius: 5,
                                            backgroundColor: styles.white.color,
                                            width: 130
                                        }]}>
                                            {<TouchableOpacity style={[styles.p_2]} onPress={() => {
                                                productqnt > 0 && updateQnt(addon, 'remove')
                                            }}>
                                                <ProIcon name={'minus'} size={20}/>
                                            </TouchableOpacity>}
                                            <Paragraph
                                                style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter]}>{
                                                parseInt(productqnt || 0)
                                            }</Paragraph>
                                            {<TouchableOpacity style={[styles.p_2]} onPress={() => {
                                                updateQnt(addon, 'add')
                                            }}>
                                                <ProIcon name={'plus'} size={20}/>
                                            </TouchableOpacity>}
                                        </View>
                                    </View>
                                </View>



                            </TouchableOpacity>
                        )
                    })
                }
            </View>}
        </View>
    )
}



const mapStateToProps = (state: any) => ({
    addtags: state.itemDetail.addtags,
    itemaddon: state.itemDetail.itemaddon,
})

export default connect(mapStateToProps)(withTheme(Index));

//({toCurrency(baseprice * productQnt)})
