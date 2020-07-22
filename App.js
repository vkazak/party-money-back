import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { loadAsync } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import 'react-native-gesture-handler';
import { APP_COLOR, APP_FONT_BOLD } from './styles';
import PartiesListView from './views/parties_view/parties_view';
import PartyPaymentsView from './views/party_payments_view/party_payments_view';
import PartyReviewView from './views/party_review_view';
import PartyUsersView from './views/party_users_view/party_users_view';
import UsersListView from './views/users_view';

const Stack = createStackNavigator();

export default function App() {

    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        loadAsync({
            'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
            'Nunito Bold': require('./assets/fonts/Nunito-Bold.ttf'),
            'Nunito Semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf'),
        })
            .then(() => setLoaded(true))
    }, []);

    if (isLoaded) {
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
                    <Stack.Screen
                        name="Party payments"
                        component={PartyPaymentsView}
                    />
                    <Stack.Screen
                        name="Users in party"
                        component={PartyUsersView}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
    else {
        return <Text>Loading fonts...</Text>;
    }
}

const navigatorStyle = {
    headerStyle: {
        backgroundColor: APP_COLOR,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontFamily: APP_FONT_BOLD
    },
};