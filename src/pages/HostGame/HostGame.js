import React from 'react';
import {Text, View, Button} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import {hostGameStyles} from "./hostGameCss";
import {commonStyles} from "../../commonStyles";
import {Sports} from "../../components/Sports";
import {AutoComplete} from "../../components/AutoComplete";
import AsyncStorage from '@react-native-community/async-storage';
import {tokenName} from "../../constants";
import {getProfileUtil} from "../../utils/getProfile";
import {LOGIN} from "../../navigation/navigationConstants";

export const HostGameScreen = () => {
    const {navigate} = useNavigation();
    const [selectedSport, setSelectedSport] = React.useState([]);
    const [token, setToken] = React.useState(null);
    const [country, setCountry] = React.useState('');

    const sportChange = selectedItem => {
        setSelectedSport(selectedItem)
    };

    React.useEffect(() => {
        AsyncStorage.getItem(tokenName).then(token => {
            getProfileUtil(token).then(res => {
                if(res.status === 200){
                    setCountry(res.data.country);
                }else if(res.status === 403){
                    AsyncStorage.removeItem(tokenName);
                    navigate(LOGIN);
                }
            });
            setToken(token);
        });
    }, []);


    return (<View style={commonStyles.m10}>
        <Text style={commonStyles.heading}>Host A Game</Text>
        <Sports isSingle={true} text={'Select a Sport :'} selectedSports={selectedSport} onChange={sportChange}/>
        <Text>Venue:</Text>
        <AutoComplete country={country}/>
        <Text>Date:</Text>
        <Text>Description: </Text>
    </View>)
};