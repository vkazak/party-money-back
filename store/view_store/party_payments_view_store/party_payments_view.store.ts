import { observable, action } from "mobx";

export const PartyPaymentsViewDialogs = {
    NONE: 'NONE',
    ADD_PAYMENT: 'ADD_PAYMENT',
    DEBTS_REVIEW: 'DEBTS_REVIEW'
}

export class PartyPaymentsViewStore {
    @observable visibleDialog = PartyPaymentsViewDialogs.NONE;

    @action.bound
    closeDialog() {
        this.visibleDialog = PartyPaymentsViewDialogs.NONE;
    }

    @action.bound
    showAddPaymentDialog() {
        this.visibleDialog = PartyPaymentsViewDialogs.ADD_PAYMENT;
    }

    @action.bound
    showDebtsReviewDialog() {
        this.visibleDialog = PartyPaymentsViewDialogs.DEBTS_REVIEW;
    }
}