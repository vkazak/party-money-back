import { Button, Icon } from 'react-native-elements';
import { Text, View, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import React from 'react';
const { APP_GREEN, APP_RED, APP_COLOR, APP_FONT } = require("../styles");

const IndicatorScreen = (props) => {
    let showLoading = props.showSavingView && !(props.showDoneView || props.showErrorView);
    
    return(
        <View style={props.showSavingView ? style.savingView : style.hidden}>
            <ActivityIndicator
                size="large"
                color={APP_COLOR}
                style={showLoading ? style.indicator : style.hidden}
                animating={Boolean(showLoading)}
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
        <Modal
            visible={props.isVisible}
            animationType="slide"
            onRequestClose={props.onClose}
            transparent
        >
            <View style={style.centeredView}>
                <View style={style.container}>
                    <View style={style.header}>
                        <Text style={style.headerText}>{props.title}</Text>
                    </View>
                    <View>
                        <View style={style.content}>{props.children}</View>
                        <View style={style.footer}>
                            <Button 
                                style={style.button} 
                                buttonStyle={{borderColor: APP_COLOR}} 
                                titleStyle={[style.buttonTitle, {color: APP_COLOR}]}
                                title="Cancel" 
                                type="outline" 
                                onPress={props.onClose}
                            />
                            <Button 
                                style={style.button} 
                                titleStyle={style.buttonTitle}
                                buttonStyle={{backgroundColor: APP_COLOR}} 
                                color={APP_COLOR} 
                                title={saveTitle} 
                                onPress={props.onSave}
                            />
                        </View> 
                        <IndicatorScreen 
                            showSavingView={props.showSavingView}
                            showDoneView={props.showDoneView}
                            showErrorView={props.showErrorView}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const borderRadius = 15;

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    headerText: {
        color: "white",
        marginLeft: 20,
        marginVertical: 20,
        fontFamily: APP_FONT,
        fontSize: 18
    },
    header: {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        backgroundColor: APP_COLOR,
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
    buttonTitle: {
        fontFamily: APP_FONT
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
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
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