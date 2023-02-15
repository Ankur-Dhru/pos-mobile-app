import React, {Component} from 'react';
import {Alert, Image, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";
import {Paragraph, withTheme} from "react-native-paper";


import DocumentPicker from 'react-native-document-picker'
import {appLog, getItemImage, saveImage, uploadFile} from "../../libs/function";
import {capture} from "../../libs/static";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import {v4 as uuidv4} from 'uuid';

import {ProIcon} from "../../components";
import ActionSheet from '../../components/ActionSheet';
import ImagePicker from "react-native-image-crop-picker";
import ThumbView from "./ThumbView";

import Confirm from "react-native-actionsheet";
import Avatar from "../../components/Avatar";
import ImageResizer from 'react-native-image-resizer';


class Attachment extends Component<any> {

    camera: any;
    ActionSheet2: any;

    attachmentindex: any

    constructor(props: any) {
        super(props);
        this.state = {
            multipleFile: [],
            imagepath:  getItemImage(props.item)
        };
        this.ActionSheet2 = React.createRef()
    }


    componentDidMount() {

    }


    handleCapture = (data: any) => {
        this.setState({imagepath:data.path})
        let filename = data.path.split('/').pop()

        uploadFile({uri: data.path, name: filename, type: data.mime}, function (response: any) {
            capture.photo = response.download_url.replace('http://', '').replace('https://', '');
            saveImage(capture.photo,false).then(()=>{})
        });

        /*ImageResizer.createResizedImage(data.path, 250, 150, 'JPEG', 100, 0)
            .then(response => {

            })
            .catch(err => {
                appLog('err',err)
            });*/
    }

    pickSingleWithCamera(cropping: any, mediaType: any = 'photo') {
        ImagePicker.openCamera({
            width:250,
            height:150,
            cropping: cropping,
            freeStyleCropEnabled: true,
            cropperStatusBarColor:styles.primary.color,
            cropperActiveWidgetColor:styles.primary.color,
            includeExif: true,
            forceJpg: true,
            mediaType,
        })
            .then((image) => {
                this.handleCapture(image)
            })
            .catch((e) => alert(e));
    }

    pickSingleWithLibrary(cropping: any, mediaType: any = 'photo') {
        ImagePicker.openPicker({
            width:250,
            height:150,
            cropping: true,
            freeStyleCropEnabled: true,
            cropperStatusBarColor:styles.primary.color,
            cropperActiveWidgetColor:styles.primary.color,
            includeExif: true,
            forceJpg: true,
            mediaType,
        })
            .then((image) => {
                this.handleCapture(image)
            })
            .catch((e) => alert(e));
    }






    render() {

        const {navigation, setDialog, editmode, label,preview, icon,item}: any = this.props;
        const {imagepath}:any = this.state;
        const colors = this.props.theme;

        return (
            <View>


                <ActionSheet
                    options={['Take a new photo', 'Photo Library','Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={5}
                    onPress={(index:any) => {
                        if(index===0){
                            this.pickSingleWithCamera(true)
                        }
                        if(index===1){
                            this.pickSingleWithLibrary(true)
                        }
                    }}
                >
                    <View style={[styles.grid, styles.middle, styles.m_4]}>
                        <>
                            {Boolean(imagepath) ? <View style={[{width:250}]}>
                                <Image
                                    style={[{width:250,height:150,borderRadius:5}]}
                                    source={{uri:imagepath}}
                                />
                            </View> : <>
                                <Avatar fontsize={40} label={item.itemname} size={100} value={1}/>
                            </>}
                        </>
                    </View>

                </ActionSheet>

            </View>
        )
    }


}


const mapStateToProps = (state: any) => ({

})
const mapDispatchToProps = (dispatch: any) => ({

});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Attachment));


