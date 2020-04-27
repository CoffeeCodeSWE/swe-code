//versione molto primitiva, but it...just works

const Regression = require('../vendor/regression');
const fs = require('fs');
const path = require('path');

//qui cambiare la directory con quella dove arrivano i file in input
let rawdata = fs.readFileSync(path.resolve(__dirname, "../js-examples/1-input-RL.json"));
let data = JSON.parse(rawdata);
//POST=(dentro a data c'è il file json, però in forma di oggetto)

var numVar =Object.keys(data.variables).length;
var numArr =(data.variables[Object.keys(data.variables)[0]]).length;
//POST=(numVar contiene il numero di variabili)
//POST=(numArr contiene il numero di parametri di ogni variabile (sempre uguale))

var reg = new Regression({ numX: numVar+1, numY: 1 })

//PRE=(niente in mano)
for(let j=0; j<numArr; ++j) { 
  let A = [];
  A.push(1);
  for(let i =0; i<numVar; ++i) {
    A.push(data.variables[Object.keys(data.variables)[i]][j]);
  }
  let yNow =[];
  yNow.push(data.target[Object.keys(data.target)][j]);
  reg.push({x: A, y: yNow});
}
//POST=(ha calcolato tutto)

console.log(reg.calculateCoefficients());