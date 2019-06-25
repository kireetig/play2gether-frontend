import {StyleSheet} from 'react-native';

export const hostGameStyles = StyleSheet.create({
    heading: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: '10%',
        color: '#0dc67c'
    },
    container: {
        marginHorizontal: 15, marginTop: 20, flex: 1, backgroundColor: 'red'
    },
    label: {
        marginTop: 15,
        fontWeight: "400",
        color: 'black'
    },
    description: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "grey",
        marginBottom: 10
    }
});