import axios from '../../api_middleware/api_client';
import { autorun, computed } from "mobx";
import { Member } from "../../entities/member.entity";
import { makeFullUrl } from "../../utils";
import { MainStore } from "../main.store";
import { DataStatus } from "../pattern_store/async_data.store";
import { AsyncSaveStore } from "../pattern_store/async_save.store";
import { EntitiesStore } from "../pattern_store/entities.store";
import { PartyReviewStore } from "./party_review.store";

export class PartyMembersStore extends EntitiesStore<Member> {
    private mainStore: MainStore;
    private partyReviewStore: PartyReviewStore;

    @computed
    get members() {
        return this.entities;
    }

    private memberInParty(member: Member) {
        return this.members.some(partyMember => partyMember._id == member._id)
    }

    @computed
    get membersOutOfParty() {
        return this.mainStore.dummiesStore.all.filter(member => !this.memberInParty(member))
    }

    constructor(mainStore: MainStore, partyReviewStore: PartyReviewStore) {
        super();
        this.mainStore = mainStore;
        this.partyReviewStore = partyReviewStore;

        //update number of members on the parties list view
        autorun(() => {
            if (this.dataStatus == DataStatus.SUCCESS) {
                mainStore.partiesStore.setNumberOfMembersForParty(this.partyReviewStore._id, this.members.length)
            }
        });
    }

    async fetchPartyMembersFromServer() { 
        if (this.dataStatus === DataStatus.INIT) {
            this.forceFetchPartyMembersFromServer();
        }
    }

    async forceFetchPartyMembersFromServer() {
        try {
            this.setFetchingStarted();
            const fetchPartyUsers = this.fetchEntitiesFromServer(
                makeFullUrl(`/users/by_party/${this.partyReviewStore._id}`),
                Member
            );
            const fetchPartyDummies = this.fetchEntitiesFromServer(
                makeFullUrl(`/dummies/by_party/${this.partyReviewStore._id}`), 
                Member
            );
            const members = (await Promise.all([fetchPartyUsers, fetchPartyDummies])).flat();
            this.setEntities(members);
            this.setDataStatusSuccess();
        } catch(err) {
            this.setDataStatusError(err);
        }
    }

    async addMembersToParty(newMembers: Array<Member>, asyncSaveStore: AsyncSaveStore) {
        try { 
            asyncSaveStore.setSaveStatusPending();
            const dummiesIds = newMembers.filter(member => member.isDummy).map(member => member._id);
            const usersIds = newMembers.filter(member => !member.isDummy).map(member => member._id);
            await axios.post(makeFullUrl(`/parties/addmembers`), { usersIds, dummiesIds, partyId: this.partyReviewStore._id});
            this.appendEntites(newMembers);
            asyncSaveStore.setSaveStatusSuccess();
        } catch(err) {
            asyncSaveStore.setSaveStatusError(err);
        }
    }

    async fetchAllMembersIfNeeded() {
        this.mainStore.dummiesStore.fetchMembersFromServer();
    }
}