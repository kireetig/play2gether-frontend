import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {apiEndPoint} from "../config";

export const EditProfileScreen = () => {
    const {navigate} = useNavigation();
    const [user, setUser] = React.useState({});
    const [sports, setSports] = React.useState({});

    const getProfile = () => {
        const response = AsyncStorage.getItem('playToken');
        response.then(token => {
            fetch(`${apiEndPoint}/user/getProfile?token=${token}`).then(res => res.json()).then(res => {
                if (res.status === 403) {
                    AsyncStorage.setItem('playToken', '');
                    navigate('Login');
                } else {
                    setUser(res.data);
                }
            }).catch(err => console.log(err));
        })
    };

    const getSports = () => {
        fetch(`${apiEndPoint}/sports/get`).then(res => res.json()).then(res => {
            setSports(res.data);
        })
    };

    React.useEffect(() => {
        getProfile();
        getSports();
    }, []);

    return (<View>
        <Text style={styles.heading}>Edit Page</Text>
        <Text style={styles.label}>Name : {user ? user.name : null}</Text>
        <Text style={styles.label}>Email : {user ? user.email : null}</Text>
        <Text style={styles.subHeading}>Favorite Sports</Text>

    </View>)
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    label: {
        fontSize: 16,
        marginLeft: 10,
    },
    subHeading : {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
        marginTop: 20,
    }
});