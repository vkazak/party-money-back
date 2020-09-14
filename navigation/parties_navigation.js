import React from 'react';
import { NavigatorStyle } from '../styles';
import { createStackNavigator } from "@react-navigation/stack";
import { PartiesListView } from '../views/parties_view/parties_view';
import PartyPaymentsView from '../views/party_payments_view/party_payments_view';
import PartyReviewView from '../views/party_review_view';
import { PartyMembersView } from '../views/party_members_view/party_members_view';

const Stack = createStackNavigator();

export const PartiesNavigator = (props) => {
    return (
        <Stack.Navigator screenOptions={ NavigatorStyle }>
            <Stack.Screen
                name="Parties list"
                component={PartiesListView}
            />
            <Stack.Screen
                name="Party review"
                component={PartyReviewView}
            />
            <Stack.Screen
                name="Party payments"
                component={PartyPaymentsView}
            />
            <Stack.Screen
                name="Users in party"
                component={PartyMembersView}
            />
        </Stack.Navigator>
    )
}