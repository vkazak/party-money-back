import axios from 'axios';
import { makeFullUrl } from '../utils';
import { User } from './user.entity';

export class Payment {
    constructor(dbPayment) {
        this._id = dbPayment._id;
        this.party = dbPayment.party;
        this.amount = dbPayment.amount;
        this.description = dbPayment.description;
        this.createdAt = dbPayment.createdAt;
        if (dbPayment.user) {
            this.user = dbPayment.user;
        } else {
            this.user = User.dummyToUser(dbPayment.dummy);
        } 
    }

    async create() {
        const paymentToInsert = {
            partyId: this.party._id,
            description: this.description,
            amount: this.amount
        };
        if (this.user.isDummy) {
            paymentToInsert.dummyId = this.user._id;
        } else {
            paymentToInsert.userId = this.user._id;
        }
        
        const response = await axios.post(makeFullUrl(`/payments/add`), paymentToInsert);
        const dbPayment = response.data;
        const payment = new Payment(dbPayment);
        payment.user = this.user;
        this.party.addPayment(payment);
        return payment;
    }
}