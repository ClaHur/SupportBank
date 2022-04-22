"use strict";
let fs = require("fs");
let text = fs.readFileSync("C:/Users/clahur/Work/Training/SupportBank/Transactions2014.csv").toString('utf-8');
let transactionsList = text.split("\n");
var readlineSync = require('readline-sync');
class Bank {
    constructor() {
        this.people = []; //Empty object to store list of people
        this.transactions = []; //Empty object to store transactions
    }
    addTransaction(trans) {
        this.transactions.push(trans); //Function to add transaction to transactions object
        this.updateBalance(trans);
    }
    addPerson(pers) {
        this.people.push(pers); //Function to add person to people object
    }
    updateBalance(trans) {
        let sender = bank.people.find(pers => pers.name === trans.from);
        let receiver = bank.people.find(pers => pers.name === trans.to);
        if (typeof sender != "undefined") {
            sender.balance = parseFloat(parseFloat(sender.balance) - parseFloat(trans.amount)).toFixed(2); //Why is balance a string???
        }
        if (typeof receiver != "undefined") {
            receiver.balance = parseFloat(parseFloat(receiver.balance) + parseFloat(trans.amount)).toFixed(2);
        }
    }
    listAccount(pers) {
        let transactions = bank.transactions.filter(trans => trans.to === pers.name || trans.from === pers.name);
        transactions.forEach(bank.logDateNarr);
    }
    listAll() {
        bank.people.forEach(bank.logNameBal);
    }
    logDateNarr(trans) {
        console.log(trans.date + " " + trans.narrative);
    }
    logNameBal(pers) {
        console.log(pers.name + " " + pers.balance);
    }
}
//Person class
class Person {
    constructor(name) {
        this.balance = 0;
        this.name = name;
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
//Add all transactions to transaction list
//While doing so, generate list of unique names
const bank = new Bank();
for (let i = 1; i < transactionsList.length - 1; i++) {
    let trans = transactionsList[i].split(",");
    let sender = bank.people.find(pers => pers.name === trans[1]);
    let receiver = bank.people.find(pers => pers.name === trans[2]);
    if (typeof sender === "undefined") {
        bank.addPerson(new Person(trans[1]));
        sender = bank.people.find(pers => pers.name === trans.from);
    }
    if (typeof receiver === "undefined") {
        bank.addPerson(new Person(trans[2]));
        receiver = bank.people.find(pers => pers.name === trans.to);
    }
    bank.addTransaction(new Transaction(trans[0], trans[1], trans[2], trans[3], parseFloat(trans[4]).toFixed(2)));
}
//Allow user to run commands, will run on a loop until user cancels
let commands = ["List Account", "List All"];
let accounts = [];
for (let i = 0; i < bank.people.length; i++) {
    accounts.push(bank.people[i].name);
}
let command;
let isLooping = true;
while (isLooping) {
    let command = readlineSync.keyInSelect(commands, "Which command?");
    switch (command) {
        case 0:
            let account = readlineSync.keyInSelect(accounts, "Which account?");
            if (account !== -1) {
                bank.listAccount(bank.people.find(pers => pers.name === accounts[account]));
            }
            break;
        case 1:
            bank.listAll();
            break;
        case -1:
            isLooping = false;
            break;
    }
}
//# sourceMappingURL=index.js.map