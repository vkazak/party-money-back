import { MainStore } from "../main.store";
import { PartyMembersStore } from "./party_members.store";
import { PartyPaymentsStore } from "./party_payments.store";

export class PartyReviewStore {
    _id: string;

    mainStore: MainStore;
    membersStore: PartyMembersStore;
    paymentsStore: PartyPaymentsStore;

    constructor(_id: string, mainStore: MainStore) {
        this._id = _id;
        this.mainStore = mainStore;
        this.membersStore = new PartyMembersStore(mainStore, this);
        this.paymentsStore = new PartyPaymentsStore(mainStore, this);
    }
}