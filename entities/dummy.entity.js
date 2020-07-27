import axios from 'axios';
import { makeFullUrl } from '../utils';
import { User } from './user.entity';

export class Dummy {
    constructor(dbDummy) {
        this._id = dbDummy._id;
        this.name = dbDummy.name;
    }

    async create(creator) {
        const dummyToInsert = {
            userId: creator._id,
            name: this.name
        };
        console.log(dummyToInsert);
        const response = await axios.post(makeFullUrl('/dummies/add'), dummyToInsert);
        const dbDummy = response.data;
        const dummy = new Dummy(dbDummy);
        creator.addDummy(dummy);
        return User.dummyToUser(dummy);
    }
}