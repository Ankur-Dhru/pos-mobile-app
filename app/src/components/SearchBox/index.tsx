import * as React from 'react';
import {useEffect, useRef} from 'react';
import {Card, Searchbar, withTheme} from 'react-native-paper';
import {Platform, View} from "react-native";
import {appLog} from "../../libs/function";
import {styles} from "../../theme";


const Search = (props: any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => {
        setSearchQuery(query)
    };
    let searchRf:any = useRef()

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

    useEffect(()=>{
        if(props.autoFocus) {
            setTimeout(() => {
                searchRf?.focus()
            }, 200)
        }
    },[])


    const {colors}: any = props.theme;

    return (
        <View>
            <Searchbar
                ref={(ref)=> {
                    searchRf = ref
                }}
                placeholder="Search"
                onChangeText={onChangeSearch}
                autoFocus={false}
                value={searchQuery}
                useNativeDriver={true}
                onSubmitEditing={() => props.handleSearch(searchQuery.trim())}
                style={[styles.noshadow,{elevation: 0,  borderRadius: 5, backgroundColor: 'white'}]}

                {...props}
            />
        </View>
    );
};

export default (withTheme(Search));
