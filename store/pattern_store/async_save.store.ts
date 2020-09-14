import { observable, action } from "mobx";

export enum SaveStatus {
    INIT = 'INIT',
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export class AsyncSaveStore {
    @observable saveStatus = SaveStatus.INIT;
    @observable error = '';
    
    @action.bound
    setSaveStatusInit() {
        this.saveStatus = SaveStatus.INIT;
    }

    @action.bound
    setSaveStatusPending() {
        this.saveStatus = SaveStatus.PENDING;
    }

    @action.bound
    setSaveStatusSuccess() {
        this.saveStatus = SaveStatus.SUCCESS;
    }

    @action.bound
    setSaveStatusError(err: string) {
        this.saveStatus = SaveStatus.ERROR;
        this.error = err;
    }
}