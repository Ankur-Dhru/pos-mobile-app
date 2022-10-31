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
import {appLog, chevronRight, isEmpty, log, selectWorkspace} from "../../libs/function";
import {useDispatch} from "react-redux";
import {hideLoader, showLoader} from "../../redux-store/reducer/component";
import AddWorkspace from "../SetupWorkspace/AddWorkspace";


const Workspaces = (props: any) => {

    const {navigation}:any = props;
    const {authData:{workspaces}}:any = localredux;


  const renderitems = ({item}:any) => {

      return (
          <TouchableOpacity onPress={()=> selectWorkspace(item,navigation)} style={[{paddingHorizontal:5}]}>

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

  if(workspaces?.length === 0){
      return <AddWorkspace/>
  }

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
