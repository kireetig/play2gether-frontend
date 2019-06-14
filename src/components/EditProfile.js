import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks'

export const EditProfileScreen = () => {
    const { navigate } = useNavigation();
    return (<View>
        <Text style={styles.heading}>Edit Page</Text>

    </View>)
};

const styles = StyleSheet.create({
    heading : {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    }
});