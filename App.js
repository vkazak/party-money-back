import { NavigationContainer } from '@react-navigation/native';
import { loadAsync } from 'expo-font';
import { observer } from 'mobx-react';
import React from 'react';
import { Text } from 'react-native';
import { StoreContext } from './context/store_context';
import { TabNavigator } from './navigation/tab_navigation';
import { MainStore } from './store/main.store';
import { LoginState } from './store/user.store';
import LoginView from './views/login_view';

@observer
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.store = new MainStore();
        this.userStore = this.store.userStore;
        this.state = {
            isFontLoaded: false
        };
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
                    <StoreContext.Provider value={this.store}>
                        <NavigationContainer>
                            <TabNavigator />
                        </NavigationContainer>
                    </StoreContext.Provider>
                )
            } else {
                return (
                    <StoreContext.Provider value={this.store}>
                        <LoginView/>
                    </StoreContext.Provider>
                   
                )
            }
        }
        else {
            return <Text>Loading fonts...</Text>;
        }
    }
}