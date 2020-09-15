import { AsyncSaveStore } from '../../pattern_store/async_save.store';
import { observable, action } from 'mobx';
import { Member } from '../../../entities/member.entity';

export const AddEditPaymentDialogs = {
    NONE: 'NONE',
    WHO_PAY: 'WHO_PAY',
    PAY_FOR: 'PAY_FOR'
}

export class AddEditPaymentViewStore extends AsyncSaveStore {
    currentUser: Member;
    @observable whoPay: Member;
    @observable payFor: Array<Member> = [];
    @observable description: string = '';
    private AMOUNT_ITERATION = 1;
    @observable amount: number = 0;
    @observable visibleDialog = AddEditPaymentDialogs.NONE;
    

    @action.bound
    setDescription(description: string) {
        this.description = description;
    }

    @action.bound
    setAmount(amount: number) {
        this.amount = amount;
    }

    @action.bound
    addAmunt() {
        this.amount += this.AMOUNT_ITERATION;
    }

    @action.bound
    subAmount() {
        this.amount -= this.AMOUNT_ITERATION;
    }

    @action.bound
    setWhoPay(member: Member) {
        this.whoPay = member;
    } 

    @action.bound
    setPayFor(members: Array<Member>) {
        this.payFor = members;
    }

    @action.bound
    showWhoPayDialog() {
        this.visibleDialog = AddEditPaymentDialogs.WHO_PAY;
    }

    @action.bound
    showPayForDialog() {
        this.visibleDialog = AddEditPaymentDialogs.PAY_FOR;
    }

    @action.bound
    closeDialog() {
        this.visibleDialog = AddEditPaymentDialogs.NONE;
    }

    @action.bound
    clearStore() {
        this.setDescription('');
        this.setAmount(0);
        this.setWhoPay(this.currentUser);
        this.setSaveStatusInit();
    }

    constructor(currentUser: Member) {
        super();
        this.currentUser = currentUser;
        this.whoPay = currentUser;
    }
}