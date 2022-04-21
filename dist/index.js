"use strict";
let fs = require("fs");
let text = fs.readFileSync("C:/Users/clahur/Work/Training/SupportBank/Transactions2014.csv").toString('utf-8');
let transactions = text.split("\n");
console.log(transactions[0]);
class Bank {
    constructor() {
        this.transactions = [];
    }
    addTransaction(trans) {
        this.transactions.push(trans);
    }
}
//TransactionClass
class Transaction {
    constructor(date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}
const bank = new Bank();
for (let i = 1; i < transactions.length - 1; i++) {
    let trans = transactions[i].split(",");
    bank.addTransaction(new Transaction(trans[0], trans[1], trans[2], trans[3], trans[4]));
}
//const trans=new Transaction();
//# sourceMappingURL=index.js.map