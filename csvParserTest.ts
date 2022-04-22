import { parse } from 'csv';
let fs2 = require("fs");
var readline= require('readline-sync');
function loadCSV(fileName: string) {
    const parser=parse();
    // Read generated CSV data and send it to the parser
    let generator = fs2.readFileSync(fileName);
    var data;
    generator.on('readable', function(){
        while((data = generator.read()) !== null){
            parser.write(data);
        }
    });
// When generation is over, close the parser
    generator.on('end', function(){
        parser.end();
    });
    return data;
}

var file: string = readline.question('What file would you like to load? Reply DEFAULT for Transactions2014: ');
if (file === "DEFAULT") {
    file = "C:/Users/clahur/Work/Training/SupportBank/Transactions2014.csv"
} else {
    file = "C:/Users/clahur/Work/Training/SupportBank/" + file;
}
if (file.includes(".csv")) {
    let transactionsList = loadCSV(file);
}
