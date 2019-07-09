import {StyleSheet} from 'react-native';

export const chatCss = StyleSheet.create({
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        paddingBottom: 10
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        marginLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
        height: 60,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: 'silver'
    },
    top: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
    },
    w80: {
        width: '90%'
    },
    backArrow: {
        color: '#2c2e30'
    },
    userBox: {
        backgroundColor: '#07e6e6'
    },
    normalBox: {
        backgroundColor: 'grey'
    }
});