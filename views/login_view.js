import axios from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { makeFullUrl } from '../utils';

const config = {
    expoClientId: '260269100580-5m6deds5j5fg0mcktvf6h36ine2ul2m9.apps.googleusercontent.com',
    iosClientId: '260269100580-mjn536bchrjebb4ns97p076t8h1d42sa.apps.googleusercontent.com',
    androidClientId: '260269100580-5vp9bfg6k4erkr5il5che90b63m4gvkv.apps.googleusercontent.com',
};

const getAppUserByGoogle = (userInfo, goNext) => {
    
    axios.post(makeFullUrl('/users/google_user_upd'), { userInfo })
        .then(response => {
            goNext(response.data);
        })
        .catch(err => console.log(err));
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

const LoginView = (props) => {

    const [isSigninInProgress, setSigninInProgress] = useState(false)

    const goToParties = (user) => {
        props.navigation.navigate("Parties list", {user})
    }

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