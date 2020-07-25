import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { User } from '../entities/user.entity';

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
        props.navigation.navigate("Parties list", {user})
    }

    useEffect(() => {
        
    }, []);

    return (
        <View style={style.container}>
            <Button 
                title='Log in with Google'
                onPress={() => signIn(goToParties, setSigninInProgress)}
                disabled={isSigninInProgress}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    }
});

export default LoginView;