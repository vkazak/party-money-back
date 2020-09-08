import { User } from '../entities/user.entity'; // temporary solution. Change convertation userInfo to user in future
import * as Google from 'expo-google-app-auth';
import { makeFullUrl } from '../utils';
import axios from 'axios';
import { observable, action } from "mobx";

export const LoginState = {
    INIT: 'INIT',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

const config = {
    expoClientId: '260269100580-5m6deds5j5fg0mcktvf6h36ine2ul2m9.apps.googleusercontent.com',
    iosClientId: '260269100580-mjn536bchrjebb4ns97p076t8h1d42sa.apps.googleusercontent.com',
    androidClientId: '260269100580-5vp9bfg6k4erkr5il5che90b63m4gvkv.apps.googleusercontent.com',
};

export class UserStore {
    @observable loginState = LoginState.INIT;
    @observable error = '';
    @observable user = null; 

    @action.bound
    setLoginStatePending() {
        this.loginState = LoginState.PENDING
    }

    @action.bound
    setLoginStateError(err) {
        this.loginState = LoginState.ERROR;
        this.error = err;
    }

    @action.bound
    setLoginStateSuccess() {
        this.loginState = LoginState.SUCCESS;
    }

    async tryToLogIn() {
        try {
            this.setLoginStatePending();
            const { type, accessToken, user } = await Google.logInAsync(config);
            if (type == 'success') { // smells TODO
                const appUser = await this.convertGoogleUserInfoToAppUser(user);
                this.user = appUser;
                this.setLoginStateSuccess();
            }
        } catch (err) {
            this.setLoginStateError(err)
        }
    }
    
    // don't forget that it actually updates user in db. Settle updating TODO
    async convertGoogleUserInfoToAppUser(userInfo) {
        try {
            const response = await axios.post(makeFullUrl('/users/google_user_upd'), { userInfo });
            const dbUser = response.data;
            return ( new User(dbUser) );
        } catch(err) {
            this.setLoginStateError(err);
        }
    }
}