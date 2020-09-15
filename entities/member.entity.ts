import { avatarUrl } from "../utils";

export class Member {
    _id: string;
    name: string;
    photoUrl: string = avatarUrl;
    email: string | undefined;
    createdAt: Date;
    isDummy: boolean;

    constructor(dbMember) {; 
        this._id = dbMember._id;
        this.name = dbMember.name;
        this.createdAt = dbMember.createdAt;
        this.isDummy = (dbMember.email === undefined);
        if (!this.isDummy) {
            this.photoUrl = dbMember.photoUrl;
            this.email = dbMember.email;
        }
    }
}