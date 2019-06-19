import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {useNavigation} from 'react-navigation-hooks'
import {Input} from "react-native-elements";
import {apiEndPoint} from '../config';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

export const SignupScreen = () => {
    const {navigate} = useNavigation();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const [confirmPwd, setConfirmPwd] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');

    const emailRegx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;


    const handleSignUp = () => {
        if (name.length < 3) {
            setErrMsg('Enter name of atleast 3 characters');
        } else if (!emailRegx.test(email)) {
            setErrMsg('Email vaild email');
        } else if (pwd.length < 8) {
            setErrMsg('Password must be of at least 8 characters');
        } else if (pwd !== confirmPwd) {
            setErrMsg('Password mismatch');
        } else {
            setErrMsg('');
            signUpApi();
        }
    };

    async function signUpApi() {
        try {
            await fetch(`${apiEndPoint}/user/signup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: pwd,
                    isProfileComplete: false
                }),
            }).then(res => res.json()).then((res) => {
                AsyncStorage.setItem('playToken', res.token);
                navigate('EditProfile');
            }).catch(res => console.error(res));
        } catch (e) {
            console.error(e);
        }
    }

    return (<View style={{margin: 10}}>
        <Text style={styles.heading}>Welcome to Play2Gether</Text>
        <Text style={styles.subHeading}>Sign Up</Text>
        <Input
            placeholder='Name'
            style={styles.input}
            onChangeText={(text) => {
                setName(text);
            }}
            leftIcon={
                <Icon
                    name='user'
                    size={24}
                    color='gray'
                />
            }
        />
        <Input
            leftIcon={
                <Icon
                    name='envelope'
                    size={24}
                    color='gray'
                />
            }
            placeholder='Email'
            style={styles.input}
            onChangeText={(text) => {
                setEmail(text);
            }}
        />
        <Input
            placeholder='Password (minimum 8 characters)'
            leftIcon={
                <Icon
                    name='lock'
                    size={24}
                    color='gray'
                />
            }
            style={styles.input}
            onChangeText={(text) => {
                setPwd(text);
            }}
            secureTextEntry={true}
        />
        <Input
            placeholder='Confirm Password'
            style={styles.input}
            onChangeText={(text) => {
                setConfirmPwd(text);
            }}
            leftIcon={
                <Icon
                    name='lock'
                    size={24}
                    color='gray'
                />
            }
            secureTextEntry={true}
        />
        <Text style={styles.errorStyle}>{errMsg}</Text>
        <Button title={'Sign Up'} onPress={handleSignUp} styles={styles.button}/>
        <Text style={styles.signup}>Already have account? <Text onPress={() => navigate('Login')}
                                                               style={{color: 'green'}}> Login</Text></Text>
    </View>)
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 25,
        textAlign: 'center',
        color: '#0dc67c',
        fontWeight: 'bold',
        marginTop: '30%',
        marginBottom: '10%'
    },
    subHeading: {
        fontSize: 20,
        textAlign: 'center',
        color: '#10a1ef',
        fontWeight: 'bold',
    },
    errorStyle: {
        color: 'red',
        margin: 10
    },
    input: {
        marginBottom: 10,
    },
    button: {
        margin: 10,
    },
    signup: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: '10%'
    },
});