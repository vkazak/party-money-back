import axios, { config } from '../api_middleware/api_client';
import * as Google from 'expo-google-app-auth';
import { action, observable } from "mobx";
import { AsyncStorage } from 'react-native';
import { Member } from '../entities/member.entity';
import { makeFullUrl } from '../utils';

export const LoginState = {
    INIT: 'INIT',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

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

    async tryToLogInWithExistsCredentials() {
        try {
            this.setLoginStatePending();
            const response = await axios.get(makeFullUrl('/users/by_token'));
            const dbUser = response.data;
            this.user = new Member(dbUser);
            this.setLoginStateSuccess();
        } catch(err) {
            this.setLoginStateError(err);
        }
        
    }

    async getNewTokensAndLogIn() {
        try {
            this.setLoginStatePending();
            const logInResult = await Google.logInAsync(config);
            if (logInResult.type == 'success') { // smells TODO
                AsyncStorage.setItem('refreshToken', logInResult.refreshToken || '');
                AsyncStorage.setItem('accessToken', logInResult.accessToken || '');
                this.setUserStoreFromUserInfo(logInResult.user)
            }
        } catch (err) {
            this.setLoginStateError(err)
        }
    }
    
    // don't forget that it actually updates user in db. Settle updating TODO
    async setUserStoreFromUserInfo(userInfo) {
        try {
            const response = await axios.post(makeFullUrl('/users/google_user_upd'), { userInfo });
            const dbUser = response.data;
            this.user = new Member(dbUser);
            this.setLoginStateSuccess();
        } catch(err) {
            this.setLoginStateError(err);
        }
    }
}