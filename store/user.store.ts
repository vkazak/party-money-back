import axios from 'axios';
import * as Google from 'expo-google-app-auth';
import { action, observable } from "mobx";
import { Member } from '../entities/member.entity';
import { makeFullUrl } from '../utils';

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
    @observable error: string = '';
    user: Member | undefined;

    @action.bound
    setLoginStatePending() {
        this.loginState = LoginState.PENDING
    }

    @action.bound
    setLoginStateError(err: string) {
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
            const logInResult = await Google.logInAsync(config);
            if (logInResult.type == 'success') { // smells TODO
                const appUser = await this.convertGoogleUserInfoToAppUser(logInResult.user);
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
            return ( new Member(dbUser) );
        } catch(err) {
            this.setLoginStateError(err);
        }
    }
}