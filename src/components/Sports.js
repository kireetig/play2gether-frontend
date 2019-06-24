import React from 'react';
import {Text, View} from 'react-native';
import {apiEndPoint, tokenName} from "../constants";
import SectionedMultiSelect from "react-native-sectioned-multi-select";


export const Sports = (props) => {
    const [sports, setSports] = React.useState([]);

    const getSports = () => {
        fetch(`${apiEndPoint}/sports/get`).then(res => res.json()).then(res => {
            setSports(res.data);
        })
    };


    React.useEffect(() => {
        getSports();
    }, []);
    return (<View style={{marginTop: -30}}>
        <Text>{props.text}</Text>
        {sports.length ? <SectionedMultiSelect
            single={props.isSingle}
            items={sports}
            uniqueKey='_id'
            selectText='Select Sports'
            showDropDowns={false}
            onSelectedItemsChange={props.onChange}
            selectedItems={props.selectedSports}
            confirmText={'Select'}
            styles={{selectedItem: {color: 'blue'}}}
            colors={{chipColor: '#0000ff'}}
            loading={sports.length < 1}
        /> : null}
    </View>)
};