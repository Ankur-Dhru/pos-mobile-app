import React, {memo, useEffect, useState} from "react";
import {Caption, Paragraph, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {appLog, clone, findObject, setItemRowData, toCurrency} from "../../libs/function";
import {ProIcon} from "../../components";
import {localredux} from "../../libs/static";


const Index = ({productqnt,updateProduct,theme:{colors}}: any) => {

    const [qnt, setQnt]: any = useState(productqnt || 1)

    const updateQnt = (action: any) => {
        let pq = qnt;
        if (action === 'add') {
            pq = pq + 1;
            setQnt(pq)
        } else if (action === 'remove') {
            pq = pq - 1;
            setQnt(pq)
        }
        updateProduct({productqnt: pq});
    }

    return (<View style={{width: 160}}>
            <>
                <View style={[styles.grid, styles.middle, {
                    borderRadius: 5,
                    backgroundColor: styles.accent.color
                }]}>
                    {<TouchableOpacity style={[styles.p_4]} onPress={() => {
                        qnt > 1 && updateQnt('remove')
                    }}>
                        <ProIcon name={'minus'} color={colors.secondary} size={20}/>
                    </TouchableOpacity>}
                    <Paragraph
                        style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, {color: colors.secondary}]}>{parseInt(qnt)}</Paragraph>
                    {<TouchableOpacity style={[styles.p_4]} onPress={() => {
                        updateQnt('add')
                    }}>
                        <ProIcon name={'plus'} color={colors.secondary} size={20}/>
                    </TouchableOpacity>}
                </View></>
        </View>
    )
}



const mapStateToProps = (state: any) => ({
    productqnt: state.itemDetail.productqnt,
})

export default connect(mapStateToProps)(withTheme(Index));
