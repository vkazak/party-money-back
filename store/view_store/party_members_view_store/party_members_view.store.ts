import { observable, action } from "mobx";

export const PartyMembersViewDialogs = {
    NONE: 'NONE',
    ADD_MEMBERS: 'ADD_MEMBERS'
}

export class PartyMembersViewStore {
    @observable visibleDialog = PartyMembersViewDialogs.NONE;

    @action.bound
    closeDialog() {
        this.visibleDialog = PartyMembersViewDialogs.NONE;
    }

    @action.bound
    showAddMembersDialog() {
        this.visibleDialog = PartyMembersViewDialogs.ADD_MEMBERS;
    }
}