import { observable, action } from "mobx";

export const DummyViewDialogs = {
    NONE: 'NONE',
    ADD_DUMMY: 'ADD_DUMMY'
}

export class DummiesViewStore {
    @observable visibleDialog = DummyViewDialogs.NONE;

    @action.bound
    closeDialog() {
        this.visibleDialog = DummyViewDialogs.NONE;
    }

    @action.bound
    showAddDummyDialog() {
        this.visibleDialog = DummyViewDialogs.ADD_DUMMY;
    }
}