import { action, observable } from "mobx";
import { DummiesStore } from "./dummies.store";
import { PartiesStore } from "./parties.store";
import { PartyReviewStore } from "./party_review_store/party_review.store";
import { UserStore } from "./user.store";

export class MainStore {
    userStore: UserStore;
    partiesStore: PartiesStore;
    dummiesStore: DummiesStore;
    @observable partyReviewStores: Map<string, PartyReviewStore>;
    @observable currentPartyId: string = '';

    @action.bound
    setCurrentPartyId(id: string) {
        this.currentPartyId = id;
    }

    constructor() {
        this.userStore = new UserStore();
        this.partiesStore = new PartiesStore(this);
        this.dummiesStore = new DummiesStore(this);
        this.partyReviewStores = new Map();
    }

    get partyReviewStore() {
        if (!this.partyReviewStores.has(this.currentPartyId)) {
            this.partyReviewStores.set(
                this.currentPartyId, 
                new PartyReviewStore(this.currentPartyId, this)
            )
        }
        return this.partyReviewStores.get(this.currentPartyId)
    }
} 