import React, {Component} from "react";


import dataContainer from "../../hoc/dataContainer";


import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Appbar, Card, Divider, List, Paragraph, Title} from "react-native-paper";
import {
    ACTIONS,
    adminUrl,
    composeValidators,
    isEmail,
    localredux,
    loginUrl,
    METHOD,
    required,
    STATUS
} from "../../libs/static";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button";
import Container from "../../components/Container";
import apiService from "../../libs/api-service";
import {chevronRight, isEmpty, log} from "../../libs/function";
import {useDispatch} from "react-redux";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";


const Workspaces = (props: any) => {

    const {navigation}:any = props;
    const {authData:{workspaces,token}}:any = localredux;
    const dispatch = useDispatch();


  const selectWorkspace = async (workspace:any) => {

        dispatch(showLoader())
         await apiService({
              method: METHOD.GET,
              action: ACTIONS.INIT,
              queryString: {stream: "pos"},
              other: {url: adminUrl,workspace:true},
              token: token,
              workspace: workspace.name
          }).then((response: any) => {
              dispatch(hideLoader())
              console.log('response.data',response.data)
              if (response.status === STATUS.SUCCESS && !isEmpty(response.data)) {
                  localredux.initData = {...response.data, deviceName: response?.deviceName,workspace:workspace.name}
                  navigation.navigate('Terminal');
              }
          }).catch(() => {
              dispatch(hideLoader())
          })

  }

  const renderitems = ({item}:any) => {

      return (
          <TouchableOpacity onPress={()=> selectWorkspace(item)} style={[{paddingHorizontal:5}]}>

              <View style={[styles.grid, styles.justifyContent, styles.p_5]}>
                  <View><Paragraph style={[styles.paragraph, styles.text_md]}>{item.name}</Paragraph></View>
                  <View>
                      {chevronRight}
                  </View>
              </View>

            <Divider/>
          </TouchableOpacity>
      );
  };



  return  <Container config={{title:'Workspaces'}}>

            <Card style={[styles.h_100]}>

                <FlatList
                    data={workspaces}
                    renderItem={renderitems}
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{ right: 1 }}
                    initialNumToRender = {50}

                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    invertStickyHeaders={false}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={<View style={[styles.center,styles.middle]}>
                        <Paragraph style={[styles.paragraph,styles.p_5]}>No Workspace Found</Paragraph>
                    </View>}

                />

            </Card>


  </Container>
}

export default  Workspaces;
