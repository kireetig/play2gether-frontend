import {StyleSheet} from "react-native";

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        margin: 10
    },
    heading: {
        fontSize: 25,
        textAlign: 'center',
        color: '#0dc67c',
        fontWeight: 'bold',
        marginTop: '30%',
        marginBottom: '10%'
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
        width: '90%',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 18
    },
    login: {
        fontSize: 20,
        textAlign: 'center',
        color: '#10a1ef',
        fontWeight: 'bold',
    }
});