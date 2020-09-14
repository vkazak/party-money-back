import { AsyncSaveStore } from '../../pattern_store/async_save.store';
import { observable, action } from 'mobx';

export class AddDummyOverlayStore extends AsyncSaveStore {
    ERROR_MESSAGE: string = 'Enter a valid name for a dummy';

    @observable dummyName = '';
    @observable errorMessage = '';

    @action.bound
    setErrorMessage() {
        this.errorMessage = this.ERROR_MESSAGE;
    }

    @action.bound
    clearErrorMessage() {
        this.errorMessage = '';
    }

    @action.bound
    setDummyName(dummyName: string) {
        this.dummyName = dummyName;
        this.clearErrorMessage();
    } 

    @action.bound
    clearStore() {
        this.clearErrorMessage();
        this.setDummyName('');
        this.setSaveStatusInit();
    }

    checkDummyName() {
        if (this.dummyName == '') {
            this.setErrorMessage();
            return false;
        } else {
            return true;
        }
    }
}