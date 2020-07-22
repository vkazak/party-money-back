import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import makeFullUrl from '../../utils';
import { BodyContainer } from '../../components/component_containers';
import TouchableScale from 'react-native-touchable-scale';
import { Icon } from 'react-native-elements';
import listStyles, { APP_COLOR, APP_GREEN, APP_RED, APP_BLUE } from '../../styles';

const PartyCard = (props) => {

    return(
        <View style={[{flex: 0.5}, listStyles.block]}>
            <TouchableScale
                style={[cardStyle.container, {backgroundColor: props.backgroundColor}]}
                tension={20}
                friction={5}
                onPress={props.onPress}
            >
                
                <View >
                    <Icon
                        name={props.iconName}
                        size='100'
                        color='white'
                        type={props.iconType}
                    />
                </View>
            </TouchableScale>
        </View>
    )
}

const cardStyle = StyleSheet.create({
    container: {
        flex: 1, 
        borderRadius: 15, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})

const PartyReviewView = (props) => {
    const user = props.route.params.user;
    const party = props.route.params.party;

    const onPressPayments = () => {
        props.navigation.navigate("Party payments", {party, user})
    };
    const onPressUsers = () => {
        props.navigation.navigate("Users in party", {party, user})
    };
    return(
        <BodyContainer>
            <PartyCard
                backgroundColor={APP_GREEN}
                iconName='wallet'
                iconType='simple-line-icon'
                onPress={onPressPayments} 
            />
            <PartyCard 
                backgroundColor={APP_BLUE}
                iconName='people'
                iconType='simple-line-icon'
                onPress={onPressUsers}
            />
        </BodyContainer>
    )
}

export default PartyReviewView;