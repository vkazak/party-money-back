import { Overlay, Button, Icon } from 'react-native-elements';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
const { MAIN_COLOR, APP_GREEN, APP_RED } = require("./common-styles");

const IndicatorScreen = (props) => {
    let showLoading = props.showSavingView && !(props.showDoneView || props.showErrorView);
    return(
        <View style={props.showSavingView ? style.savingView : style.hidden}>
            <ActivityIndicator
                size="large"
                color={MAIN_COLOR}
                style={showLoading ? style.indicator : style.hidden}
                animating={showLoading}
            />
            <Icon
                name="check-circle"
                color={APP_GREEN}
                size={60}
                style={props.showDoneView ? style.indicator : style.hidden}
            />
            <Icon
                name="highlight-off"
                color={APP_RED}
                size={60}
                style={props.showErrorView ? style.indicator : style.hidden}
            />
        </View>
    )
}

const PMBOverlay = (props) => {
    const saveTitle = props.saveTitle || 'Save';

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
                <View>
                    <View style={style.content}>{props.children}</View>
                    <View style={style.footer}>
                        <Button style={style.button} title="Cancel" type="outline" onPress={props.onClose}/>
                        <Button style={style.button} title={saveTitle} onPress={props.onSave}/>
                    </View> 
                    <IndicatorScreen 
                        showSavingView={props.showSavingView}
                        showDoneView={props.showDoneView}
                        showErrorView={props.showErrorView}
                    />
                </View>
            </View>
        </Overlay>
    )
}

const style = StyleSheet.create({
    container: {
        maxHeight: "80%",
        minWidth: "90%",
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
    },
    savingView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position:"absolute", 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
    },
    indicator: {
        paddingBottom: 60
    },
    hidden : {
        width : 0,
        height : 0
    }
});

export default PMBOverlay;