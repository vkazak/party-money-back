import axios from 'axios';
import { makeFullUrl } from '../utils';
import { Dummy } from './dummy.entity';
import { User } from './user.entity';

export class Party {
    constructor(dbParty) {
        this._id = dbParty._id
        this.name = dbParty.name;
        this.users = dbParty.users;
        this.dummies = dbParty.dummies;
        this.createdAt = dbParty.createdAt;
    }

    async create(creator) {
        const partyToInsert = {
            name: this.name,
            users: [creator._id]
        };
        const response = await axios.post(makeFullUrl('/parties/add'), partyToInsert);
        const dbParty = response.data;
        const party = new Party(dbParty);
        creator.addParty(party);

        return party;
    }

    async getDummies() {
        if (!this.isDummiesPopulated) {
            const response = await axios.get(makeFullUrl(`/dummies/by_party/${this._id}`));
            const dbDummies = response.data;
            this.dummies = dbDummies.map(dbDummy => new Dummy(dbDummy));
            this.isDummiesPopulated = true;
        }
        return this.dummies;
    }

    async getUsers() {
        if (!this.isUsersPopulated) {
            const response = await axios.get(makeFullUrl(`/users/by_party/${this._id}`));
            const dbUsers = response.data;
            this.users = dbUsers.map(dbUser => new User(dbUser));
            this.isUsersPopulated = true;
        }
        return this.users;
    }

    async getUsersAndDummiesAsUsers() {
        const users = await this.getUsers();
        const dummies = await this.getDummies();
        return User.joinUsersAndDummies(users, dummies);
    }

    async addMembers(members) {
        let dummies = [], users = [];
        members.forEach(member => {
            if (member.isDummy) {
                dummies.push(new Dummy(member))
            } else {
                users.push(member);
            }
        });
        const extractId = (member) => member._id;
        dummiesIds = dummies.map(extractId);
        usersIds = users.map(extractId);

        await axios.post(makeFullUrl(`/parties/addmembers`), { usersIds, dummiesIds, partyId: this._id});
        this.users = this.users.slice().concat(users);
        this.dummies = this.dummies.slice().concat(dummies);
        // be attentive to future bugs here about adding parties for user
    }
}