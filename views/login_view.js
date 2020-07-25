import React, { useState, useEffect } from 'react';
import { Button, Icon } from 'react-native-elements';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { User } from '../entities/user.entity';
import { APP_COLOR, APP_FONT } from '../styles';

const config = {
    expoClientId: '260269100580-5m6deds5j5fg0mcktvf6h36ine2ul2m9.apps.googleusercontent.com',
    iosClientId: '260269100580-mjn536bchrjebb4ns97p076t8h1d42sa.apps.googleusercontent.com',
    androidClientId: '260269100580-5vp9bfg6k4erkr5il5che90b63m4gvkv.apps.googleusercontent.com',
};

const getAppUserByGoogle = (userInfo, goNext) => {
    User.getUserByGoogleUserInfo(userInfo)
        .then(goNext)
        .catch(console.log)
}

const signIn = async (goToParties, setSigninInProgress) => {
    try {
        setSigninInProgress(true);
        const { type, accessToken, user } = await Google.logInAsync(config);
        if (type == 'success') {
            getAppUserByGoogle(user, goToParties)
        }
    } catch (err) {
        console.log(err);
    } finally {
        setSigninInProgress(false)
    }
}

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

const LoginView = (props) => {

    const [isSigninInProgress, setSigninInProgress] = useState(false)

    const goToParties = (user) => {
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Parties list', params: { user } }]
        });
    }

    useEffect(() => {
        
    }, []);

    return (
        <View style={style.container}>
            <Button 
                buttonStyle={style.button}
                titleStyle={style.title}
                title='Log in with Google'
                onPress={() => signIn(goToParties, setSigninInProgress)}
                disabled={isSigninInProgress}
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