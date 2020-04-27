const Regression = require('../vendor/regression');
const fs = require('fs');
const path = require('path');

//qui cambiare la directory con quella dove arrivano i file in input
let rawdata = fs.readFileSync(path.resolve(__dirname, "../js-examples/1-input-RL.json"));
let data = JSON.parse(rawdata);

//per prendere i valori della prima
console.log(data.variables.x);


//calcolo dei predittori

//con eventuale caricamento del vecchio json e del nuovo csv

//scrittura dei json di output