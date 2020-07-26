import { StyleSheet } from 'react-native';

export const APP_BLUE = '#457B9D';
export const APP_GREEN = '#40916C';
export const APP_RED = '#E63946';
export const APP_COLOR = '#F4A261';
export const APP_FONT = 'Nunito';
export const APP_FONT_BOLD = 'Nunito Bold';
export const APP_FONT_SEMIBOLD = 'Nunito Semi-bold';

export const AppStyles = StyleSheet.create({
    floatingIconButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    block: {
        padding: 8,
        shadowColor: 'grey',
        shadowOffset: {width: 0,  height: 0},
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4
    },
    listTitle: {
        fontFamily: APP_FONT
    },
    listSubtitle: {
        fontFamily: APP_FONT,
        fontSize: 13,
        opacity: 0.5
    }
});

export const NavigatorStyle = {
    headerStyle: {
        backgroundColor: APP_COLOR,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontFamily: APP_FONT_BOLD
    }
};