import React from 'react';
import { Button, Icon } from 'react-native-elements';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { APP_COLOR, APP_FONT } from '../styles';
import { observer } from 'mobx-react';
import { LoginState, UserStore } from '../store/user.store';
import { StoreContext } from '../context/store_context';
import { autorun } from 'mobx';

@observer
class LoginView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.userStore = context.userStore;
    }

    componentDidMount() {
        this.userStore.tryToLogInWithExistsCredentials();
    }

    render() {
        return (
            <View style={style.container}>
                <Button 
                    buttonStyle={style.button}
                    titleStyle={style.title}
                    title='Log in with Google'
                    onPress={() => this.userStore.getNewTokensAndLogIn()}
                    disabled={this.userStore.loginState == LoginState.PENDING}
                    icon={
                        <Icon
                            name="logo-google"
                            size={35}
                            color="white"
                            type="ionicon"
                            containerStyle={{ marginHorizontal: 15 }}
                        />
                    }
                />
            </View>
        )
    }
}
LoginView.contextType = StoreContext;

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
        shadowColor: 'grey',
    },
    title: {
        fontFamily: APP_FONT,
        marginRight: 15
    },
    button: {
        backgroundColor: APP_COLOR,
        opacity: 0.9,
        height: 60,
        borderRadius: 30,
    }
});

export default LoginView;