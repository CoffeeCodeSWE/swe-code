'use strict';

const Regression = require('../vendor/regression');
const fs = require('fs');
const path = require('path');

function readJson() {
  let jsPath = path.resolve(__dirname, '../js-examples/1-input-RL.json');
  let rawdata = fs.readFileSync(jsPath);
  return JSON.parse(rawdata);
}

function readOutJson() {
  let jsPath = path.resolve(__dirname, '')
}

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

function rlFromScratch() {
  let data = readJson();
  let matrix = calculateMatrixDimensions(data);
  var reg = new Regression({numX: matrix.columns , numY: 1});
  return libAdaptation(data, matrix, reg);
}

function writeJson(reg) {
  let tuple = (Object.keys(reg).length) - 1;
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
  obj = JSON.stringify(obj);
  fs.writeFileSync('file.json', obj);
}



var reg = rlFromScratch();
writeJson(reg.calculateCoefficients());