import { Member } from "./member.entity";

export class Debt {
    fromMember: Member;
    toMember: Member;
    amount: number;
    
    constructor(fromMember: Member, toMember: Member, amount: number) {
        this.fromMember = fromMember;
        this.toMember = toMember;
        this.amount = amount;
    }
}

export class DebtsReport {
    summaryAmount: number;
    minPerPerson: number;
    maxPerPerson: number;
    debts: Array<Debt>;

    constructor(
        summaryAmount: number,
        minPerPerson: number,
        maxPerPerson: number,
        debts: Array<Debt>
    ) {
        this.summaryAmount = summaryAmount;
        this.minPerPerson = minPerPerson;
        this.maxPerPerson = maxPerPerson;
        this.debts = debts;
    }
}