import { action, computed } from 'mobx';
import { Party } from '../entities/party.entity';
import { makeFullUrl, sortByCreatedAt } from '../utils';
import { MainStore } from './main.store';
import { DataStatus } from './pattern_store/async_data.store';
import { AsyncSaveStore } from './pattern_store/async_save.store';
import { EntitiesStore } from './pattern_store/entities.store';

export class PartiesStore extends EntitiesStore<Party> {
    mainStore: MainStore;

    @computed
    get parties() {
        return this.entities;
    }

    @action.bound
    setNumberOfMembersForParty(partyId: string, newNumber: number) {
        const partyToUpdate = this.parties.find(party => party._id === partyId);
        if (partyToUpdate !== undefined) {
            partyToUpdate.numberOfMembers = newNumber;
        }
    }

    constructor(mainStore: MainStore) {
        super();
        this.mainStore = mainStore;
    }

    async fetchPartiesFromServer() {
        if (this.dataStatus === DataStatus.INIT) {
            this.forceFetchPartiesFromServer();
        }
    }

    async forceFetchPartiesFromServer() {
        this.setFetchingStarted();
        const parties = await this.fetchEntitiesFromServer(
            makeFullUrl(`/parties/by_user/${this.mainStore.userStore.user._id}`),
            Party
        )
        this.setEntities(parties.sort(sortByCreatedAt));
        this.setDataStatusSuccess();
    }

    async createParty(name: string, asyncSaveStore: AsyncSaveStore) {
        this.createEntity(
            makeFullUrl('/parties/add'),
            { name, users: [this.mainStore.userStore.user._id] },
            true,
            Party,
            asyncSaveStore,
        );
    }
}