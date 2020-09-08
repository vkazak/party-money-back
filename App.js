import { NavigationContainer } from '@react-navigation/native';
import { loadAsync } from 'expo-font';
import React from 'react';
import { Text } from 'react-native';
import { TabNavigator } from './navigation/tab_navigation';
import LoginView from './views/login_view';
import { UserContext } from './context/user_context';
import { UserStore, LoginState } from './store/user.store';
import { observer } from 'mobx-react';

@observer
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.userStore = new UserStore();
        this.state = {
            isFontLoaded: false
        }
    }

    componentDidMount() {
        loadAsync({
            'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
            'Nunito Bold': require('./assets/fonts/Nunito-Bold.ttf'),
            'Nunito Semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf'),
        })
            .then(() => this.setState({ isFontLoaded: true }))
    }

    render() {
        if (this.state.isFontLoaded) {
            if (this.userStore.loginState == LoginState.SUCCESS) {
                return (
                    <UserContext.Provider value={this.userStore.user}>
                        <NavigationContainer>
                            <TabNavigator />
                        </NavigationContainer>
                    </UserContext.Provider>
                )
            } else {
                return (
                    <LoginView userStore={this.userStore}/>
                )
            }
        }
        else {
            return <Text>Loading fonts...</Text>;
        }
    }
}