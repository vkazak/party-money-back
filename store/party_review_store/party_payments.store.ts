import { computed } from "mobx";
import { Debt, DebtsReport } from "../../entities/debts_report.entity";
import { Member } from "../../entities/member.entity";
import { Payment } from "../../entities/payment.entity";
import { makeFullUrl, sortByCreatedAt } from "../../utils";
import { MainStore } from "../main.store";
import { DataStatus } from "../pattern_store/async_data.store";
import { AsyncSaveStore } from "../pattern_store/async_save.store";
import { EntitiesStore } from "../pattern_store/entities.store";
import { PartyReviewStore } from "./party_review.store";

export class PartyPaymentsStore extends EntitiesStore<Payment> {
    private mainStore: MainStore;
    private partyReviewStore: PartyReviewStore;

    @computed
    get payments() {
        return this.entities;
    }

    constructor(mainStore: MainStore, partyReviewStore: PartyReviewStore) {
        super();
        this.mainStore = mainStore;
        this.partyReviewStore = partyReviewStore;
    }

    async fetchPartyPaymentsFromServer() {
        if (this.dataStatus === DataStatus.INIT) {
            this.forceFetchPartyPaymentsFromServer();
        }
    }

    async forceFetchPartyPaymentsFromServer() {
        try {
            this.setFetchingStarted();
            const payments = await this.fetchEntitiesFromServer(
                makeFullUrl(`/payments/by_party/${this.partyReviewStore._id}`),
                Payment
            );
            this.setEntities(payments.sort(sortByCreatedAt));
            this.setDataStatusSuccess();
        } catch(err) {
            this.setDataStatusError(err);
        }
    }

    async addPaymentToParty(
        member: Member, 
        forMembers: Array<Member>,
        amount: number, 
        description: string, 
        asyncSaveStore: AsyncSaveStore
    ) {
        const paymentToInsert: any = { 
            partyId: this.partyReviewStore._id, 
            amount, 
            description
        };
        if (member.isDummy) {
            paymentToInsert.dummyId = member._id;
        } else {
            paymentToInsert.userId = member._id;
        }
        paymentToInsert.forDummiesIds = forMembers.filter(member => member.isDummy).map(member => member._id);
        paymentToInsert.forUsersIds = forMembers.filter(member => !member.isDummy).map(member => member._id);
        console.log(paymentToInsert);
        
        this.createEntity(
            makeFullUrl(`/payments/add`),
            paymentToInsert,
            true,
            Payment,
            asyncSaveStore,
        );
    }

    get debtsReport() : DebtsReport {
        const membersStore = this.partyReviewStore.membersStore;
        const partyMembers = membersStore.members;
        const membersImpact = new Map<string, number>();
        const getImpact = (memberId: string) => {
            if (!membersImpact.has(memberId)) membersImpact.set(memberId, 0);
            return membersImpact.get(memberId) || 0;
        }
        const addImpact = (memberId: string, amount: number) => {
            membersImpact.set(memberId, getImpact(memberId) + amount);
        }
        this.payments.forEach(payment => {
            const appliedTo = payment.forMembers.length === 0 ? partyMembers : payment.forMembers;
            const personalImpact = payment.amount / appliedTo.length;
            appliedTo.forEach(member => addImpact(member._id, -personalImpact));
        });
        const minImpactAbs = -Math.max(...membersImpact.values());
        const maxImpactAbs = -Math.min(...membersImpact.values());
        this.payments.forEach(payment => addImpact(payment.member._id, payment.amount));
        const membersImpactsArr = [...membersImpact]
            .map(([memberId, impact]) => ({ memberId, impact }))
            .sort((a, b) => a.impact - b.impact);
        const EPS = 0.001;
        const debts: Array<Debt> = [];
        let minusImpactMemberIdx = 0, plusImpactMemberIdx = membersImpactsArr.length - 1;
        while (minusImpactMemberIdx < plusImpactMemberIdx) {
            if (membersImpactsArr[minusImpactMemberIdx].impact < EPS && membersImpactsArr[plusImpactMemberIdx].impact > EPS) {
                const minImpact = Math.min(
                    Math.abs(membersImpactsArr[minusImpactMemberIdx].impact),
                    membersImpactsArr[plusImpactMemberIdx].impact
                );
                membersImpactsArr[minusImpactMemberIdx].impact += minImpact;
                membersImpactsArr[plusImpactMemberIdx].impact -= minImpact;
                debts.push( new Debt(
                    membersStore.getById(membersImpactsArr[minusImpactMemberIdx].memberId),
                    membersStore.getById(membersImpactsArr[plusImpactMemberIdx].memberId),
                    minImpact
                ));
            }
            if (Math.abs(membersImpactsArr[minusImpactMemberIdx].impact) < EPS) minusImpactMemberIdx++;
            if (Math.abs(membersImpactsArr[plusImpactMemberIdx].impact) < EPS) plusImpactMemberIdx--;
        }
        return new DebtsReport(
            this.payments.reduce((sum, payment) => sum + payment.amount, 0),
            minImpactAbs,
            maxImpactAbs,
            debts
        )
    }
}