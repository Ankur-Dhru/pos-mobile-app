import React, {useEffect, useState} from "react";
import {Caption, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {clone, findObject, toCurrency} from "../../libs/function";
import {ProIcon} from "../../components";
import {localredux} from "../../libs/static";


const Index = ({product,  setproductAddons, edit}: any) => {

    const {addonsData} = localredux;

    const {itemdetail: {addtags}, itemaddon} = product;

    let {addongroupid, addonid} = addtags || {addongroupid: [], addonid: []}

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
        if (edit) {
            addonid.map((addon: any, key: any) => {
                const find = findObject(itemaddon, 'itemid', addon, true);
                if (Boolean(find)) {
                    moreaddon[addon] = {
                        ...moreaddon[addon],
                        ...find
                    }
                }
            })
            setMoreAddon(clone(moreaddon));
        }
    }, [product])


    const updateQnt = (key: any, action: any) => {
        let productqnt = moreaddon[key].productqnt || 0;

        if (action === 'add') {
            productqnt = productqnt + 1
        } else if (action === 'remove') {
            productqnt = productqnt - 1
        }

        moreaddon[key] = {
            ...moreaddon[key],
            productqnt: productqnt
        }

        const selectedAddons = Object.values(moreaddon).filter((addon: any) => {
            return addon.productqnt > 0
        })

        setMoreAddon(clone(moreaddon));
        setproductAddons(selectedAddons);
    }

    return (<View style={[styles.mt_5]}>
            <Caption style={[styles.ml_2]}>Addons</Caption>
            {Boolean(addonid?.length) && <>
                {
                    addonid.map((addon: any, key: any) => {

                        let {itemname, pricing, productqnt} = moreaddon[addon];
                        const pricingtype = pricing?.type;
                        const baseprice = pricing?.price?.default[0][pricingtype]?.baseprice || 0;

                        return (
                            <View
                                style={[styles.grid, styles.justifyContent, styles.w_100, styles.mb_3, styles.p_3, styles.px_5, productqnt > 0 && styles.bg_light_blue, {borderRadius: 5}]}
                                key={key}>

                                <View style={[styles.grid, styles.justifyContent]}>
                                    <View style={{width: 150}}><Text>{`${itemname}`}</Text></View>
                                    <View>
                                        <View style={[styles.grid, styles.middle, {
                                            borderRadius: 5,
                                            backgroundColor: styles.bg_light.backgroundColor,
                                            width: 90
                                        }]}>
                                            {<TouchableOpacity style={[styles.py_2]} onPress={() => {
                                                productqnt > 0 && updateQnt(addon, 'remove')
                                            }}>
                                                <ProIcon name={'minus'} size={15}/>
                                            </TouchableOpacity>}
                                            <Paragraph
                                                style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter]}>{
                                                parseInt(productqnt || 0)
                                            }</Paragraph>
                                            {<TouchableOpacity style={[styles.py_2]} onPress={() => {
                                                updateQnt(addon, 'add')
                                            }}>
                                                <ProIcon name={'plus'} size={15}/>
                                            </TouchableOpacity>}
                                        </View>
                                    </View>
                                </View>


                                <View>
                                    <Text style={[styles.bold]}>{toCurrency(baseprice * (productqnt || 1))}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </>}
        </View>
    )
}



export default withTheme(Index);

//({toCurrency(baseprice * productQnt)})
