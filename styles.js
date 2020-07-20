import {StyleSheet} from 'react-native';

export const MAIN_COLOR = '#007AFF';
export const APP_GREEN = '#00BB3F';
export const APP_RED = 'tomato';
export const APP_COLOR = '#ffc135';

const listStyles = StyleSheet.create({
    floatingIconButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: 'grey',
        shadowOffset: {width: 2,  height: 2},
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    block: {
        padding: 8,
        shadowColor: 'grey',
        shadowOffset: {width: 2,  height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 6,
    }
});

export default listStyles;