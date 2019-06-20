import * as React from 'react';
import {Text, View} from "react-native";
import {useNavigation} from "react-navigation-hooks";
import {Input, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {apiEndPoint, tokenName} from "../../constants";
import Icon from 'react-native-vector-icons/FontAwesome';
import {loginStyles} from "./loginCss";
import {SIGNUP, HOME, EDITPROFILE} from "../../Navigation/navigationConstants";
import {commonStyles} from "../../commonStyles";

const emailRegx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const LoginScreen = () => {
    const {navigate} = useNavigation();
    const [pwdErrMsg, setPwdErrMsg] = React.useState('');
    const [unameErrMsg, setUnameErrMsg] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const [uname, setUname] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');

    const handleSignUp = () => {
        navigate(SIGNUP);
    };

    const handleLogin = () => {
        if (!emailRegx.test(uname)) {
            setUnameErrMsg('Please enter vaild username');
        } else {
            setUnameErrMsg('');
        }
        if (pwd.length < 8) {
            setPwdErrMsg('Enter valid password');
        } else {
            setPwdErrMsg('');
        }
        if (pwd.length > 7 && emailRegx.test(uname)) {
            setErrMsg('');
            loginApi();
        }
    };

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem(tokenName, value);
        } catch (e) {
            console.error(e);
        }
    };

    async function loginApi() {
        try {
            await fetch(`${apiEndPoint}/user/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: uname.toLowerCase(),
                    password: pwd,
                }),
            }).then(res => res.json()).then(async (res) => {
                if (res.status === 200) {
                    await storeData(res.token);
                    setPwd('');
                    console.log('password reset');
                    if (res.isProfileComplete) {
                        navigate(HOME);
                    } else {
                        navigate(EDITPROFILE);
                    }

                } else {
                    setErrMsg(res.message);
                }
            }).catch(res => console.error(res));
        } catch (e) {
            console.error(e);
        }
    }

    React.useEffect(() => {
        const response = AsyncStorage.getItem(tokenName);
        response.then(token => {
            if(token){
               navigate(HOME);
            }
        })
    });


    return (<View style={loginStyles.container}>
        <Text style={loginStyles.heading}>Welcome to Play2Gether</Text>
        <Text style={loginStyles.login}>Login</Text>
        <Input
            placeholder={'Email'}
            leftIcon={
                <Icon
                    raised
                    leftIconContainerStyle={commonStyles.p20}
                    name='envelope'
                    size={24}
                    color='gray'
                />
            }
            errorStyle={commonStyles.errorColor}
            errorMessage={unameErrMsg}
            style={loginStyles.input}
            onChangeText={(text) => {
                setUname(text);
            }}
        />
        <Input
            placeholder='Password'
            errorStyle={commonStyles.errorColor}
            errorMessage={pwdErrMsg}
            containerStyle={loginStyles.input}
            onChangeText={(text) => {
                setPwd(text);
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
        <Text style={loginStyles.forgot}>
            Forgot Password?
        </Text>
        <Text style={loginStyles.error}>
            {errMsg}
        </Text>
        <Button
            raised
            large
            title={'Login'}
            color={'blue'}
            onPress={handleLogin}
            style={loginStyles.button}
        />
        <Text style={loginStyles.signup}>don't have account? <Text onPress={handleSignUp} style={{color: 'green'}}>Sign
            up</Text></Text>
    </View>)
};