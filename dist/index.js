"use strict";
const fs = require("fs-extra");
const readlineSync = require('readline-sync');
var parseString = require('xml2js').parseString;
let log4js = require("log4js");
const xmlConverter = function (date) {
    const utc_days = Math.floor(parseInt(date - 25569));
    const utc_value = utc_days * 86400;
    return moment.unix(utc_value);
};
var moment = require('moment');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'all' }
    }
});
const logger = log4js.getLogger("supportBank");
function loadFile(fileName) {
    let output, fileType;
    while (typeof output == "undefined") {
        try {
            if (fileName.includes(".csv")) {
                let text = fs.readFileSync(fileName).toString('utf-8');
                output = text.split("\n");
                output.shift();
                output.pop();
                fileType = "csv";
            }
            else if (fileName.includes(".json")) {
                output = JSON.parse(fs.readFileSync(fileName));
                fileType = "json";
            }
            else if (fileName.includes(".xml")) {
                let file = fs.readFileSync(fileName);
                parseString(file, function (err, data) {
                    output = data['TransactionList']['SupportTransaction'];
                });
                fileType = "xml";
            }
        }
        catch (e) {
            console.error(error);
            fileName = readlineSync.question("Invalid file name or format. Enter new file name: ");
            if (fileName === "DEFAULT") {
                fileName = "C:/Users/clahur/Work/Training/SupportBank/Transactions2014.csv";
            }
            else {
                fileName = "C:/Users/clahur/Work/Training/SupportBank/" + fileName;
            }
        }
    }
    return [output, fileType];
}
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
        let sender = this.people.find(pers => pers.name === trans.from);
        let receiver = this.people.find(pers => pers.name === trans.to);
        if (typeof sender != "undefined") {
            sender.balance -= trans.amount;
        }
        if (typeof receiver != "undefined") {
            receiver.balance += trans.amount;
        }
    }
    listAccount(pers) {
        let transactions = this.transactions.filter(trans => trans.to === pers.name || trans.from === pers.name);
        transactions.forEach(this.logDateNarr);
    }
    listAll() {
        this.people.forEach(this.logNameBal);
    }
    logDateNarr(trans) {
        console.log(trans.date.format("DD/MM/YYYY") + " " + trans.narrative);
    }
    logNameBal(pers) {
        console.log(pers.name + " " + pers.balance.toFixed(2));
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
function generateBank(fileType) {
    const bank = new Bank();
    for (let i = 0; i < transactionsList.length; i++) {
        var trans = [];
        var sender, receiver;
        if (fileType == "csv") {
            trans = transactionsList[i].split(",");
        }
        else if (fileType == "json") {
            let transObjJSON = transactionsList[i];
            trans = [transObjJSON.Date, transObjJSON.FromAccount, transObjJSON.ToAccount, transObjJSON.Narrative, transObjJSON.Amount];
        }
        else if (fileType == "xml") {
            let transObjXML = transactionsList[i];
            trans = [transObjXML["$"].Date, transObjXML.Parties[0]["From"][0], transObjXML.Parties[0]["To"][0], transObjXML.Description[0], transObjXML.Value[0]];
        }
        else {
            logger.error("Invalid file type provided");
            break;
        }
        sender = bank.people.find(pers => pers.name === trans[1]);
        receiver = bank.people.find(pers => pers.name === trans[2]);
        if (typeof sender === "undefined") {
            bank.addPerson(new Person(trans[1]));
            sender = bank.people.find(pers => pers.name === trans.from);
        }
        if (typeof receiver === "undefined") {
            bank.addPerson(new Person(trans[2]));
            receiver = bank.people.find(pers => pers.name === trans.to);
        }
        try {
            let validTransaction = true;
            var date;
            if (fileType === "csv") {
                date = moment(trans[0], "DD/MM/YYYY");
            }
            else if (fileType === "json") {
                date = moment(trans[0].substring(0, 10), "YYYY-MM-DD");
            }
            else if (fileType === "xml") {
                date = xmlConverter(trans[0]);
            }
            if (isNaN(date)) {
                logger.error("Invalid date provided: " + trans);
                console.log("Invalid date provided on transaction line " + i + ". Transaction provided: " + trans);
                console.log("Skipping this transaction and continuing.");
                validTransaction = false;
            }
            let from = trans[1].toString();
            let to = trans[2].toString();
            let narrative = trans[3].toString();
            let amount = parseFloat(trans[4]);
            if (isNaN(amount)) {
                logger.error("Invalid amount provided: " + trans);
                console.log("Invalid amount provided on transaction line " + i + ". Transaction provided: " + trans);
                console.log("Skipping this transaction and continuing.");
                validTransaction = false;
            }
            if (validTransaction) {
                bank.addTransaction(new Transaction(date, from, to, narrative, amount));
            }
        }
        catch (e) {
            logger.error("Invalid transaction input: " + trans);
            console.log("Invalid input, transaction not added");
        }
    }
    return bank;
}
//Allow user to run commands, will run on a loop until user cancels
function bankCommands(bank) {
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
                    var person = bank.people.find(pers => pers.name === accounts[account]);
                    if (typeof person !== "undefined") {
                        bank.listAccount(person);
                    }
                }
                break;
            case 1:
                bank.listAll();
                break;
            case -1:
                isLooping = false;
                break;
            default:
                break;
        }
    }
}
var file = readlineSync.question('What file would you like to load? Reply DEFAULT for Transactions2014: ');
if (file === "DEFAULT") {
    file = "C:/Users/clahur/Work/Training/SupportBank/Transactions2014.csv";
}
else {
    file = "C:/Users/clahur/Work/Training/SupportBank/" + file;
}
logger.trace("Starting SupportBank");
var loaded = loadFile(file);
var transactionsList = loaded[0];
var fileType = loaded[1];
var supportBank = generateBank(fileType);
bankCommands(supportBank);
//# sourceMappingURL=index.js.map