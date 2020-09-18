import { StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { APP_COLOR, APP_FONT } from "../styles";
import React from 'react';

export function PMBInput(props) {
    return(
        <Input
            labelStyle={PMBInputStyle.label}
            inputContainerStyle={PMBInputStyle.inputContainer}
            inputStyle={PMBInputStyle.input}
            {...props}
        />
    )   
}

const PMBInputStyle = StyleSheet.create({
    label: {
        fontFamily: APP_FONT,
        fontSize: 15,
        margin: 8,
    },
    inputContainer: {
        backgroundColor: APP_COLOR + '10',
        borderRadius: 10,
        paddingHorizontal: 8,
        borderColor: APP_COLOR + '20',
        borderWidth: 1,
    },
    input: {
        fontFamily: APP_FONT,
        fontSize: 15,
        opacity: 0.7,
        alignSelf: "center"
    }
});