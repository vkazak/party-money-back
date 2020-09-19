//TODO rename this file because it contains both dummies and users(friend in future)

import { computed } from "mobx";
import { Member } from "../entities/member.entity";
import { makeFullUrl } from "../utils";
import { MainStore } from "./main.store";
import { DataStatus } from "./pattern_store/async_data.store";
import { AsyncSaveStore } from "./pattern_store/async_save.store";
import { EntitiesStore } from "./pattern_store/entities.store";

export class DummiesStore extends EntitiesStore<Member> {
    mainStore: MainStore;

    @computed
    get dummies() {
        return this.entities.filter(member => member.isDummy)
    }

    @computed
    get all() {
        return this.entities
    }

    constructor(mainStore: MainStore) {
        super();
        this.mainStore = mainStore;
    }

    async fetchMembersFromServer() {
        if (this.dataStatus === DataStatus.INIT) {
            this.forceFetchMembersFromServer();
        }
    }

    async forceFetchMembersFromServer() {
        try {
            this.setFetchingStarted();
            const fetchDummies = this.fetchEntitiesFromServer(
                makeFullUrl(`/dummies/by_user/${this.mainStore.userStore.user?._id}`),
                Member
            );
            const fetchUsers = this.fetchEntitiesFromServer(makeFullUrl('/users'), Member);
            const members = (await Promise.all([fetchUsers, fetchDummies])).flat();
            this.setEntities(members);
            this.setDataStatusSuccess();
        } catch(err) {
            this.setDataStatusError(err);
        }
    }

    async createDummy(name: string, asyncSaveStore: AsyncSaveStore) {
        this.createEntity(
            makeFullUrl('/dummies/add'),
            { name, userId: this.mainStore.userStore.user?._id },
            false,
            Member,
            asyncSaveStore,
        );
    }
}