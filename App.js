import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserList from './components/users-view';
import PartiesList from './components/parties-view';
import PartyReview from './components/party-review-view';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Users list"
                    component={UserList}
                />
                <Stack.Screen
                    name="Parties list"
                    component={PartiesList}
                />
                <Stack.Screen
                    name="Party review"
                    component={PartyReview}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
