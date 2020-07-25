import axios from 'axios';
import { makeFullUrl } from '../utils';
import { Party } from './party.entity';
import { sortByCreatedAt } from './entity.utils';

export class User {
    constructor(dbUser, isDummy) {
        this._id = dbUser._id;
        this.externalId = dbUser.externalId;
        this.name = dbUser.name;
        this.email = dbUser.email;
        this.firstName = dbUser.firstName;
        this.lastName = dbUser.lastName;
        this.photoUrl = dbUser.photoUrl;
        this.dummies = dbUser.dummies;
        this.isDummy = Boolean(isDummy);
        this.createdAt = dbUser.createdAt;
    }
    
    addParty(party) {
        this.parties = [party].concat(this.parties);
    }

    async getPartiesForUser() {
        if (!this.parties) {
            const response = await axios.get(makeFullUrl(`/parties/by_user/${this._id}`))
            const dbParties = response.data;
            this.parties = dbParties.map(dbParty => new Party(dbParty)).sort(sortByCreatedAt);
        };
        return this.parties;
    }

    async getDummies(filterFn = (() => true)) {
        if (!this.isDummiesPopulated) {
            const response = await axios.get(makeFullUrl(`/dummies/by_user/${this._id}`));
            this.dummies = response.data;
            this.isDummiesPopulated = true;
        }
        return ( this.dummies.filter(filterFn) );
    }

    static async getUsers(filterFn = (() => true)) {
        const response = await axios.get(makeFullUrl('/users'));
        const dbUsers = response.data;
        const users = dbUsers.map(dbUser => new User(dbUser)).filter(filterFn);
        return users;
    }

    static async getUserByGoogleUserInfo(userInfo) {
        const response = await axios.post(makeFullUrl('/users/google_user_upd'), { userInfo });
        const dbUser = response.data;
        return ( new User(dbUser) );
    }

    static async
}