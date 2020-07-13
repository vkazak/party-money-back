import { Overlay, Button } from 'react-native-elements';
import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
const { MAIN_COLOR } = require("./common-styles");

const PMBOverlay = (props) => {

    return (
        <Overlay
            isVisible={props.isVisible}
            animationType="fade"
            onBackdropPress={props.onClose}
        >
            <View style={style.container}>
                <View style={style.header}>
                    <Text style={style.headerText}>{props.title}</Text>
                </View>
                <View style={style.content}>{props.children}</View>
                <View style={style.footer}>
                    <Button style={style.button} title="Cancel" type="outline" onPress={props.onClose}/>
                    <Button style={style.button} title="Save" onPress={props.onSave}/>
                </View> 
            </View>
        </Overlay>
    )
}

const style = StyleSheet.create({
    container: {
        maxHeight: "80%",
        minWidth: "80%",
        margin: -10
    },
    headerText: {
        color: "white",
        marginLeft: 20,
        marginVertical: 20,
        fontWeight: "300",
        fontSize: 18
    },
    header: {
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: MAIN_COLOR,
        width: "100%",
        height: 60,
    },
    content: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    footer: {
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: "row-reverse",
        height: 40
    },
    button: {
        marginLeft: 10,
        width: 100,
        flexGrow: 0.3
    }
});

export default PMBOverlay;