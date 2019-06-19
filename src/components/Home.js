import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';

export const HomeScreen = () => {
    const { navigate } = useNavigation();

    const logout = () => {
        console.log('test');
        AsyncStorage.removeItem('playToken');
        navigate('Login');
    };

    return (<View>
        <Text style={styles.heading}>Home Page</Text>
        <Button title={'Logout'} color={'red'}
            onPress={logout}
        />
    </View>)
};

const styles = StyleSheet.create({
    heading : {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    button: {

    }
});