import React from 'react';
import {Text, View} from 'react-native';
import {apiEndPoint} from "../constants";
import {useGlobalState} from '../../App';
import MultiSelect from "react-native-multiple-select";


export const Sports = (props) => {
    const [sports, setSports] = React.useState([]);
    const [value, update] = useGlobalState('sports');

    const getSports = () => {
        fetch(`${apiEndPoint}/sports/get`).then(res => res.json()).then(res => {
            update(res.data);
            setSports(res.data);
        })
    };


    React.useEffect(() => {
        getSports();
    }, []);
    return (<View style={{marginTop: -10}}>
        <Text style={{marginBottom:5}}>{props.text}</Text>
        <MultiSelect
            single={props.isSingle}
            items={sports}
            uniqueKey='_id'
            selectText='Select Sports'
            onSelectedItemsChange={props.onChange}
            selectedItems={props.selectedSports}
            confirmText={'Select'}
            tagRemoveIconColor="orange"
            tagBorderColor="#CCC"
            tagTextColor="blue"
            submitButtonColor={'blue'}
        />
    </View>)
};