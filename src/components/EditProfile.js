import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {apiEndPoint} from "../config";

export const EditProfileScreen = () => {
    const {navigate} = useNavigation();
    const [user, setUser] = React.useState('');

    const getProfile = () => {
        const response = AsyncStorage.getItem('playToken');
        response.then(token => {
            fetch(`${apiEndPoint}/user/getProfile?token=${token}`).then(res => res.json()).then(res => {
                console.log(res);
                if (res.status === 403) {
                    navigate('Login');
                } else {
                    setUser(res.data);
                }
            }).catch(err => console.log(err));
        })
    };

    React.useEffect(getProfile);

    return (<View>
        <Text style={styles.heading}>Edit Page</Text>
        <Text>Name : {user ? user.name : null}</Text>
        <Text>Email : {user ? user.email : null}</Text>
    </View>)
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: 'black',
        fontWeight: 'bold'
    }
});