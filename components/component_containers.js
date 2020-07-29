import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { AppStyles, APP_COLOR } from '../styles';


export const BodyContainer = (props) => {

    return(
        <View style={styles.bodyContainer}>
            {props.children}
        </View>
    )
}

export const ListContainer = (props) => {
    return( 
        <LoadIndicatorView isLoading={props.isLoading} fullScreen={!props.noFullScreen}>
            <ScrollView style={[props.noBlock ? {} : AppStyles.block, props.style]}>
                <View style={styles.listContainer}>
                    {props.children}
                </View>
            </ScrollView>
        </LoadIndicatorView>
    )
}

export const LoadIndicatorView = (props) => {
    if (props.isLoading) {
        return <PMBActivityIndicator fullScreen={props.fullScreen}/>
    } else {
        return props.children
    }
}

export const PMBActivityIndicator = (props) => {
    const indicator = 
        <ActivityIndicator 
            size='large' 
            color={APP_COLOR} 
            style={{ marginHorizontal: 'auto', marginVertical: 10 }}
        />;
    if (props.fullScreen) {
        return (
            <View style={styles.indicatorContainer}>
                {indicator}
            </View>
        )
    }
    else {
        return indicator
    }
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    listContainer: {
        borderRadius: 15, 
        overflow: 'hidden', 
        marginBottom: 20
    },
    indicatorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
