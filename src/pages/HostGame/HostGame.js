import React from 'react';
import {Text, View, Button} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {hostGameStyles} from "./hostGameCss";
import {commonStyles} from "../../commonStyles";
import {Sports} from "../../components/Sports";
import {AutoComplete} from "../../components/AutoComplete";

export const HostGameScreen = () => {
    const { navigate } = useNavigation();
    const [selectedSport, setSelectedSport] = React.useState([]);

    const sportChange = selectedItem => {
        setSelectedSport(selectedItem)
    };


    return (<View style={commonStyles.m10}>
        <Text style={commonStyles.heading}>Host A Game</Text>
        <Sports isSingle={true} text={'Select a Sport :'} selectedSports={selectedSport} onChange={sportChange}/>
        <Text>Venue:</Text>
        <AutoComplete/>

    </View>)
};