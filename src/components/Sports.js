import React from 'react';
import {Text, View, Button} from 'react-native';
import {apiEndPoint} from "../constants";
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
    return (<View>
        <Text>{props.text}</Text>
        <SectionedMultiSelect
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
        />
    </View>)
};