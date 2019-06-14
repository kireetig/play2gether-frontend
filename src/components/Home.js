import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks'

export const HomeScreen = () => {
    const { navigate } = useNavigation();
    return (<View>
        <Text style={styles.heading}>Home Page</Text>
        <Button title={'Login'} color={'red'}
            onPress={() => navigate('Login')}
        />
    </View>)
};

const styles = StyleSheet.create({
    heading : {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    }
});