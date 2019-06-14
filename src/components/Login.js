import * as React from 'react';
import {Text, View, StyleSheet} from "react-native";
import {useNavigation} from "react-navigation-hooks";
import {Input, Button} from 'react-native-elements';
import {apiEndPoint} from "../config";

export const LoginScreen = () => {
    const {navigate} = useNavigation();
    const [pwdErrMsg, setPwdErrMsg] = React.useState('');
    const [unameErrMsg, setUnameErrMsg] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const [uname, setUname] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');

    const handleSignUp = () => {
        navigate('Signup');
    };

    const handleLogin = () => {
        if (uname.length < 3) {
            setUnameErrMsg('Please enter vaild username');
        } else {
            setUnameErrMsg('');
        }
        if (pwd.length < 8) {
            setPwdErrMsg('Enter valid password');
        } else {
            setPwdErrMsg('');
        }
        if (pwd.length > 7 && uname.length > 2) {
            loginApi();
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
                    email: uname,
                    password: pwd,
                }),
            }).then(res => res.json()).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setErrMsg('');
                    navigate('Home');
                } else {
                    setErrMsg(res.message);
                }
            }).catch(res => console.error(res));
        } catch (e) {
            console.error(e);
        }
    }


    return (<View style={styles.container}>
        <Text style={styles.heading}>Welcome to Play2Gether</Text>
        <Input
            placeholder='User name'
            errorStyle={{color: 'red'}}
            errorMessage={unameErrMsg}
            style={styles.input}
            onChangeText={(text) => {
                setUname(text);
            }}
        />
        <Input
            placeholder='Password'
            errorStyle={{color: 'red'}}
            errorMessage={pwdErrMsg}
            containerStyle={styles.input}
            onChangeText={(text) => {
                setPwd(text);
            }}
            secureTextEntry={true}
        />
        <Text style={styles.forgot}>
            Forgot Password?
        </Text>
        <Text style={styles.error}>
            {errMsg}
        </Text>
        <Button
            raised
            large
            title={'Login'}
            color={'blue'}
            onPress={handleLogin}
            style={styles.button}
        />
        <Text style={styles.signup}>don't have account? <Text onPress={handleSignUp} style={{color: 'green'}}>Sign
            up</Text></Text>
    </View>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column"
    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        marginTop: '10%'
    },
    input: {},
    forgot: {
        textAlign: 'right',
        color: 'blue',
        margin: 10
    },
    signup: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: '10%'
    },
    button: {
        marginTop: 20,
        width: '90%'
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }
});