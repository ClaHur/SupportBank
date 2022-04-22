"use strict";
/*
let fs = require("fs");
let text = fs.readFileSync("C:/Users/clahur/Work/Training/SupportBank/Transactions2014.csv").toString('utf-8');
let transactionsList = text.split("\n");

class Bank {
    people: Person[] = []; //Empty object to store list of people
    transactions: Transaction[] = []; //Empty object to store transactions

    addTransaction(trans: Transaction): void {
        this.transactions.push(trans); //Function to add transaction to transactions object
    }

    addPerson(pers: Person): void {
        this.people.push(pers); //Function to add person to people object
    }

    updateBalance(trans: Transaction) { //Function to add/remove transaction amount from transaction receiver/sender
        let sender = bank.people.find(pers => pers.name === trans.from);
        let receiver = bank.people.find(pers => pers.name === trans.to);
        if (typeof sender != "undefined") {
            sender.balance = parseFloat(parseFloat(sender.balance) - parseFloat(trans.amount)).toFixed(2); //Why is balance a string???
        }
        if (typeof receiver != "undefined") {
            receiver.balance = parseFloat(parseFloat(receiver.balance) + parseFloat(trans.amount)).toFixed(2);
        }
    }
}

//Person class
class Person {
    name: string;
    balance: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}

//TransactionClass
class Transaction {
    date: string;
    from: string;
    to: string;
    narrative: string;
    amount: number;

    constructor(date: string, from: string, to: string, narrative: string, amount: number) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}

//Add all transactions to transaction list
//While doing so, generate list of unique names
const bank = new Bank();
let names = [];
for (let i = 1; i < transactionsList.length - 1; i++) {
    let trans = transactionsList[i].split(",");
    bank.addTransaction(new Transaction(trans[0], trans[1], trans[2], trans[3], parseFloat(trans[4]).toFixed(2)));
    if (names.indexOf(trans[1]) == -1) {
        names.push(trans[1]);
    }
    if (names.indexOf(trans[2]) == -1) {
        names.push(trans[2]);
    }
}

//Use list of unique names to populate people list
for (let i = 0; i < names.length ; i++) {
    bank.addPerson(new Person(names[i]));
}

//Update balances of relevant people for all transactions
bank.transactions.forEach(bank.updateBalance);
console.log(bank.people);
*/ 
//# sourceMappingURL=indexBACKUP.js.map