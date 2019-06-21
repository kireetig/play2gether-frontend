import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {homeStyles} from "./homeCss";
import {LOGIN} from "../../navigation/navigationConstants";

export const HomeScreen = () => {
    const { navigate } = useNavigation();

    const logout = () => {
        AsyncStorage.removeItem('playToken');
        navigate(LOGIN);
    };

    return (<View>
        <Text style={homeStyles.heading}>Home Page</Text>
        <Button title={'Logout'} color={'red'}
            onPress={logout}
        />
    </View>)
};