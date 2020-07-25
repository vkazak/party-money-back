
export class Debts {
    constructor(dbDepts, members) {
        this.sum = Number(dbDepts.spent).toFixed(1);
        this.perPerson = Number(dbDepts.perPerson).toFixed(1);
        
        const populate = (id) => members.find(member => member._id == id);
        this.debts = dbDepts.debts.map(debt => {
            return({
                from: populate(debt.from.id),
                to: populate(debt.to.id),
                amount: Number(debt.amount).toFixed(1)
            })
        });
    }
}