import React, {useState} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
import {styles} from "../../theme";
import {getItemImage, saveImage, uploadFile} from "../../libs/function";
import {capture} from "../../libs/static";

import {ProIcon} from "../../components";
import ActionSheet from '../../components/ActionSheet';
import ImagePicker from "react-native-image-crop-picker";
import Avatar from "../../components/Avatar";

import PageLoader from "../../components/PageLoader";


const Index = (props: any) => {

    const [loader, setloader] = useState(false)
    const [imagepath, setimagepath] = useState(getItemImage(props.item))


    const handleCapture = (data: any) => {
        setimagepath(data.path)
        setloader(true)

        let filename = data.path.split('/').pop()

        uploadFile({uri: data.path, name: filename, type: data.mime}, function (response: any) {
            capture.photo = response.download_url.replace('http://', '').replace('https://', '');
            saveImage(capture.photo, false).then(() => {
                setloader(false)
            })
        }).then(r => {

        });

    }

    const pickSingleWithCamera = (cropping: any, mediaType: any = 'photo') => {
        ImagePicker.openCamera({
            width: 250,
            height: 150,
            cropping: cropping,
            freeStyleCropEnabled: true,
            cropperStatusBarColor: styles.primary.color,
            cropperActiveWidgetColor: styles.primary.color,
            includeExif: true,
            forceJpg: true,
            mediaType,
        })
            .then((image) => {
                handleCapture(image)
            })
            .catch((e) => alert(e));
    }

    const pickSingleWithLibrary = (cropping: any, mediaType: any = 'photo') => {
        ImagePicker.openPicker({
            width: 250,
            height: 150,
            cropping: true,
            freeStyleCropEnabled: true,
            cropperStatusBarColor: styles.primary.color,
            cropperActiveWidgetColor: styles.primary.color,
            includeExif: true,
            forceJpg: true,
            mediaType,
        })
            .then((image) => {
                handleCapture(image)
            })
            .catch((e) => alert(e));
    }

    const deleteImage = () => {
        setimagepath('')
        capture.photo = '';
    }


    const {item}: any = props;

    let actions = ['Take a new photo', 'Photo Library'];
    if (Boolean(imagepath)) {
        actions.push('Remove Image')
    }
    actions.push('Cancel')

    if(loader){
        return <View style={[styles.border,styles.m_4,{height:150,width:250,borderRadius:5}]}>
            <PageLoader/>
        </View>
    }

    return (
        <View>

            <ActionSheet
                options={actions}
                cancelButtonIndex={actions.length - 1}
                destructiveButtonIndex={actions.length - 1}
                onPress={(index: any) => {
                    if (index === 0) {
                        pickSingleWithCamera(true)
                    } else if (index === 1) {
                        pickSingleWithLibrary(true)
                    } else if (index === 2 && actions.length === 4) {
                        deleteImage()
                    }
                }}
            >
                <View style={[styles.grid, styles.middle, styles.m_4]}>
                    <>
                        {Boolean(imagepath) ? <View style={[{width: 250}]}>
                            <Image
                                style={[{width: 250, height: 150, borderRadius: 5}]}
                                source={{uri: imagepath}}
                            />
                        </View> : <>
                            <Avatar fontsize={40} label={item?.itemname || ''} size={100} value={1}
                                    more={{borderRadius: 7}}/>
                        </>}
                        <View style={[styles.absolute, styles.p_3, {
                            bottom: 0,
                            right: 0,
                            backgroundColor: '#00000080',
                            borderBottomRightRadius: 7,
                            borderTopLeftRadius: 15
                        }]}><ProIcon name={'pencil'} color={'white'}/></View>
                    </>
                </View>

            </ActionSheet>

        </View>
    )

}


export default Index;


