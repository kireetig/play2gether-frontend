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
        alignSelf: 'flex-end',
        backgroundColor: '#07e6e6',
        width: '75%',
    },
    normalBox: {
        backgroundColor: '#c0d2f0',
        width: '75%',
        alignItems: 'flex-start'
    },
    label: {
        fontWeight: 'bold',
        marginBottom:10,
        color: '#7d4c1b'
    },
    time: {
        color: '#3d3d3d',
        marginLeft: 10,
    },
    end: {
        alignSelf: 'flex-end',
        marginRight: 20
    }
});