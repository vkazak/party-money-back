import axios from 'axios';
import { makeFullUrl } from '../utils';

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
}