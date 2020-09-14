import { Member } from "./member.entity";

export class Payment {
    _id: string;
    partyId: string;
    member: Member;
    forMembers: Array<Member> = [];
    amount: number;
    description: string;
    createdAt: Date;

    constructor(dbPayment) {
        this._id = dbPayment._id;
        this.partyId = dbPayment.party;
        this.amount = dbPayment.amount;
        this.description = dbPayment.description;
        this.createdAt = dbPayment.createdAt;

        const dbMember = dbPayment.user ? dbPayment.user : dbPayment.dummy;
        this.member = new Member(dbMember);
        if (dbPayment.forUsers) {
            this.forMembers.push(...dbPayment.forUsers.map(this.toMember))
        }
        if (dbPayment.forDummies) {
            this.forMembers.push(...dbPayment.forDummies.map(this.toMember))
        }
    }

    private toMember(dbMember) { return new Member(dbMember) }
}