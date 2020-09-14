import { AsyncSaveStore } from '../../pattern_store/async_save.store';
import { observable, action } from 'mobx';

export class AddPaymentOverlayStore extends AsyncSaveStore {
    currentUserId: string;
    @observable pickedMemberId: string;
    @observable description: string = '';
    @observable amount: number = 0;

    @action.bound
    setDescription(description: string) {
        this.description = description;
    }

    @action.bound
    setAmount(amount: number) {
        this.amount = amount;
    }

    @action.bound
    setPickedMemberId(memberId: string) {
        this.pickedMemberId = memberId;
    } 

    @action.bound
    clearStore() {
        this.setDescription('');
        this.setAmount(0);
        this.setPickedMemberId(this.pickedMemberId);
        this.setSaveStatusInit();
    }

    constructor(currentUserId: string) {
        super();
        this.currentUserId = currentUserId;
        this.pickedMemberId = currentUserId;
    }
}