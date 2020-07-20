import React from 'react';
import { StyleSheet, View } from 'react-native';
import commonStyles from '../styles';


export const BodyContainer = (props) => {

    return(
        <View style={styles.bodyContainer}>
            {props.children}
        </View>
    )
}

export const ListContainer = (props) => {
    <ScrollView style={commonStyles.block}>
        <View style={styles.listContainer}>
            {props.children}
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    listContainer: {
        borderRadius: 15, 
        overflow: 'hidden', 
        marginBottom: 20
    }
})
