import { NavigationContainer } from '@react-navigation/native';
import { loadAsync } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { TabNavigator } from './navigation/tab_navigation';
import LoginView from './views/login_view';
import { UserContext } from './context/user_context';

export default function App() {

    const [isLoaded, setLoaded] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        loadAsync({
            'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
            'Nunito Bold': require('./assets/fonts/Nunito-Bold.ttf'),
            'Nunito Semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf'),
        })
            .then(() => setLoaded(true))
    }, []);

    if (isLoaded) {
        
        if (user) {
            return (
                <UserContext.Provider value={user}>
                    <NavigationContainer>
                        <TabNavigator />
                    </NavigationContainer>
                </UserContext.Provider>
            )
        } else {
            return (
                <LoginView setUser={setUser}/>
            )
        }
    }
    else {
        return <Text>Loading fonts...</Text>;
    }
}