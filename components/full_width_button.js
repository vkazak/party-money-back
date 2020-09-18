import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { AppStyles, APP_COLOR, APP_FONT_SEMIBOLD, APP_GREEN } from "../styles";
import React from 'react';
import { Button, Icon } from "react-native-elements";

export function FullWidthButton(props) {
    return(
        <Button
            containerStyle={props.containerStyle}
            buttonStyle={FullWidthButtonStyle.container}
            titleStyle={FullWidthButtonStyle.title}
            title={props.title}
            onPress={props.onPress}
            disabled={props.disabled}
            icon={
                <Icon
                    name="ios-arrow-forward"
                    color="white"
                    type="ionicon"
                    containerStyle={{ marginLeft: 15 }}
                />
            }
            iconRight
        />
    )
}

const FullWidthButtonStyle = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        borderRadius: 30,
        backgroundColor: APP_COLOR + 'f0',
        padding: 20,
    },
    title: {
        fontFamily: APP_FONT_SEMIBOLD,
        fontSize: 15,
        color: '#fff',
    }
});