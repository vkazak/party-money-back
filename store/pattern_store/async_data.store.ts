import { observable, action } from "mobx";

export const DataStatus = {
    INIT: 'INIT',
    LOADING: 'LOADING',
    UPDATING: 'UPDATING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
}

export class AsyncDataStore {
    @observable dataStatus = DataStatus.INIT;
    @observable error = '';
    
    @action.bound
    setDataStatusUpdating() {
        this.dataStatus = DataStatus.UPDATING;
    }

    @action.bound
    setDataStatusLoading() {
        this.dataStatus = DataStatus.LOADING;
    }

    @action.bound
    setDataStatusSuccess() {
        this.dataStatus = DataStatus.SUCCESS;
    }

    @action.bound
    setDataStatusError(err) {
        this.dataStatus = DataStatus.ERROR;
        this.error = err;
    }

    @action.bound
    setFetchingStarted() {
        if (this.dataStatus === DataStatus.INIT) {
            this.setDataStatusLoading()
        } else {
            this.setDataStatusUpdating()
        }
    }
}