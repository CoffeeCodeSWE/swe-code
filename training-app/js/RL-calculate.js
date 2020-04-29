'use strict';
const Regression = require('../vendor/regression');
const fs = require('fs');
const path = require('path');

/*
function readJson() {
  let jsPath = path.resolve(__dirname, '../js-examples/1-input-RL.json');
  let rawdata = fs.readFileSync(jsPath);
  return JSON.parse(rawdata);
} */

function calculateMatrixDimensions(data) {
  let aux = data.variables;
  let columns = Object.keys(aux).length;
  let rows = (aux[Object.keys(aux)[0]]).length;
  return {'columns' : columns+1, 'rows' : rows};
}

function libAdaptation(data, matrix, reg) {
  for(let i=0; i<matrix.rows; ++i) { 
    let A = [];
    A.push(1);

    for(let j = 0; j < matrix.columns-1; ++j) {
      A.push(data.variables[Object.keys(data.variables)[j]][i]);
    }

    let yNow =[];
    yNow.push(data.target[Object.keys(data.target)][i]);
    reg.push({x: A, y: yNow});
  }
  return reg;
}

module.exports.rlFromScratch = function rlFromScratch(data) {

  let matrix = calculateMatrixDimensions(data);
  var reg = new Regression({numX: matrix.columns , numY: 1});
  return libAdaptation(data, matrix, reg);
}

function writeJson(reg) {
  let tuple = (Object.keys(reg).length);
  let intercept = reg[0];

  let aux = readJson().variables;
  let toN = Object.keys(aux).length;
  let variablesNames = [];
  for(let i=0; i < toN ; ++i) {
    variablesNames.push((Object.keys(aux))[i]);
  }

  let coefficents = {};
  for(let i=0; i<toN; ++i) {
    coefficents[variablesNames[i]] = reg[i+1];
  }

  let obj = {'tuple' : tuple , 'coefficents' : coefficents, 'intercept' : intercept};
  return JSON.stringify(obj);
}

function readOutJson() {
  let jsPath = path.resolve(__dirname, '../../file.json');
  let rawdata = fs.readFileSync(jsPath);
  let data = JSON.parse(rawdata);
  return {'tuple' : data.tuple , 'coefficienti' : data.coefficents};
}

/* calcolo RL da dati già esistenti
function rlFromExistingData() {
  let newData = readJson();
  let matrix = calculateMatrixDimensions(newData);
  var reg = new Regression({ numX: matrix.columns, numY: 1 });

  let oldData = readOutJson();
  let oldValues = []; //array contenente i valori della vecchia rl (quindi file di output)
  oldValues.push(1);
  //riempimento oldValues
  for(let i = 0; i < matrix.columns-1; ++i) {
    oldValues.push(oldData.coefficienti[Object.keys(oldData.coefficienti)[i]][0]);
  }

  for(let i = 1; i < oldData.tuple ; ++i) {
    reg.push();
  }

  reg.push({ x: oldValues, y: oldData.intercept });
  return libAdaptation(newData, matrix, reg);
}

*/

/* TODO:
 * - estensione del calcolo della rl
 * - gestione delle eccezioni
*/