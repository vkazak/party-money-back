import { AsyncSaveStore } from '../../pattern_store/async_save.store';
import { observable, action } from 'mobx';

export class AddPartyOverlayStore extends AsyncSaveStore {
    ERROR_MESSAGE: string = 'Enter a valid name for a party';

    @observable partyName = '';
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
    setPartyName(partyName: string) {
        this.partyName = partyName;
        this.clearErrorMessage();
    } 

    @action.bound
    clearStore() {
        this.clearErrorMessage();
        this.setPartyName('');
        this.setSaveStatusInit();
    }

    checkPartyName() {
        if (this.partyName == '') {
            this.setErrorMessage();
            return false;
        } else {
            return true;
        }
    }
}