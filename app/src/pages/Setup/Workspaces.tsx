import React from "react";


import {FlatList, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {Card, Divider, Paragraph} from "react-native-paper";
import {ItemDivider, localredux} from "../../libs/static";
import Container from "../../components/Container";
import {chevronRight, selectWorkspace} from "../../libs/function";
import AddWorkspace from "../SetupWorkspace/AddWorkspace";


const Workspaces = (props: any) => {

    const {navigation}: any = props;
    const {authData: {workspaces}}: any = localredux;


    const renderitems = ({item}: any) => {

        return (
            <TouchableOpacity onPress={() => selectWorkspace(item, navigation)} style={[{paddingHorizontal: 5}]}>

                <View style={[styles.grid, styles.justifyContent, styles.py_5]}>
                    <View><Paragraph style={[styles.paragraph, styles.text_md]}>{item.name}</Paragraph></View>
                    <View>
                        {chevronRight}
                    </View>
                </View>

            </TouchableOpacity>
        );
    };

    if (workspaces?.length === 0) {
        return <AddWorkspace/>
    }

    return <Container>

        <Card style={[styles.card]}>
            <Card.Content style={[styles.cardContent]}>
                <FlatList
                    data={workspaces}
                    renderItem={renderitems}
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{right: 1}}
                    initialNumToRender={50}
                    ItemSeparatorComponent={ItemDivider}
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    invertStickyHeaders={false}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={<View style={[styles.center, styles.middle]}>
                        <Paragraph style={[styles.paragraph, styles.p_5]}>No Workspace Found</Paragraph>
                    </View>}

                />

            </Card.Content>
        </Card>
    </Container>
}

export default Workspaces;
