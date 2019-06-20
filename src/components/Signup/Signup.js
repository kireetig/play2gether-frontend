import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {useNavigation} from 'react-navigation-hooks'
import {Input} from "react-native-elements";
import {apiEndPoint, tokenName} from '../../constants';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";
import {signupStyles} from "./signupCss";
import {EDITPROFILE, LOGIN} from "../../navigation/navigationConstants";

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
                AsyncStorage.setItem(tokenName, res.token);
                navigate(EDITPROFILE);
            }).catch(res => console.error(res));
        } catch (e) {
            console.error(e);
        }
    }

    return (<View style={{margin: 10}}>
        <Text style={signupStyles.heading}>Welcome to Play2Gether</Text>
        <Text style={signupStyles.subHeading}>Sign Up</Text>
        <Input
            placeholder='Name'
            style={signupStyles.input}
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
            style={signupStyles.input}
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
            style={signupStyles.input}
            onChangeText={(text) => {
                setPwd(text);
            }}
            secureTextEntry={true}
        />
        <Input
            placeholder='Confirm Password'
            style={signupStyles.input}
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
        <Text style={signupStyles.errorStyle}>{errMsg}</Text>
        <Button title={'Sign Up'} onPress={handleSignUp} styles={signupStyles.button}/>
        <Text style={signupStyles.signup}>Already have account? <Text onPress={() => navigate(LOGIN)}
                                                               style={{color: 'green'}}> Login</Text></Text>
    </View>)
};