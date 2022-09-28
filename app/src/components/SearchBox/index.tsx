import * as React from 'react';
import {useEffect} from 'react';
import {Card, Searchbar, withTheme} from 'react-native-paper';
import {Platform} from "react-native";


const Search = (props: any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => {
        setSearchQuery(query)
    };


    useEffect(() => {

        if (Boolean(searchQuery)) {
            const delayDebounceFn = setTimeout(() => {
                !props.disableKeypress && props?.handleSearch(searchQuery);
            }, props.timeout ? props.timeout : 500)
            return () => clearTimeout(delayDebounceFn)
        } else {
            !props.disabledefaultload && props?.handleSearch(searchQuery)
        }
    }, [searchQuery]);


    const {colors}: any = props.theme;

    return (
        <Card style={[{padding:5}]}>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                autoFocus={false}
                value={searchQuery}
                useNativeDriver={true}
                onSubmitEditing={() => props.handleSearch(searchQuery.trim())}
                style={[{elevation: 0, height: 40, borderRadius: 5, backgroundColor: 'white'}]}
                inputStyle={{height: Platform.OS === 'ios' ? 40 : 43}}

                {...props}
            />
        </Card>
    );
};

export default (withTheme(Search));
