import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";

import {ProIcon} from "../../components";
import {ActivityIndicator, Paragraph} from "react-native-paper";
import {appLog} from "../../libs/function";


class ThumbView extends Component<any> {

    params: any;
    loader: any;

    constructor(props: any) {
        super(props);
        this.loader = React.createRef()
    }


    render() {

        const {source, extentation,imagepath}: any = this.props;

        appLog('source',source)

        return (
            <View style={{width:50}}><Image
                style={[styles.imageWidth,{borderRadius:5}]}
                source={{uri:source.path}}
            /></View>
        )


        return (

            <View style={[styles.border, styles.center, styles.middle, {height: 100, width: 100}]}>
                {extentation === 'pdf' && <ProIcon name={'file-pdf'} size={25}/>}
                {extentation === 'zip' && <ProIcon name={'file-archive'} size={25}/>}
                {extentation === 'xlsx' && <ProIcon name={'file-excel'} size={25}/>}
                {extentation === 'docx' && <ProIcon name={'file-word'} size={25}/>}
                {(extentation === 'jpg' || extentation === 'jpeg' || extentation === 'png') && <>
                    {Boolean(source.uri) ? <Image style={[styles.imageWidth]} source={{uri: source.uri}}/> : <View>
                        <ActivityIndicator />
                        <Paragraph>helo</Paragraph>
                    </View>}
                </>}

            </View>

        )
    }

}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(ThumbView);


