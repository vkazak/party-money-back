import { observable, action } from "mobx";

export const PartyViewDialogs = {
    NONE: 'NONE',
    ADD_PARTY: 'ADD_PARTY'
}

export class PartiesViewStore {
    @observable visibleDialog = PartyViewDialogs.NONE;

    @action.bound
    closeDialog() {
        this.visibleDialog = PartyViewDialogs.NONE;
    }

    @action.bound
    showAddPartyDialog() {
        this.visibleDialog = PartyViewDialogs.ADD_PARTY;
    }
}