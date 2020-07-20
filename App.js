import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UsersListView from './views/users_view';
import PartiesListView from './views/parties_view/parties_view';
import PartyReviewView from './views/party_review_view/party_review_view';
import { APP_COLOR } from './styles';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={navigatorStyle}>
                <Stack.Screen
                    name="Users list"
                    component={UsersListView}
                />
                <Stack.Screen
                    name="Parties list"
                    component={PartiesListView}
                />
                <Stack.Screen
                    name="Party review"
                    component={PartyReviewView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const navigatorStyle = {
    headerStyle: {
        backgroundColor: APP_COLOR,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};