import React from 'react';
import { View, StyleSheet } from 'react-native';

const PMBDivider = (props) => {
    const dirStyle = props.horizontal ? style.horizontal : style.vertical;

    return (
        <View style={[style.divider, dirStyle]}/>
    )
}

const style = StyleSheet.create({
    divider: {
        backgroundColor: 'grey',
        opacity: 0.3,
    }, 
    vertical: {
        height: '100%',
        width: 1,
        marginHorizontal: 8
    },
    horizontal: {
        height: 1,
        width: '100%',
        marginVertical: 8
    }
})

export default PMBDivider;