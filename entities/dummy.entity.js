import axios from 'axios';
import { makeFullUrl } from '../utils';

export class Dummy {
    constructor(dbDummy) {
        this._id = dbDummy._id;
        this.name = dbDummy.name;
    }
}