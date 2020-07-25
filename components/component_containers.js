import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { AppStyles } from '../styles';


export const BodyContainer = (props) => {

    return(
        <View style={styles.bodyContainer}>
            {props.children}
        </View>
    )
}

export const ListContainer = (props) => {
    return( 
        <ScrollView style={[AppStyles.block, props.style]}>
            <View style={styles.listContainer}>
                {props.children}
            </View>
        </ScrollView>
    )
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
    }
})
