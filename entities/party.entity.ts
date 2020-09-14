import { observable } from "mobx";

export class Party {
    _id: string;
    name: string;
    @observable numberOfMembers: number;
    createdAt: Date;

    constructor(dbParty) {
        this._id = dbParty._id;
        this.name = dbParty.name;
        this.numberOfMembers = dbParty.users.length + dbParty.dummies.length;
        this.createdAt = dbParty.createdAt;
    }
}