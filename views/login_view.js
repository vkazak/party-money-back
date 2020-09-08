import React from 'react';
import { Button, Icon } from 'react-native-elements';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { APP_COLOR, APP_FONT } from '../styles';
import { observer } from 'mobx-react';
import { LoginState } from '../store/user.store';

const checkExistingAccessTokenAndGo = async () => {
    try {
        const accessToken = AsyncStorage.getItem('accessToken');
        const userId = AsyncStorage.getItem('userId');
        if (accessToken && userId) {
            
        }
    } catch (err) {
        console.log(err)
    }
}

@observer
class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.userStore = props.userStore;
    }

    render() {
        return (
            <View style={style.container}>
                <Button 
                    buttonStyle={style.button}
                    titleStyle={style.title}
                    title='Log in with Google'
                    onPress={() => this.userStore.tryToLogIn()}
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