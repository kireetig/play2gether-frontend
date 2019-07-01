import {StyleSheet} from 'react-native';

export const detailStyles = StyleSheet.create({
    backArrow: {
        marginLeft: 20,
        marginTop: 20,
        zIndex: 2
    }, pageHeadingContainer: {
        position: 'absolute',
        width: '100%',
        zIndex: 1
    },
    requestContainer: {
        marginTop: 30,
        marginLeft: 10
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15
    },
    mt30: {
        marginTop: 30
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    buttonContainer: {
        flex: 1,
        margin: 2.5
    }
});