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
                    <View style={style.content}>{props.children}</View>
                        
                        <IndicatorScreen 
                            showSavingView={props.showSavingView}
                            showDoneView={props.showDoneView}
                            showErrorView={props.showErrorView}
                        />
                    <View style={style.footer}> 
                            <View style={style.footerFlexBox}>
                                <View style={style.buttonFlexBox}> 
                                    <Button 
                                        buttonStyle={[style.button, style.buttonRight]} 
                                        titleStyle={style.buttonTitle}
                                        title="Cancel" 
                                        onPress={props.onClose}
                                    /> 
                                </View>
                                <View style={style.buttonFlexBox}> 
                                    <Button 
                                        titleStyle={[style.buttonTitle, {}]}
                                        buttonStyle={[style.button, style.buttonLeft]} 
                                        color={APP_COLOR} 
                                        title={saveTitle} 
                                        onPress={props.onSave}
                                        disabled={props.showSavingView}
                                    /> 
                                </View>
                            </View> 
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
        maxHeight: '80%',
        backgroundColor: '#ffffff',
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
        maxHeight: '76.5%',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    footer: {
        backgroundColor: 'white',
        height: 60,
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    footerFlexBox: {
        flex: 1,
        flexDirection: 'row-reverse',
    },
    buttonTitle: {
        fontFamily: APP_FONT,
        color: 'white'
    },
    buttonFlexBox: {
        flex: 0.5,
    },
    button: {
        height: 44,
        margin: 8,
        borderWidth: 0,
        borderColor: APP_COLOR,
    },
    buttonLeft: {
        borderBottomLeftRadius: borderRadius-7,
        marginRight: 4,
        backgroundColor: APP_GREEN + 'dd'
    },
    buttonRight: {
        borderBottomRightRadius: borderRadius-7,
        marginLeft: 4,
        backgroundColor: APP_COLOR + 'dd'
    },
    savingView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
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