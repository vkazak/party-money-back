import {StyleSheet} from 'react-native';

export const MAIN_COLOR = '#007AFF';
export const APP_GREEN = '#00BB3F';
export const APP_RED = 'tomato';

const listStyles = StyleSheet.create({
    floatingIconButton: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    block: {
        padding: 8,
        shadowColor: 'grey',
        shadowOffset: {width: 3,  height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 8,
    }
});

export default listStyles;